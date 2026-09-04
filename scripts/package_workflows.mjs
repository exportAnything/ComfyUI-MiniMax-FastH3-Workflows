import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.argv[2]) {
  throw new Error("Usage: node scripts/package_workflows.mjs <source-folder>");
}
const sourceRoot = path.resolve(process.argv[2]);
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const revisions = {
  diffusionGemma: "431f3965dbb0dfe85177e6d7d9d3b79bd4919663",
  dlssTemporal: "81171d18bc2a359d75cace2eadf13efc757d9b2d",
  fastH3: "c1798183d89f7143d021c16507e4bb7ac0b3decc",
  h3VaeOptimized: "14f3692dbcdec69221808bc30459a22c3e1d821f",
};

const specs = [
  {
    source: "MiniMax FastH3 FLF2VA RTX DLSS 5 Upscale + Neural Rendering.json",
    target: "workflows/flf2va/standard.json",
    id: "13c85f1e-69ae-49fc-b0f3-7f5972cacf2e",
    outputPrefix: "MiniMax_FastH3_FLF2VA",
    loadImageOverrides: {
      18: "user-input/flf2va/first-frame.png",
      62: "user-input/flf2va/optional-last-frame.png",
    },
  },
  {
    source:
      "MiniMax FastH3 FLF2VA RTX DLSS 5 Upscale + Neural Rendering + DiffusionGemma Director.json",
    target: "workflows/flf2va/diffusiongemma-director.json",
    id: "649ba672-960a-4d03-965f-ca7323159fe5",
    outputPrefix: "MiniMax_FastH3_FLF2VA_Director",
    loadImageOverrides: {
      18: "user-input/flf2va/first-frame.png",
      61: "user-input/flf2va/optional-last-frame.png",
    },
  },
  {
    source: "MiniMax FastH3 Ref2VA RTX DLSS 5 Upscale + Neural Rendering.json",
    target: "workflows/ref2va/standard.json",
    id: "3aba2e43-f1ab-438b-861c-4b5ef043b8f6",
    outputPrefix: "MiniMax_FastH3_Ref2VA",
    loadImageOverrides: {
      18: "user-input/ref2va/composition.png",
      51: "user-input/ref2va/subject-left.png",
      52: "user-input/ref2va/subject-right.png",
    },
  },
  {
    source:
      "MiniMax FastH3 Ref2VA RTX DLSS 5 Upscale + Neural Rendering + DiffusionGemma Director.json",
    target: "workflows/ref2va/diffusiongemma-director.json",
    id: "c817c234-9960-4f6d-bf53-d1e32b8102cc",
    outputPrefix: "MiniMax_FastH3_Ref2VA_Director",
    loadImageOverrides: {
      18: "user-input/ref2va/composition.png",
      63: "user-input/ref2va/subject-left.png",
      66: "user-input/ref2va/subject-right.png",
    },
  },
  {
    source: "MiniMax FastH3 T2VA RTX DLSS 5 Upscale + Neural Rendering.json",
    target: "workflows/t2va/standard.json",
    id: "5de09e34-5cdc-4050-91dc-1c89898ff522",
    outputPrefix: "MiniMax_FastH3_T2VA",
  },
  {
    source:
      "MiniMax FastH3 T2VA RTX DLSS 5 Upscale + Neural Rendering + GemmaDiffusion Director.json",
    target: "workflows/t2va/diffusiongemma-director.json",
    id: "c995996b-bc53-4424-83e2-208306ec688d",
    outputPrefix: "MiniMax_FastH3_T2VA_Director",
  },
];

function sanitizeNode(node, spec) {
  const properties = node.properties ?? (node.properties = {});

  if (node.type === "FastH3VSAPatch") {
    properties.aux_id = "exportAnything/ComfyUI-FastH3-VSA";
    properties.ver = revisions.fastH3;
  }

  if (node.type === "DLSS5NeuralRendering") {
    delete properties.cnr_id;
    properties.aux_id = "exportAnything/ComfyUI-DLSS5-NR-Temporal";
    properties.ver = revisions.dlssTemporal;
  }

  if (String(node.type).startsWith("DiffusionGemma")) {
    properties.cnr_id = "diffusiongemma-prompt-builder";
    properties.aux_id =
      "exportAnything/ComfyUI-DiffusionGemmaPromptBuilder";
    properties.ver = revisions.diffusionGemma;
  }

  if (node.type === "MiniMaxH3TRTVAEOptimizedLoader") {
    delete properties.cnr_id;
    properties.aux_id = "exportAnything/ComfyUI-H3VAE_TRT-Optimized";
    properties.ver = revisions.h3VaeOptimized;
  }

  if (node.type === "DiffusionGemmaModelLoader") {
    node.widgets_values[0] =
      "models/LLM/diffusiongemma-26B-A4B-it-NVFP4";
  }

  if (node.type === "LoadImage" && Array.isArray(node.widgets_values)) {
    const override = spec.loadImageOverrides?.[node.id];
    if (!override) {
      throw new Error(`Missing generic LoadImage mapping for node ${node.id}`);
    }
    node.widgets_values[0] = override;
  }

  if (
    node.type === "VHS_VideoCombine" &&
    node.widgets_values &&
    !Array.isArray(node.widgets_values) &&
    typeof node.widgets_values === "object"
  ) {
    delete node.widgets_values.videopreview;
    node.widgets_values.filename_prefix = spec.outputPrefix;
  }
}

for (const spec of specs) {
  const sourcePath = path.join(sourceRoot, spec.source);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source workflow: ${sourcePath}`);
  }

  const workflow = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  workflow.id = spec.id;
  workflow.nodes.forEach((node) => sanitizeNode(node, spec));
  workflow.extra ??= {};
  delete workflow.extra.workflow_note;
  delete workflow.extra.source_prompt_id;
  workflow.extra.release = {
    repository: "exportAnything/ComfyUI-MiniMax-FastH3-Workflows",
    source_filename: spec.source,
    packaged_on: "2026-09-04",
    dependency_revisions: revisions,
  };

  const targetPath = path.join(repositoryRoot, spec.target);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, `${JSON.stringify(workflow, null, 2)}\n`, "utf8");
}

console.log(`Packaged ${specs.length} workflows from ${sourceRoot}`);
