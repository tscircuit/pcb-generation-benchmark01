# Project instructions

Use zsh and shell tools when possible. Avoid computer use for repository setup and ordinary code work.

This repository contains the scaffold, ten draft prompts, and a recorded two-method generation pilot. Do not run additional experiments, create more prompts or designs, install tools, or extend the pipeline unless the user requests that work.

When benchmark execution is requested, the `kicad-computer-use` method requires GUI operations for design creation; keep that exception confined to that method. Never replace its design work with generated scripts or direct file edits.

Keep the canonical prompt text identical across methods. Record method-specific tool instructions separately. Preserve every failed attempt and retain original artifacts. Never invent metrics or overwrite historical runs. Use null for unmeasured values. Keep evaluator-only references outside generation context. Read docs/protocol.md before implementing or collecting data.

## Repository tooling

Use TypeScript with Bun for all active scripts, evaluator code, website builders, and tests. Run `bun install --frozen-lockfile`, `bun run typecheck`, and `bun test`. Do not add Python runtime wrappers. Preserve historical Python scripts inside recorded runs and archived evaluation snapshots as immutable benchmark evidence. CSS, JSON, Markdown, generated HTML/JavaScript, and native KiCad files retain their appropriate formats.

## Supplemental guidance and precedence

The original project instructions and repository tooling rules above are retained verbatim and take precedence over all supplemental guidance below. Apply the new guidance only where compatible; it must not weaken evidence preservation, change the experiment protocol, or expand the authorized task. Explicit user instructions remain authoritative.

Adapted from the [0hmx tscircuit agent guidance, September 6, 2026](https://0hmx.com/artifacts/0hmx-tscircuit-agentmd-2026-09-06/) ([source Markdown](https://0hmx.com/artifacts/0hmx-tscircuit-agentmd-2026-09-06/AGENTS.md)). Autorouter-specific commands and assumptions are adjusted for this repository.

## Commands

- Install locked dependencies: `bun install --frozen-lockfile`.
- Build the website and PCB views: `bun run build`.
- Rebuild only the comparison HTML: `bun run website:build`.
- Rebuild PCB viewers: `bun run website:views`.
- Type-check: `bun run typecheck`.
- Run tests locally: `bun test --timeout 9999999`.
- Run a focused test file: `bun test tests/scoring.test.ts --timeout 9999999`.
- Verify/reproduce frozen specifications: `bun run rules`.
- Evaluate retained artifacts: `bun run score -- 2026-09-05-codegen-pilot-01`.
- Inventory the retained pilot: `bun run collect -- 2026-09-05-codegen-pilot-01 --require-complete`.
- Publish when authorized: `bun run website:publish`.

The repository has no `start` script. Do not assume commands from the upstream autorouter apply here. Website integration checks require `bun run build` first after a clean checkout. PCB exports use the native KiCad CLI through `KICAD_CLI` or PATH; publishing uses `ohmx-box`.

Do not format or lint code as part of ordinary work. Preserve the existing style manually; do not run formatter commands or replace the repository's formatter configuration merely to follow the upstream Biome preference. Explicit user requests to format take precedence.

## Validation policy

Run tests, builds, type checks, and focused checks locally by default. Preserve the experiment environment specified by the original project rules, protocol, and user request. The upstream Blacksmith guidance does not require changing this repository’s environment or installing a new service. Use Blacksmith only for authorized benchmark runs when it is the selected execution environment, or when the user explicitly requests it for another task. Do not silently substitute environments or relocate or rerun the recorded pilot.

Scoring existing artifacts and building the website are local validation, not new generation experiments. Verify that scorer changes preserve the frozen contract and saved-result parity, unless the user explicitly requests a new version of the scoring rules.

## Failures and fallback logic

When an evaluator or renderer reaches an invalid state, fix the root cause or throw a named, specific error. Do not let the pipeline continue as if the operation succeeded.

- Do not swallow internal errors, replace required missing data with `[]` or an invented default, silently switch algorithms or renderers, or report success after a failed operation.
- Make internal invariants required in the type system. Use explicit validation or `OrThrow` helpers at external-data boundaries.
- Use `try/catch` for recoverable I/O at the edges. Surface a meaningful error or an explicitly defined failure outcome; do not silently recover from broken internal state.
- Keep `unknown`, `unsupported`, and failed evidence distinct under the versioned scoring rules. An expected missing measurement is a legitimate unknown, not permission to invent a value. Unexpected implementation errors must not masquerade as missing evidence.
- Viewer controls affect presentation only. Never alter retained Circuit JSON, KiCad source files, or scores when changing visibility, opacity, or selection.

## TypeScript and code style

For new or intentionally refactored code:

- Use strict types, camelCase variables/functions, and PascalCase classes/interfaces.
- Name focused source files after their primary export. Use descriptive camelCase names for multi-export utility/type modules.
- Define types near the start of the code. Give functions explicit parameter and return types; model invalid states out of the type system where practical.
- Give React components proper prop types and export functions/classes directly from their definition files.
- Follow the surrounding import order, two-space indentation, and double quotes for JSX without running a formatter.
- Prefer direct code over abstractions. Extract a helper only when it removes real duplication or clarifies complex logic; do not create functions shorter than six lines.
- Explain complex logic with meaningful comments; avoid comments that restate the code.
- Name shared metadata for its domain role rather than its current producer. Avoid arbitrary prefixes; apply a category prefix consistently when one is needed.
- Keep changes focused on the requested work. Do not add precautionary or adjacent refactors without user authorization.

## Tests and snapshots

Use one test per file for new tests. Existing test organization and explicit timeouts are historical conventions; change them when the user requests that refactor, not as unrelated cleanup. Do not set timeouts in new test code; use the CLI or CI configuration. Run local tests with `--timeout 9999999` when a large timeout is needed.

Before writing visualization snapshot tests, read the `tscircuit-visualization` skill if available. If the required skill is unavailable, report that limitation before adding those tests. The current repository's ordinary assertions are not visualization snapshot tests.

When explicitly asked to update snapshots, use `BUN_UPDATE_SNAPSHOTS=1 bun test --timeout 9999999` for the relevant snapshot tests. Update only the affected failures; do not refresh every snapshot. Never treat immutable benchmark evidence as a snapshot to overwrite.

## Generated output

Keep `/dist/`, `/website/dist/`, dependencies, and local caches out of Git. Rebuild generated application output locally before validation or publication. Recorded outputs under `data/runs/` are benchmark evidence, not disposable application build output; preserve them and their hashes.
