import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedRevisions = {
  DiffusionGemma: "431f3965dbb0dfe85177e6d7d9d3b79bd4919663",
  DLSS5NeuralRendering: "81171d18bc2a359d75cace2eadf13efc757d9b2d",
  FastH3VSAPatch: "c1798183d89f7143d021c16507e4bb7ac0b3decc",
  MiniMaxH3TRTVAEOptimizedLoader: "14f3692dbcdec69221808bc30459a22c3e1d821f",
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function filesBelow(directory, predicate = () => true) {
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...filesBelow(candidate, predicate));
    else if (predicate(candidate)) output.push(candidate);
  }
  return output;
}

function walk(value, visitor, trail = "root") {
  visitor(value, trail);
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visitor, `${trail}[${index}]`));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) =>
      walk(item, visitor, `${trail}.${key}`),
    );
  }
}

function validateGraph(workflow, relative) {
  assert(Array.isArray(workflow.nodes), `${relative}: nodes must be an array`);
  assert(Array.isArray(workflow.links), `${relative}: links must be an array`);

  const nodes = new Map(workflow.nodes.map((node) => [node.id, node]));
  assert(nodes.size === workflow.nodes.length, `${relative}: duplicate node id`);
  const links = new Map(workflow.links.map((link) => [link[0], link]));
  assert(links.size === workflow.links.length, `${relative}: duplicate link id`);

  for (const link of workflow.links) {
    assert(link.length >= 6, `${relative}: malformed link ${link[0]}`);
    assert(nodes.has(link[1]), `${relative}: missing origin node for link ${link[0]}`);
    assert(nodes.has(link[3]), `${relative}: missing target node for link ${link[0]}`);
  }

  for (const node of workflow.nodes) {
    const inputs = Array.isArray(node.inputs)
      ? node.inputs
      : node.inputs && typeof node.inputs === "object"
        ? [node.inputs]
        : [];
    inputs.forEach((input, slot) => {
      if (input.link == null) return;
      const link = links.get(input.link);
      assert(link, `${relative}: node ${node.id} input references missing link`);
      assert(
        link[3] === node.id && link[4] === slot,
        `${relative}: node ${node.id} input/link backlink mismatch`,
      );
    });

    const outputs = Array.isArray(node.outputs)
      ? node.outputs
      : node.outputs && typeof node.outputs === "object"
        ? [node.outputs]
        : [];
    outputs.forEach((output, slot) => {
      for (const linkId of output.links ?? []) {
        const link = links.get(linkId);
        assert(link, `${relative}: node ${node.id} output references missing link`);
        assert(
          link[1] === node.id && link[2] === slot,
          `${relative}: node ${node.id} output/link backlink mismatch`,
        );
      }
    });
  }
}

const workflowFiles = filesBelow(path.join(root, "workflows"), (file) =>
  file.endsWith(".json"),
).sort();
assert(workflowFiles.length === 6, `Expected 6 workflows, found ${workflowFiles.length}`);

const workflowIds = new Set();
for (const file of workflowFiles) {
  const relative = path.relative(root, file).replaceAll("\\", "/");
  const workflow = JSON.parse(fs.readFileSync(file, "utf8"));
  assert(!workflowIds.has(workflow.id), `${relative}: duplicate workflow UUID`);
  workflowIds.add(workflow.id);
  validateGraph(workflow, relative);

  walk(workflow, (value, trail) => {
    if (typeof value === "string") {
      assert(
        !/^[A-Za-z]:[\\/]/.test(value),
        `${relative}: absolute local path at ${trail}`,
      );
    }
    if (trail.endsWith(".fullpath")) {
      throw new Error(`${relative}: stale fullpath preview metadata at ${trail}`);
    }
  });

  for (const node of workflow.nodes) {
    if (String(node.type).startsWith("DiffusionGemma")) {
      assert(
        node.properties?.ver === expectedRevisions.DiffusionGemma,
        `${relative}: stale DiffusionGemma revision on node ${node.id}`,
      );
    }
    if (expectedRevisions[node.type]) {
      assert(
        node.properties?.ver === expectedRevisions[node.type],
        `${relative}: stale ${node.type} revision on node ${node.id}`,
      );
    }
    if (node.type === "LoadImage") {
      const inputName = node.widgets_values?.[0];
      assert(
        typeof inputName === "string" && inputName.startsWith("user-input/"),
        `${relative}: LoadImage node ${node.id} must use a generic user-input path`,
      );
    }
    if (node.type === "VHS_VideoCombine") {
      assert(
        !Object.hasOwn(node.widgets_values ?? {}, "videopreview"),
        `${relative}: stale video preview metadata`,
      );
    }
  }
}

const refStandard = JSON.parse(
  fs.readFileSync(path.join(root, "workflows", "ref2va", "standard.json"), "utf8"),
);
const loadById = new Map(
  refStandard.nodes
    .filter((node) => node.type === "LoadImage")
    .map((node) => [node.id, node.widgets_values[0]]),
);
assert(
  loadById.get(51)?.endsWith("subject-left.png") &&
    loadById.get(52)?.endsWith("subject-right.png"),
  "Ref2VA standard Picture 2/Picture 3 order is not corrected",
);

assert(
  !fs.existsSync(path.join(root, "assets")),
  "The repository must not contain an assets directory",
);

console.log(
  `Verified ${workflowFiles.length} asset-free workflow graphs and ${workflowIds.size} unique UUIDs.`,
);
