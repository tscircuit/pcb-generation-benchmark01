# Shared prompts

Place each prompt in `items/<prompt-id>/` using `templates/prompt/`. Register objects with `prompt_id`, `revision`, and `path` in `catalog.json`. Each prompt must state the deliverable scope (schematic, PCB, or both), constraints, and measurable acceptance criteria. Store shared reference assets alongside the prompt and record checksums. Split labels are assigned at prompt level; near-duplicate circuit families must stay in the same split. The catalog contains 10 draft prompts.

## Prompt labels

Each prompt's `metadata.json` includes a `labels` array for categorizing and filtering prompts. Use unique lowercase kebab-case strings, such as `analog`, `power-supply`, `sensor-interface`, or `through-hole`; these are illustrative tags, not dataset entries. A prompt can have multiple labels. Use `[]` when no labels have been assigned.

Keep labels in metadata, separate from the canonical prompt text and method-specific instructions. Assign them consistently across the dataset and share the same labels across all methods for a given prompt revision. Every prompt must have exactly one difficulty label (`easy`, `medium`, or `hard`) matching its `difficulty` field, plus one or more topic labels describing its focus. Keep `split`, `family`, and `deliverable_scope` in their existing fields rather than duplicating them as labels. Freeze labels with the prompt revision before collection; revise metadata explicitly when labels change, preserving historical revisions. Labels support grouping results and do not define acceptance criteria or scores.

## Draft prompt set

Ten prompts: 3 easy, 4 medium, and 3 hard. Difficulty is a provisional author-assigned estimate of component count, connectivity, and layout constraints, not a measured result. All request both a schematic and PCB; review them before freezing or running the benchmark.

| Prompt | Difficulty label | Topic labels |
| --- | --- | --- |
| [LED power indicator](items/led-indicator/prompt.md) | `easy` | `led`, `current-limiting` |
| [Resistive voltage divider](items/voltage-divider/prompt.md) | `easy` | `voltage-divider`, `analog` |
| [Single-stage RC low-pass filter](items/rc-low-pass/prompt.md) | `easy` | `rc-filter`, `analog`, `signal-conditioning` |
| [Four-button digital input board](items/button-input-bank/prompt.md) | `medium` | `buttons`, `digital-input`, `pull-up` |
| [Two-channel transistor LED driver](items/npn-led-driver/prompt.md) | `medium` | `transistor`, `led`, `low-side-switch` |
| [I2C connector and pull-up hub](items/i2c-pullup-hub/prompt.md) | `medium` | `i2c`, `pull-up`, `connectors` |
| [Stereo AC-coupled attenuator](items/stereo-passive-attenuator/prompt.md) | `medium` | `audio`, `ac-coupling`, `voltage-divider` |
| [Four-channel protected MOSFET output board](items/mosfet-output-bank/prompt.md) | `hard` | `mosfet`, `inductive-load`, `flyback-protection`, `power-distribution` |
| [Nine-key diode-isolated matrix](items/diode-key-matrix/prompt.md) | `hard` | `key-matrix`, `diodes`, `digital-input` |
| [Six-channel divided and filtered analog input board](items/analog-input-bank/prompt.md) | `hard` | `analog`, `voltage-divider`, `rc-filter`, `multi-channel` |
