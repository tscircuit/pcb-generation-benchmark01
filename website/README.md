# PCB benchmark comparison website

Static presentation of the preserved two-method pilot. Build the derived PCB views with `bun run website:views`, then run `bun run website:build` from the repository root. The build reads the pinned evaluation and frozen prompt inputs; it does not run generation or scoring.

Publish with `ohmx-box publish-html --json website/dist --title 'PCB Generation Benchmark 01'`. For an intentional update to that existing website, add `--replace`.

Public URL: https://0hmx.com/artifacts/pcb-generation-benchmark-01/

The publication bundle contains only the generated HTML/CSS, selected result fields, recorded previews and final native KiCad files. Nineteen previews were recorded; the KiCad I2C hub preview is unavailable. Sanitized supplementary transcripts include recorded tool output and relevant local paths; full session archives are not included. Unknown scores remain unknown.

Each KiCad design offers original schematic, PCB and project downloads plus a ZIP. `download-manifest.json` records source paths and SHA-256 checksums; published native bytes match the retained final attempts.

PCB viewers use read-only KiCad 10 per-layer SVG exports and preserved tscircuit SVG layer data. All displayed layers start at 50% opacity, with zoom, pan, visibility and opacity controls. `dist/views/manifest.json` records sources and hashes. Original previews, design files and scores are preserved. Rendering uses `KICAD_CLI` or `kicad-cli` on PATH.

The comparison layout targets desktop: two persistent columns, up to 1840px of page width, and 640px tall viewers. Explicit iframe dimensions prevent fallback to the browser's 300×150 default. Stylesheet and viewer URLs include content hashes to prevent stale cached layouts after updates.

The tscircuit previews now use `@tscircuit/pcb-viewer` 1.11.393 directly with byte-for-byte copies of each final `circuit.json`. `tscircuit-viewer.tsx` mounts the native React viewer with editing disabled and adds opacity controls over the package's `.pcb-layer-*` canvases. Those presentation hooks are version-pinned; the native toolbar remains available for measurements and overlays. Bun bundles the viewer locally, without CDN dependencies.

KiCad continues to use native CLI SVG exports. Its controls include layer visibility, per-layer opacity, solo mode, front/back/copper presets, wheel zoom, pan, fit, and fullscreen. Clicking a drawn shape or stroked text selects that drawing item for independent opacity or hiding. This selection is a drawing item, not a semantic KiCad component. Item opacity multiplies layer opacity; restoring items and resetting layers are separate controls. None of these controls edits benchmark design files.

`website/dist/` is generated output and is ignored by Git. Run `bun run build` to recreate it before website validation or publication. The source files, recorded benchmark inputs, and package lockfile are tracked.
## Timing and recovered chats

The table and design cards display each original `run.json` total duration in seconds. A null duration can have a separately labeled `ended_at - started_at` derived total; raw records stay unchanged. The tscircuit voltage divider is the sole such run in this pilot (265.941775 seconds). Generation-only duration is unavailable for every run. Total run windows include validation and repairs and are not isolated generation measurements. JSON retains full precision; HTML rounds to milliseconds.

Every run links to a readable transcript page and its supplementary JSON evidence. All 20 transcripts are **incomplete**: 18 dedicated sessions have encrypted delegation content, and two parent-generated runs have conservatively attributed excerpts. Each export records source archive SHA-256, source line numbers and hashes, session identity, mapping evidence, frozen input hashes and recorded attempts. Hidden reasoning, encrypted payloads and credentials are excluded; binary media is represented by hashes. Tool outputs retain any original truncation. These files are supplementary evidence, not revised benchmark records or scores.

Recovery is an explicit local operation, never part of the website build:

```sh
bun scripts/recover-generation-transcripts.ts /path/to/local/session/archives
bun run website:build
```

The build uses only checked-in supplementary evidence and does not require local chats. Export files use content-hashed names and are never overwritten. `data/supplementary/2026-09-05-codegen-pilot-01/transcripts/index.json` selects current exports. Exact extractor/sanitizer snapshots are retained in `extractors/` by SHA-256. Archive line hashes cover the original UTF-8 JSON line without its newline. Full original session archives remain local and are not distributed. Public transcript JSON has its own content hash after exclusion/redaction.
