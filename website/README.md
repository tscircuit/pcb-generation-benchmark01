# PCB benchmark comparison website

Static presentation of the preserved two-method pilot. Build the derived PCB views with `bun run website:views`, then run `bun run website:build` from the repository root. The build reads the pinned evaluation and frozen prompt inputs; it does not run generation or scoring.

Publish with `ohmx-box publish-html --json website/dist --title 'PCB Generation Benchmark 01'`. For an intentional update to that existing website, add `--replace`.

Public URL: https://0hmx.com/artifacts/pcb-generation-benchmark-01/

The publication bundle contains only the generated HTML/CSS, selected result fields, recorded previews and final native KiCad files. Nineteen previews were recorded; the KiCad I2C hub preview is unavailable. Source logs and local environment details are not included. Unknown scores remain unknown.

Each KiCad design offers original schematic, PCB and project downloads plus a ZIP. `download-manifest.json` records source paths and SHA-256 checksums; published native bytes match the retained final attempts.

PCB viewers use read-only KiCad 10 per-layer SVG exports and preserved tscircuit SVG layer data. All displayed layers start at 50% opacity, with zoom, pan, visibility and opacity controls. `dist/views/manifest.json` records sources and hashes. Original previews, design files and scores are preserved. Rendering uses `KICAD_CLI` or `kicad-cli` on PATH.

The comparison layout targets desktop: two persistent columns, up to 1840px of page width, and 640px tall viewers. Explicit iframe dimensions prevent fallback to the browser's 300×150 default. Stylesheet and viewer URLs include content hashes to prevent stale cached layouts after updates.

The tscircuit previews now use `@tscircuit/pcb-viewer` 1.11.393 directly with byte-for-byte copies of each final `circuit.json`. `tscircuit-viewer.tsx` mounts the native React viewer with editing disabled and adds opacity controls over the package's `.pcb-layer-*` canvases. Those presentation hooks are version-pinned; the native toolbar remains available for measurements and overlays. Bun bundles the viewer locally, without CDN dependencies.

KiCad continues to use native CLI SVG exports. Its controls include layer visibility, per-layer opacity, solo mode, front/back/copper presets, wheel zoom, pan, fit, and fullscreen. Clicking a drawn shape or stroked text selects that drawing item for independent opacity or hiding. This selection is a drawing item, not a semantic KiCad component. Item opacity multiplies layer opacity; restoring items and resetting layers are separate controls. None of these controls edits benchmark design files.

`website/dist/` is generated output and is ignored by Git. Run `bun run build` to recreate it before website validation or publication. The source files, recorded benchmark inputs, and package lockfile are tracked.
