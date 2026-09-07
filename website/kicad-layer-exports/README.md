# KiCad layers for hosted builds

These derived SVGs were exported from the retained final KiCad boards by the existing native KiCad renderer. They allow Vercel builds to render the same PCB viewers without installing KiCad on the build host. They are presentation assets, not new benchmark designs or evaluation evidence.

`manifest.json` records each original PCB path/hash and every SVG hash. Setting `KICAD_LAYER_EXPORTS=website/kicad-layer-exports` explicitly selects this input mode. The renderer verifies source and SVG hashes and fails on mismatches. Normal local builds still use the KiCad CLI.

To refresh after an intentional source or exporter change, run the normal native build with `KICAD_LAYER_EXPORTS` unset, copy the matching `website/dist/views/layers/<prompt>/` SVGs here, and regenerate the source/file hashes. Review the changed assets and manifest together. Do not edit the retained benchmark source files to fix a hosted build.
