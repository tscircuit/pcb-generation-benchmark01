# PCB Generation Benchmark

Project scaffold for a paired dataset comparing three ways of producing PCB designs from the same prompts:

| Method ID | Workflow | Primary artifacts |
| --- | --- | --- |
| `tscircuit-codegen` | Generate tscircuit source code | Source, dependency lockfile, build outputs |
| `kicad-codegen` | Generate KiCad files directly or through recorded scripts/APIs | Native project, schematic, PCB, generation scripts |
| `kicad-computer-use` | Create and edit designs through KiCad's GUI | Native project, schematic, PCB, screenshots and action trace |

**Status: scaffold only.** No benchmark prompts, generated designs, adapters, runners, evaluators, or results have been implemented. No dependencies or API credentials are needed to use this structure.

## Layout

```text
prompts/                 Shared prompt catalog and per-prompt assets
configs/                 Experiment and environment templates
methods/                 Workflow contracts for the three methods
schemas/                 Record conventions for future validators
templates/               Copyable prompt, run, and evaluation records
data/runs/               Raw runs, organized by experiment/prompt/method/replicate
data/evaluations/        Separate evaluation records linked to run IDs
data/releases/           Future versioned dataset manifests
src/adapters/            Reserved for method implementations
src/runner/              Reserved for orchestration
src/evaluation/          Reserved for scoring and artifact inspection
scripts/                 Reserved for future commands
tests/                   Reserved for future validation tests
reports/                 Comparison reports and figures
docs/                    Protocol, dataset card, implementation roadmap
work/                    Ignored scratch space
```

## Start here

1. Read `docs/protocol.md` and `docs/roadmap.md`.
2. Copy `templates/prompt/` into `prompts/items/<prompt-id>/`, replace placeholders, and add the ID to `prompts/catalog.json`.
3. Copy `configs/experiment.template.json` to a named experiment configuration. Freeze its prompt revisions, model, budgets, tools, and repeat count before collecting data.
4. When the runner exists, collect each prompt across all three methods using `templates/run/`. Store evaluations separately using `templates/evaluation.template.json`.

Template files are examples of structure, not actual dataset entries. Empty catalogs are intentional. Do not report placeholder metrics as measurements. Implementation and data collection are future work.

## Model scoring and changes over time

See `docs/model-judging.md` for the model-judge plan, `evaluation/rubric.json` for scoring rules, and `configs/judge.template.json` for fixed judge settings. Judgment and baseline-comparison templates record evidence, repeated scores, and improvement/regression decisions. These are scaffolds only; the judge and score calculator are not implemented.

## Git and storage

Track prompts, configs, native design files, code, and compact evidence. Do not commit secrets. Large recordings should use an explicitly selected external store or Git LFS when configured; record their URI and SHA-256 in the run manifest. Neither external storage nor LFS is configured yet. Dataset and code licensing remain undecided; see `docs/dataset-card.md`.
