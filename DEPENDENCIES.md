# Dependencies

This file records the versions exported by the six workflows on 2026-09-04. Install the workflow-specific repositories at their exact revisions first; use each repository's own installation instructions for native builds and Python packages.

## Workflow-specific repositories

| Repository | Exact revision | Used by | Purpose |
| --- | --- | --- | --- |
| [exportAnything/ComfyUI-FastH3-VSA](https://github.com/exportAnything/ComfyUI-FastH3-VSA) | `c1798183d89f7143d021c16507e4bb7ac0b3decc` | All six | Learned VSA patch for the FastH3 preview checkpoint |
| [exportAnything/ComfyUI-DLSS5-NR-Temporal](https://github.com/exportAnything/ComfyUI-DLSS5-NR-Temporal) | `81171d18bc2a359d75cace2eadf13efc757d9b2d` | All six | Temporal DLSS 5 neural-rendering node |
| [exportAnything/ComfyUI-DiffusionGemmaPromptBuilder](https://github.com/exportAnything/ComfyUI-DiffusionGemmaPromptBuilder) | `431f3965dbb0dfe85177e6d7d9d3b79bd4919663` | Three Director editions | Local DiffusionGemma prompt authoring, H3 reference policy, validation, and generation gate |
| [exportAnything/ComfyUI-H3VAE_TRT-Optimized](https://github.com/exportAnything/ComfyUI-H3VAE_TRT-Optimized) | `14f3692dbcdec69221808bc30459a22c3e1d821f` | Both T2VA editions | Decoder-only optimized TensorRT H3 VAE loader |

The FastH3 repository's pinned ComfyUI patch and Comfy Kitchen build are part of the tested VSA contract. Do not substitute an ordinary package with the same version label without following that repository's verification steps.

## Other custom nodes

| Package recorded in workflow | Exported version | Official repository | Used by |
| --- | --- | --- | --- |
| `comfyui_nvidia_rtx_nodes` | `0.1.3` | [Comfy-Org/Nvidia_RTX_Nodes_ComfyUI](https://github.com/Comfy-Org/Nvidia_RTX_Nodes_ComfyUI) | All six |
| `comfyui-videohelpersuite` | `1.7.9` | [Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite) | All six |
| `comfyui-kjnodes` | `1.4.8` | [Kijai/ComfyUI-KJNodes](https://github.com/Kijai/ComfyUI-KJNodes) | FLF2VA and Ref2VA |
| `rgthree-comfy` | `1.0.2607232129` | [rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy) | FLF2VA and Ref2VA |
| `comfyui_essentials` | `1.1.0` | [cubiq/ComfyUI_essentials](https://github.com/cubiq/ComfyUI_essentials) | FLF2VA and Ref2VA |
| `comfyui-easy-use` | `1.3.6` | [yolain/ComfyUI-Easy-Use](https://github.com/yolain/ComfyUI-Easy-Use) | T2VA Director only |

The remaining nodes are provided by [ComfyUI core](https://github.com/Comfy-Org/ComfyUI). These exports were built and checked against ComfyUI `0.33.1` and frontend `1.48.7`.

## Model files

### All six workflows

| File/folder | Destination under ComfyUI | Source |
| --- | --- | --- |
| `minimax_h3_fastvideo_vsa_datafree_1300step_4step_int8_convrot.safetensors` | `models/diffusion_models/` | [Kijai/MiniMax-H3-experimental](https://huggingface.co/Kijai/MiniMax-H3-experimental/blob/main/minimax_h3_fastvideo_vsa_datafree_1300step_4step_int8_convrot.safetensors) |
| `qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors` | `models/text_encoders/` or a configured text-encoder path | [Comfy-Org/MiniMax-H3 text encoders](https://huggingface.co/Comfy-Org/MiniMax-H3/tree/main/text_encoders) |
| `minimax_h3_audio_vae_fp32.safetensors` | `models/vae/` | [Comfy-Org/MiniMax-H3 VAE files](https://huggingface.co/Comfy-Org/MiniMax-H3/tree/main/vae) |

### FLF2VA and Ref2VA

| File | Destination | Source |
| --- | --- | --- |
| `minimax_h3_video_vae_fp16.safetensors` | `models/vae/` | [Comfy-Org/MiniMax-H3 VAE files](https://huggingface.co/Comfy-Org/MiniMax-H3/tree/main/vae) |

### T2VA

| File | Destination | Source/instructions |
| --- | --- | --- |
| `minimax_h3_vae_decoder.onnx` and `minimax_h3_vae_decoder.onnx.data` | `models/vae/h3vae_trt/` | [lihaoyun6/MiniMax-H3-VAE-ONNX](https://huggingface.co/lihaoyun6/MiniMax-H3-VAE-ONNX) |
| `minimax_h3_vae_decoder.engine` | `models/vae/h3vae_trt/` | Build locally with the fixed-B1 workflow documented by [ComfyUI-H3VAE_TRT-Optimized](https://github.com/exportAnything/ComfyUI-H3VAE_TRT-Optimized) |

To create that conventional fixed-B1 engine on a fresh installation, install [lihaoyun6/ComfyUI-H3VAE_TRT](https://github.com/lihaoyun6/ComfyUI-H3VAE_TRT) as a build-time custom node, restart ComfyUI, and run `examples/Build_H3_TRT_Decoder_Upstream_B1.json` from the optimized repository once. The upstream pack is not part of the two packaged T2VA generation graphs after the engine exists.

TensorRT engine plans are tied to the TensorRT/CUDA/GPU environment. Do not download or redistribute an engine built for another machine and assume it is compatible.

### DiffusionGemma Director editions

| Folder | Destination | Source |
| --- | --- | --- |
| `diffusiongemma-26B-A4B-it-NVFP4` | `models/LLM/diffusiongemma-26B-A4B-it-NVFP4/` | [nvidia/diffusiongemma-26B-A4B-it-NVFP4](https://huggingface.co/nvidia/diffusiongemma-26B-A4B-it-NVFP4) |

Model weights are intentionally not stored in this repository. Read and accept the license attached to each model before downloading it.

## Tested machine, not a minimum specification

The local source environment used ComfyUI `0.33.1`, Python `3.11`, PyTorch `2.10.0+cu130`, Comfy Kitchen `0.2.31` from the FastH3 repository's pinned official build, TensorRT `11.2.1.2`, and an NVIDIA RTX PRO 4500 Blackwell with 32 GiB VRAM. These values describe the validated machine; they are not a promise that less hardware will work.
