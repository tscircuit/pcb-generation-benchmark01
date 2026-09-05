# Record conventions

JSON Schema validators are future work. The copyable JSON templates define the initial record shape; they deliberately allow unresolved nulls and placeholders and must not be treated as validated production data.

- Dates: UTC ISO 8601 timestamps.
- IDs: stable lowercase letters, numbers, and hyphens; no path separators.
- References: project-relative paths, except run artifacts use run-relative paths.
- Digests: SHA-256 of exact bytes; record assets as well as prompt text.
- Metrics: null means unmeasured; zero is a measured result.
- Prompt labels: `labels` is an array of unique lowercase kebab-case strings in prompt metadata; `[]` means no labels assigned. See `prompts/README.md` for usage.
- Artifact entry: path or URI, role, media_type, size_bytes, sha256.
- Attempt entry: attempt_id, started_at, ended_at, outcome, artifact_directory.
- Criterion result: criterion_id, outcome (pass/fail/unknown/unsupported), evidence, notes.
- Freeze a schema version before collection and migrate explicitly when changing it.

Future validators must reject placeholders in actual data, broken references, duplicate IDs, invalid states, missing prompt hashes, missing experiment fields, incomplete paired runs, and metrics lacking evidence.
