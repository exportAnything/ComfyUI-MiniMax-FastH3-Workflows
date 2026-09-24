# T2VA workflows

- [`standard.json`](standard.json) uses a direct prompt with DLSS neural rendering.
- [`diffusiongemma-director.json`](diffusiongemma-director.json) adds local DiffusionGemma prompt authoring and validation.
- [`4k-trtvae-rtx-vsr-ultra.json`](4k-trtvae-rtx-vsr-ultra.json) is a direct-prompt, four-step speed preset that generates on the saved 2.0 MP grid and uses RTX Video Super Resolution in `ULTRA` mode for exact 3840 × 2160 output. It does not use the DLSS node, and runtime depends on the host hardware.
- [`fasth3_5sec_in_5sec.json`](fasth3_5sec_in_5sec.json) preserves the original export and all settings byte-for-byte. See its [complete model list and setup notes](fasth3_5sec_in_5sec.md) for the six selected model artifacts and upstream TensorRT loader requirements.

None of the four workflows needs a `LoadImage` input.

The standard, Director, and 4K presets use the optimized decoder-only TensorRT VAE node and expect:

```text
ComfyUI/models/vae/h3vae_trt/minimax_h3_vae_decoder.engine
```

Build the fixed-B1 engine locally by following [ComfyUI-H3VAE_TRT-Optimized](https://github.com/exportAnything/ComfyUI-H3VAE_TRT-Optimized). For the first run, keep the saved seed, dimensions, VSA percentage, scheduler, sampler, TensorRT loader, and RTX upscale settings unchanged. Keep the DLSS settings unchanged in the two workflows that include that node.
