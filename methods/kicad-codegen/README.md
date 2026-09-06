# kicad-codegen

Generate native KiCad files using text generation or scripts/APIs. Preserve scripts, dependencies, generated project/schematic/PCB files, custom symbols and footprints, and validation logs. Record whether output was direct file generation or scripted generation. GUI may inspect output but must not repair it in this method.

Use the canonical prompt without changes. Keep the tool wrapper separately versioned here before execution. The exploratory pilot wrapper is recorded in `pilot-wrapper-v1.md`; a reusable adapter is not implemented yet. Missing capabilities are recorded as unsupported or failed, never silently substituted.
