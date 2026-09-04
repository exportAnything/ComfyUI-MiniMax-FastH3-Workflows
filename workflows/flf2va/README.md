# FLF2VA workflows

`standard.json` uses a direct MiniMax H3 prompt. `diffusiongemma-director.json` adds local DiffusionGemma prompt authoring and validation before the same generation and enhancement path.

No media is bundled. Supply your own local files or change the `LoadImage` selections before running:

- Active first frame: `user-input/flf2va/first-frame.png`
- Optional last frame: `user-input/flf2va/optional-last-frame.png`

The optional last-frame branch remains bypassed in both saved graphs. Both workflows retain their original fixed seed and use `allow_unsupported_conditioning=true` because the FastH3 preview checkpoint was trained for T2VA rather than FLF2VA.
