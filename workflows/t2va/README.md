# T2VA workflows

`standard.json` uses a direct prompt. `diffusiongemma-director.json` adds local DiffusionGemma prompt authoring and validation. Neither workflow needs a `LoadImage` input.

Both use the optimized decoder-only TensorRT VAE node and expect:

```text
ComfyUI/models/vae/h3vae_trt/minimax_h3_vae_decoder.engine
```

Build the fixed-B1 engine locally by following [ComfyUI-H3VAE_TRT-Optimized](https://github.com/exportAnything/ComfyUI-H3VAE_TRT-Optimized). For the first run, keep the saved seed, dimensions, VSA percentage, scheduler, sampler, TensorRT loader, DLSS settings, and RTX upscale settings unchanged.
