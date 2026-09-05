# Comparison protocol (draft)

The experimental unit is one prompt revision, one method, and one replicate within a frozen experiment. Every prompt must be attempted by all three methods. Preserve failures and timeouts in the denominator. Decide repeat count before running; do not select only successful outputs.

## Control conditions

Freeze canonical prompt bytes and SHA-256, shared assets, expected deliverable scope, model/version/settings, tool and library versions, network policy, time/token limits, and repair policy. Tool interfaces differ by method; keep each wrapper explicit and versioned. Record model or environment differences as confounds and avoid pooling them as a controlled comparison. Randomize method order with a recorded seed. Start each run from an isolated workspace and fresh context, without access to another method's output or evaluator reference solutions.

## Artifacts and provenance

Keep original source/native designs plus logs and evidence. Record the repository commit and resolved config. Method-specific artifacts need not share a file extension. Compare semantic requirements and agreed deliverables. Do not silently convert or repair outputs to improve their score. Any normalization belongs in separate derived artifacts with recorded tool version and provenance. Preserve first output and repair attempts separately; repairs consume the declared budget.

## Evaluation

Define per-prompt acceptance criteria before generation. Use common checks for requested connectivity, component values, board constraints, and deliverable completeness. Use native ERC/DRC where available and record checker versions and exact reports; these are method-specific diagnostics and are not automatically equivalent across tools. Missing capability is unsupported, missing evidence is unknown, and a failed check is false or an error count. Use null for unmeasured values, never zero. A clean DRC alone does not establish functional correctness.

Keep evaluation records under `data/evaluations/<experiment-id>/`, linked by run ID. Evaluation must not modify raw artifacts. Record per-criterion evidence and reviewer identity; blind manual reviewers to method where practical. Manufacturing exports are evaluated only when requested. Aggregate paired prompt-level outcomes, completeness, failures, time, tokens, and cost; show sample size and missing data. No aggregate score or weighting is defined yet.

## Run states

`not_started`, `running`, `completed`, `failed`, `timeout`, `unsupported`, `cancelled`. Completed means execution ended normally, not that the design passed evaluation. Record structured failure category, message, and evidence. Never overwrite a previous run to retry it.
