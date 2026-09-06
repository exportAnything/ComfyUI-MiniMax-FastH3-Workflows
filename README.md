# ComfyUI MiniMax FastH3 Workflows

Seven MiniMax H3 audio-video workflows for ComfyUI: T2VA, FLF2VA, and Ref2VA in direct-prompt and DiffusionGemma Director editions, plus a speed-first 4K T2VA workflow.

## Asset-free distribution

This repository intentionally contains **no images, video, audio, expected outputs, previews, publishing material, or other media assets**. Supply your own local inputs and review each workflow's prompt before running it. The saved `LoadImage` values are generic placeholders under `ComfyUI/input/user-input/`.

## Workflows

| Family | Direct prompt | DiffusionGemma Director | Local inputs |
| --- | --- | --- | --- |
| T2VA | [`workflows/t2va/standard.json`](workflows/t2va/standard.json) | [`workflows/t2va/diffusiongemma-director.json`](workflows/t2va/diffusiongemma-director.json) | None |
| FLF2VA | [`workflows/flf2va/standard.json`](workflows/flf2va/standard.json) | [`workflows/flf2va/diffusiongemma-director.json`](workflows/flf2va/diffusiongemma-director.json) | Your own first frame; optional last frame remains bypassed |
| Ref2VA | [`workflows/ref2va/standard.json`](workflows/ref2va/standard.json) | [`workflows/ref2va/diffusiongemma-director.json`](workflows/ref2va/diffusiongemma-director.json) | Your own composition and subject references |

The additional [`workflows/t2va/4k-trtvae-rtx-vsr-ultra.json`](workflows/t2va/4k-trtvae-rtx-vsr-ultra.json) preset is input-free T2VA. It retains the saved four-step FastH3 schedule, optimized TensorRT decoder, 2.0 MP generation grid, and RTX Video Super Resolution in `ULTRA` mode at exactly 3840 × 2160. Its runtime is hardware-dependent.

## Install dependencies

Install the exact node revisions and model files listed in [`DEPENDENCIES.md`](DEPENDENCIES.md). The workflow-specific repositories are:

- [ComfyUI-FastH3-VSA](https://github.com/exportAnything/ComfyUI-FastH3-VSA) at `c179818`
- [ComfyUI-DLSS5-NR-Temporal](https://github.com/exportAnything/ComfyUI-DLSS5-NR-Temporal) at `81171d1` for the six standard/Director workflows
- [ComfyUI-DiffusionGemmaPromptBuilder](https://github.com/exportAnything/ComfyUI-DiffusionGemmaPromptBuilder) at `431f396` for Director editions
- [ComfyUI-H3VAE_TRT-Optimized](https://github.com/exportAnything/ComfyUI-H3VAE_TRT-Optimized) at `14f3692` for T2VA

A fresh T2VA setup also needs [lihaoyun6/ComfyUI-H3VAE_TRT](https://github.com/lihaoyun6/ComfyUI-H3VAE_TRT) once to compile the fixed-B1 decoder engine. The upstream pack is not used by the packaged generation graphs after the engine exists.

## First run

1. Install the dependencies and model files.
2. Put your own inputs under `ComfyUI/input/user-input/`, or select them directly in each `LoadImage` node.
3. Import one JSON from `workflows/<family>/`.
4. Review the prompt and input roles, then keep the saved seed, resolution, sampler, VSA percentage, and enhancement settings unchanged for the first run.

The workflows retain their saved graph topology and generation settings, but no expected-output media is distributed for comparison. FastH3's preview checkpoint was trained for T2VA; the FLF2VA and Ref2VA graphs use its unsupported-conditioning override and remain experimental.

## Verify the checkout

```powershell
node scripts\verify_repository.mjs
```

The verifier checks all seven graphs, dependency revisions, portable paths, generic input placeholders, the 4K preset's critical settings, and confirms that the repository has no `assets/` directory.

## License

The MIT license covers this repository's workflow JSON, documentation, and maintenance scripts. Custom nodes, model files, user-supplied media, and generated outputs remain subject to their respective licenses and rights.
