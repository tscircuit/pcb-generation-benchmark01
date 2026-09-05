# Shared prompts

Place each prompt in `items/<prompt-id>/` using `templates/prompt/`. Register objects with `prompt_id`, `revision`, and `path` in `catalog.json`. Each prompt must state the deliverable scope (schematic, PCB, or both), constraints, and measurable acceptance criteria. Store shared reference assets alongside the prompt and record checksums. Split labels are assigned at prompt level; near-duplicate circuit families must stay in the same split. The catalog is currently empty.
