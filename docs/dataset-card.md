# Dataset card (draft)

Purpose: compare PCB design generation from identical prompts across tscircuit code generation, KiCad code generation, and KiCad GUI computer use.

Current contents: project structure, templates, and 10 original draft prompts (3 easy, 4 medium, 3 hard); 20 two-method pilot runs with raw validation reports and no calibrated scored evaluations. Computer use was excluded. Each prompt has a difficulty label and topic labels. Difficulty assignments are provisional, all splits are unassigned, and licensing remains unresolved.

Before release, document authors/maintainers, dataset version, prompt sources and licenses, tool/model versions, sampling and splits, collection dates, hardware, scoring procedure, failures, known biases, artifact storage/checksums, and code/dataset licenses. No publication license is selected yet.

Scope limits: conclusions apply to the recorded prompts, models, budgets, and tool versions. Software checks do not establish physical board functionality; record simulation, fabrication, and bench testing separately if performed. Do not claim those validations unless there is evidence.

See `reports/2026-09-05-codegen-pilot-01/README.md` for generated outputs and known failures. The first 18 runs used fresh subagent contexts; the final two used the parent context after a hard thread limit. Model identifiers, token counts, cost, and physical testing remain unmeasured. These results do not establish a controlled method ranking.

Twenty retrospective deterministic rule evaluations are now available, with six known critical clearance failures and incomplete score bounds. Strict totals remain null where evidence is missing. The evaluator does not call a model judge; its rules, code, input hashes and evaluation history are retained under `data/evaluations/`.
