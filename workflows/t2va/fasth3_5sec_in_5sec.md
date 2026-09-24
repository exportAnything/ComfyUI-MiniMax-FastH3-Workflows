# FastH3 five-second preset

Import [`fasth3_5sec_in_5sec.json`](fasth3_5sec_in_5sec.json) into ComfyUI. This is the original export, preserved byte-for-byte: prompts, settings, node layout, subgraph, model selections, and metadata are unchanged. No input images are connected. Generation time depends on hardware and caching; the filename is not a benchmark guarantee.

## Selected models

Paths below are relative to the ComfyUI folder. Keep the exact filenames selected in the workflow.

| Role | Selected file | Destination | Source |
| --- | --- | --- | --- |
| FastH3 diffusion model | `minimax_h3_fastvideo_vsa_datafree_1300step_4step_int8_convrot.safetensors` | `models/diffusion_models/` | [Kijai/MiniMax-H3-experimental](https://huggingface.co/Kijai/MiniMax-H3-experimental/blob/main/minimax_h3_fastvideo_vsa_datafree_1300step_4step_int8_convrot.safetensors) |
| Qwen text encoder | `qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors` | `models/text_encoders/` | [Comfy-Org/MiniMax-H3](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/text_encoders/qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors) |
| Audio VAE | `minimax_h3_audio_vae_fp32.safetensors` | `models/vae/` | [Comfy-Org/MiniMax-H3](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/vae/minimax_h3_audio_vae_fp32.safetensors) |
| TensorRT video VAE decoder | `minimax_h3_vae_decoder.engine` | `models/vae/h3vae_trt/` | Compile locally from the [H3 VAE ONNX files](https://huggingface.co/lihaoyun6/MiniMax-H3-VAE-ONNX/tree/main), as described below |
| TensorRT video VAE encoder | `minimax_h3_vae_encoder.engine` | `models/vae/h3vae_trt/` | Compile locally from the [H3 VAE ONNX files](https://huggingface.co/lihaoyun6/MiniMax-H3-VAE-ONNX/tree/main), as described below |
| Turbo LoRA, checkpoint 500 non-EMA | `minimax_h3_turbo_4step_ckpt500_pruned_comfyui.safetensors` | `models/loras/` | [drbaph/MiniMax-H3-Turbo-Lora-ComfyUI](https://huggingface.co/drbaph/MiniMax-H3-Turbo-Lora-ComfyUI/blob/main/minimax_h3_turbo_4step_ckpt500_pruned_comfyui.safetensors) |

The subgraph's `UNETLoader` node 6 also retains `minimax_h3_fl2va_pruned_int8_convrot.safetensors` in its internal default and model-download metadata ([original source](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/diffusion_models/minimax_h3_fl2va_pruned_int8_convrot.safetensors)). The exposed model selection on node 105 overrides it with the FastH3 checkpoint above. This seventh filename is preserved metadata, not an additional model used by the saved execution path.

Model weights and engine files are not included in this repository.

## TensorRT engines and node dependencies

This export uses `MiniMaxH3TRTVAELoader` from [lihaoyun6/ComfyUI-H3VAE_TRT](https://github.com/lihaoyun6/ComfyUI-H3VAE_TRT), recorded revision `7131a316160b2f299239b9bc40621be46d8ce62f`. Both engines remain selected in the saved loader, including the encoder even though no first/last images are connected. This is a different loader from the optimized decoder-only node used in the other T2VA presets.

For a fresh setup, obtain `minimax_h3_vae_decoder.onnx`, `minimax_h3_vae_decoder.onnx.data`, and `minimax_h3_vae_encoder.onnx` from the [ONNX model repository](https://huggingface.co/lihaoyun6/MiniMax-H3-VAE-ONNX/tree/main). Follow the [upstream compiler instructions](https://github.com/lihaoyun6/ComfyUI-H3VAE_TRT#usage) to build both engines locally and place the resulting files in `models/vae/h3vae_trt/`. The saved selections use Windows separators (`h3vae_trt\minimax_h3_vae_decoder.engine` and `h3vae_trt\minimax_h3_vae_encoder.engine`). TensorRT engines depend on the build environment and GPU; rebuild them for the target machine.

Also install:

- [ComfyUI-FastH3-VSA](https://github.com/exportAnything/ComfyUI-FastH3-VSA), recorded revision `c1798183d89f7143d021c16507e4bb7ac0b3decc`, including its documented ComfyUI/Comfy Kitchen prerequisites.
- [RES4LYF](https://github.com/ClownsharkBatwing/RES4LYF), which registers the saved `bong_tangent` scheduler used by the core `BasicScheduler` node. The inspected local installation is at `e716cd1cb2c5cff90131bf4914b75b75a0489d48`; this revision is not embedded in the workflow.
- ComfyUI with the exported core nodes and subgraph support. The export records ComfyUI `0.33.1` and frontend `1.48.7`.

## Saved settings

The connected inputs and exposed controls on node 105 take precedence over internal subgraph widget defaults.

| Setting | Saved value |
| --- | --- |
| Resolution selector | `4:3 (Standard)`, `0.1` megapixels, multiple `32`; resolves to `384 × 288` with the inspected local core selector |
| Duration | `5` seconds; the saved frame-alignment expression yields `124` frames at `24` fps (about `5.17` seconds) |
| Seed | `1064212532162651`; the internal noise node also retains a saved `randomize` control value |
| Sampler / scheduler / steps | `euler` / `bong_tangent` / `3` |
| Denoise | `1.0` |
| FastH3 VSA keep percentage | `22` |
| LoRA model strength | `0.12` |
| Output | `SaveVideo`, prefix `minimax_h3/t2va`, format `mp4`, codec `auto` |

The exposed width/height widgets retain `1344 × 768`, but the connected resolution selector supplies the dimensions. Internal defaults and the older embedded workflow note describe some different settings; they are preserved as part of the original file and do not replace the connected values above.

## Integrity

Original SHA-256: `f33796d9d5844330102d1cbd3a11afa21d5ac413c1b88afc0d0a585bf8ed4a69`.

The repository verifier checks this hash. Validation for this upload is static; no generation or timing benchmark was run.
