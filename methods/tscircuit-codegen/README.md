# tscircuit-codegen

Generate the design as tscircuit source. Preserve source, dependency versions and lockfile, all build commands, raw build outputs, and available exports. Native KiCad export is optional unless the experiment explicitly requires and supports it. Do not assume format conversion is available.

Use the canonical prompt without changes. Keep the tool wrapper separately versioned here before execution. The exploratory pilot wrapper is recorded in `pilot-wrapper-v1.md`; a reusable adapter is not implemented yet. Missing capabilities are recorded as unsupported or failed, never silently substituted.
