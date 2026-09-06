# Project instructions

Use zsh and shell tools when possible. Avoid computer use for repository setup and ordinary code work.

This repository contains the scaffold, ten draft prompts, and a recorded two-method generation pilot. Do not run additional experiments, create more prompts or designs, install tools, or extend the pipeline unless the user requests that work.

When benchmark execution is requested, the `kicad-computer-use` method requires GUI operations for design creation; keep that exception confined to that method. Never replace its design work with generated scripts or direct file edits.

Keep the canonical prompt text identical across methods. Record method-specific tool instructions separately. Preserve every failed attempt and retain original artifacts. Never invent metrics or overwrite historical runs. Use null for unmeasured values. Keep evaluator-only references outside generation context. Read docs/protocol.md before implementing or collecting data.

## Repository tooling

Use TypeScript with Bun for all active scripts, evaluator code, website builders, and tests. Run `bun install --frozen-lockfile`, `bun run typecheck`, and `bun test`. Do not add Python runtime wrappers. Preserve historical Python scripts inside recorded runs and archived evaluation snapshots as immutable benchmark evidence. CSS, JSON, Markdown, generated HTML/JavaScript, and native KiCad files retain their appropriate formats.
