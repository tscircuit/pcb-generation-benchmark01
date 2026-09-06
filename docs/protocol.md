# Comparison protocol (draft)

The experimental unit is one prompt revision, one method, and one replicate within a frozen experiment. Every prompt must be attempted by all three methods. Preserve failures and timeouts in the denominator. Decide repeat count before running; do not select only successful outputs.

## Control conditions

Freeze canonical prompt bytes and SHA-256, shared assets, expected deliverable scope, model/version/settings, tool and library versions, network policy, time/token limits, and repair policy. Tool interfaces differ by method; keep each wrapper explicit and versioned. Record model or environment differences as confounds and avoid pooling them as a controlled comparison. Randomize method order with a recorded seed. Start each run from an isolated workspace and fresh context, without access to another method's output or evaluator reference solutions.

## Artifacts and provenance

Freeze prompt metadata, including labels, with each prompt revision. Use those recorded labels for filtering and grouped reporting across methods; preserve historical label assignments when creating new revisions.

Keep original source/native designs plus logs and evidence. Record the repository commit and resolved config. Method-specific artifacts need not share a file extension. Compare semantic requirements and agreed deliverables. Do not silently convert or repair outputs to improve their score. Any normalization belongs in separate derived artifacts with recorded tool version and provenance. Preserve first output and repair attempts separately; repairs consume the declared budget.

## Evaluation

Define per-prompt acceptance criteria before generation. Use common checks for requested connectivity, component values, board constraints, and deliverable completeness. Use native ERC/DRC where available and record checker versions and exact reports; these are method-specific diagnostics and are not automatically equivalent across tools. Missing capability is unsupported, missing evidence is unknown, and a failed check is false or an error count. Use null for unmeasured values, never zero. A clean DRC alone does not establish functional correctness.

Keep evaluation records under `data/evaluations/<experiment-id>/`, linked by run ID. Evaluation must not modify raw artifacts. Record per-criterion evidence and reviewer identity; blind manual reviewers to method where practical. Manufacturing exports are evaluated only when requested. Aggregate paired prompt-level outcomes, completeness, failures, time, tokens, and cost; show sample size and missing data. Deterministic scoring v1 defines fixed 30/30/20/20 category weights; see `docs/deterministic-scoring.md`. Unknown evidence blocks a strict numeric total. Evaluations of the existing pilot are retrospective and do not change its frozen generation protocol.

## Run states

`not_started`, `running`, `completed`, `failed`, `timeout`, `unsupported`, `cancelled`. Completed means execution ended normally, not that the design passed evaluation. Record structured failure category, message, and evidence. Never overwrite a previous run to retry it.

## Two-method pilot exception

The user-authorized `2026-09-05-codegen-pilot-01` excludes `kicad-computer-use` and uses one replicate for each of the ten prompts under each code-generation method. It is an exploratory artifact-generation pilot, not a full three-method or controlled model comparison. Its configuration records the exclusion, tool versions, randomized dispatch order, unavailable model accounting, and per-run time and repair limits. Runs use separate directories. Eighteen used fresh generation contexts; the final two were parent-generated after a hard agent thread limit, as recorded in execution notes. Original candidates and diagnostics are retained even when validation fails; completion does not imply acceptance.

## Deterministic evaluation records

Versioned evaluator-only rules live in `evaluation/rules/v1/`, outside generation inputs. Each evaluation archives exact rule/code bytes, SHA-256 input references, normalized evidence and decisions. `scripts/score-experiment.ts` computes scores without a model call or raw-artifact edits. Content-derived evaluation IDs preserve previous versions; identical reruns must reproduce identical bytes. Earlier development evaluations and corrections are listed in the experiment’s evaluation history.
