# Deterministic scoring v1

Run the scorer against the recorded artifacts:

```sh
bun run score -- 2026-09-05-codegen-pilot-01
bun test
```

Bun 1.3.14 or later and the locked dependencies are required (`bun install --frozen-lockfile`). The scorer does not call a model, install packages, execute generation scripts, reroute boards, or modify raw runs. It reads the selected candidate from each recorded run. Failed earlier candidates remain in place; selection is not changed by the scorer.

## Rules and arithmetic

`evaluation/rubric-v1.json` defines the frozen scoring contract. `evaluation/rules/v1/*.json` supplies explicit evaluator-only specifications for the ten existing prompts. Each atomic test belongs to one category and records its source acceptance-criterion IDs. Mixed original requirements can be split across multiple atomic tests. Rules are identical across methods for a prompt revision; their prompt SHA-256 and revision must match the run inputs. `scripts/author-scoring-rules.ts` reproduces the specifications and refuses to overwrite a different ruleset; existing frozen bytes are retained.

| Category | Weight |
| --- | ---: |
| Functional requirements | 30 |
| Connectivity | 30 |
| Physical constraints | 20 |
| Deliverable integrity | 20 |

A category is 2 when all applicable tests pass, 1 when some pass and some fail, and 0 when none pass. Any unknown or unsupported applicable test makes the category score **null**. Total score is `100 × sum(weight × category_score / 2) / sum(applicable weights)`, computed using rational arithmetic. It is null if any applicable category is unknown, or if no category applies.

A known critical failure makes `overall_pass=false`, including when other tests are unknown. Otherwise an unresolved evaluation has `overall_pass=null`; a fully resolved evaluation passes only if every applicable test passes. Missing requested files fail their deliverable rule. They are never marked inapplicable. Unknown evidence is never assigned zero and failed runs are not dropped.

The report also gives **possible score bounds** and the number of resolved tests. Bounds are not awarded scores, confidence intervals, or rankings. For a partially observed category, any known pass establishes a lower possible category score of 1; any known failure limits its upper possible score to 1. A strict score stays null even if bounds happen to coincide.

## Executable checks

The readers parse tscircuit circuit JSON and native KiCad PCB files, plus existing KiCad schematic/netlist exports. They normalize units, named and numbered KiCad nets, semantic polarized pins, coordinate systems, header pad geometry, and footprint centres. KiCad's placement origin is often pin 1 rather than the component centre; placement checks use the centre of its declared pad/courtyard bounding box. The original placement origin is retained in normalized evidence.

A bounded graph matcher checks requested topology and values without relying on arbitrary net names or unspecified component designators. Connector pin numbers and polarized terminals cannot be swapped. Interchangeable passive/switch terminals can be swapped. Missing semantic pin/value information or exhaustion of the deterministic search bound is unknown, not a false failure.

Checks include component counts; topology and values; schematic-export/PCB assigned-net agreement; copper connectivity and shorts; board dimensions and layers; track width and copper clearance; declared body/courtyard containment; header pitch; recognized 0805 land patterns; test-pad size; and prompt-specific distances, rows, grid positions, jumpers and mounting-hole constraints.

Copper checks use a common geometry implementation for both methods. Supported primitives are straight tracks, vias, circular/rectangular/rounded/oval pads, and their declared layers. Distances are between convex outer copper envelopes, with rounded shapes represented as a convex core plus a radius. This is a conservative outer-envelope rule, not a complete manufacturing DRC: drill voids, solder mask, material exposure, thermal behavior, and arbitrary copper graphics are not independently verified. Unsupported arcs, zones, or shapes prevent a pass unless a supported primitive already establishes a failure. Geometry comparisons use a fixed 0.000001 mm numerical tolerance, separate from tolerances explicitly stated by a prompt. Unrecognized 0805 patterns are unknown rather than automatically rejected as an incorrect package.

A generator's `result.json` selects the recorded final candidate but its claimed validation outcomes are never used as correctness evidence. Native ERC/DRC diagnostics remain available in the original runs and are not treated as interchangeable scores between tools.

## Evidence still required

Static checks cannot establish readable and correctly associated silkscreen markings, manufacturer ratings/pin mapping, switch behavior, complete component documentation, source/build replay consistency, or the freshness of a previously exported netlist. Applicable rules for these remain unknown with explicit reasons. The current pilot therefore has per-rule outcomes, category evidence and score bounds, but **no complete numeric totals**. This is deliberate: assigning full scores despite these gaps would violate the rubric.

Structural deliverable checks prove presence and supported parsing, not a successful independent compiler/application replay. Test-pad diameter does not prove exposed copper or solderability. Copper continuity checks operate on declared PCB conductors; component-internal conduction and unsupported copper require separate evidence. No simulation, fabrication, or bench result is inferred.

## Reproducibility and preservation

Each evaluation directory is named from the SHA-256 hashes of artifact inputs, prompt rules, evaluator source, rubric, experiment configuration and Bun version. It archives normalized facts, copper findings, decisions, input manifests, exact rule files, and evaluator code. Evaluation JSON has no wall-clock timestamp or random identifier.

Identical inputs and code produce identical bytes. Running the command again validates and reuses the existing directory. A differing saved record is an error, never an overwrite. A changed artifact, rule, runtime version or implementation creates another evaluation ID; previous evaluations remain untouched. All input hashes are checked again before output is written. Use a new rule version for future changes to the scoring contract.

These rules were authored after `2026-09-05-codegen-pilot-01`; its evaluations are **retrospective**, not preregistered. Eighteen generation runs used fresh subagents and two used the orchestration context after a thread limit. These and the original model-accounting limitations still prevent a controlled method-ranking claim. The older `evaluation/rubric.json`, templates, and model-judge proposal are retained as historical drafts; this v1 deterministic evaluator is the implemented path.

## TypeScript migration

The active implementation uses TypeScript and Bun. The v1 weights, atomic rules, unknown handling, and conservative geometry contract are unchanged. Bun parity tests compare all 500 rule outcomes and every score record against the preserved 20-run Python evaluation. The new runtime and source code hashes produce distinct `deterministic-v1-ts-*` archives; existing evaluations and the website's pinned historical report are never overwritten by this migration. Archive identity includes the Bun version, package manifest and lockfile.

`src/evaluation/specifications-v1.ts` retains the ten frozen specifications as typed source data. The authoring command validates their prompt hashes and coverage before writing missing rules and refuses to replace different existing rules.
