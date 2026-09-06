# Deterministic retrospective scoring

Evaluation: `deterministic-v1-ts-c0d54e8e15702df309af`. TypeScript/Bun implementation of v1; original designs were read only.

Weights: functional requirements 30%, connectivity 30%, physical constraints 20%, deliverable integrity 20%. Unknown evidence blocks strict totals. Ranges are possible bounds, not awarded scores.

| Prompt | Method | Strict score | Possible range | Overall pass | Resolved rules | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| analog-input-bank | kicad-codegen | unknown | 65–90 | false | 29/33 | [Rules](analog-input-bank/kicad-codegen/evaluation.json) |
| analog-input-bank | tscircuit-codegen | unknown | 65–90 | false | 29/33 | [Rules](analog-input-bank/tscircuit-codegen/evaluation.json) |
| button-input-bank | kicad-codegen | unknown | 65–100 | unknown | 16/19 | [Rules](button-input-bank/kicad-codegen/evaluation.json) |
| button-input-bank | tscircuit-codegen | unknown | 50–100 | unknown | 15/19 | [Rules](button-input-bank/tscircuit-codegen/evaluation.json) |
| diode-key-matrix | kicad-codegen | unknown | 50–100 | unknown | 31/37 | [Rules](diode-key-matrix/kicad-codegen/evaluation.json) |
| diode-key-matrix | tscircuit-codegen | unknown | 50–90 | false | 32/37 | [Rules](diode-key-matrix/tscircuit-codegen/evaluation.json) |
| i2c-pullup-hub | kicad-codegen | unknown | 80–100 | unknown | 22/25 | [Rules](i2c-pullup-hub/kicad-codegen/evaluation.json) |
| i2c-pullup-hub | tscircuit-codegen | unknown | 65–90 | false | 21/25 | [Rules](i2c-pullup-hub/tscircuit-codegen/evaluation.json) |
| led-indicator | kicad-codegen | unknown | 50–100 | unknown | 15/21 | [Rules](led-indicator/kicad-codegen/evaluation.json) |
| led-indicator | tscircuit-codegen | unknown | 50–100 | unknown | 16/21 | [Rules](led-indicator/tscircuit-codegen/evaluation.json) |
| mosfet-output-bank | kicad-codegen | unknown | 50–100 | unknown | 22/31 | [Rules](mosfet-output-bank/kicad-codegen/evaluation.json) |
| mosfet-output-bank | tscircuit-codegen | unknown | 50–90 | false | 26/31 | [Rules](mosfet-output-bank/tscircuit-codegen/evaluation.json) |
| npn-led-driver | kicad-codegen | unknown | 50–100 | unknown | 16/21 | [Rules](npn-led-driver/kicad-codegen/evaluation.json) |
| npn-led-driver | tscircuit-codegen | unknown | 50–100 | unknown | 16/21 | [Rules](npn-led-driver/tscircuit-codegen/evaluation.json) |
| rc-low-pass | kicad-codegen | unknown | 80–100 | unknown | 18/20 | [Rules](rc-low-pass/kicad-codegen/evaluation.json) |
| rc-low-pass | tscircuit-codegen | unknown | 65–100 | unknown | 17/20 | [Rules](rc-low-pass/tscircuit-codegen/evaluation.json) |
| stereo-passive-attenuator | kicad-codegen | unknown | 65–100 | unknown | 19/23 | [Rules](stereo-passive-attenuator/kicad-codegen/evaluation.json) |
| stereo-passive-attenuator | tscircuit-codegen | unknown | 50–90 | false | 19/23 | [Rules](stereo-passive-attenuator/tscircuit-codegen/evaluation.json) |
| voltage-divider | kicad-codegen | unknown | 80–100 | unknown | 18/20 | [Rules](voltage-divider/kicad-codegen/evaluation.json) |
| voltage-divider | tscircuit-codegen | unknown | 65–100 | unknown | 17/20 | [Rules](voltage-divider/tscircuit-codegen/evaluation.json) |
