# Ref2VA workflows

`standard.json` uses a direct MiniMax H3 prompt. `diffusiongemma-director.json` adds DiffusionGemma prompt authoring and validation.

No media is bundled. Supply your own references or change the `LoadImage` selections before running:

1. `user-input/ref2va/composition.png` — Picture 1, composition and lighting reference.
2. `user-input/ref2va/subject-left.png` — Picture 2 / Subject 1.
3. `user-input/ref2va/subject-right.png` — Picture 3 / Subject 2.

The Director graph actively uses all three pictures. The standard graph actively uses Picture 1 while its Picture 2 and Picture 3 load/resize branches remain bypassed. No expected-output video is distributed.

Both graphs enable FastH3's unsupported-conditioning override. Ref2VA was not the preview checkpoint's trained mode, so results remain experimental even with a fixed seed.
