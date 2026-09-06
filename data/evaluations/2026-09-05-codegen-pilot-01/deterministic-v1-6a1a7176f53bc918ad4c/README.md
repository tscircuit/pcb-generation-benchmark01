# Deterministic retrospective scoring

Evaluation: `deterministic-v1-6a1a7176f53bc918ad4c`. No model judge or generated script was executed. Raw runs were read only.

Weights: functional requirements 30%, connectivity 30%, physical constraints 20%, deliverable integrity 20%. Each category receives 0/1/2 from its explicit rule outcomes. Missing evidence makes its category and the strict total null. A known critical failure makes overall pass false.

Score ranges below are possible totals under unresolved evidence, **not awarded scores**. Marking association, component documentation, source replay and netlist-export freshness are not proved by static geometry. This retrospective audit is not a controlled method ranking.

| Prompt | Method | Strict score | Possible range | Overall pass | Resolved rules | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| analog-input-bank | kicad-codegen | unknown | 65–90 | false | 29/33 | [Rules and decisions](analog-input-bank/kicad-codegen/evaluation.json) |
| analog-input-bank | tscircuit-codegen | unknown | 65–90 | false | 29/33 | [Rules and decisions](analog-input-bank/tscircuit-codegen/evaluation.json) |
| button-input-bank | kicad-codegen | unknown | 65–100 | unknown | 16/19 | [Rules and decisions](button-input-bank/kicad-codegen/evaluation.json) |
| button-input-bank | tscircuit-codegen | unknown | 50–100 | unknown | 15/19 | [Rules and decisions](button-input-bank/tscircuit-codegen/evaluation.json) |
| diode-key-matrix | kicad-codegen | unknown | 50–100 | unknown | 31/37 | [Rules and decisions](diode-key-matrix/kicad-codegen/evaluation.json) |
| diode-key-matrix | tscircuit-codegen | unknown | 50–90 | false | 32/37 | [Rules and decisions](diode-key-matrix/tscircuit-codegen/evaluation.json) |
| i2c-pullup-hub | kicad-codegen | unknown | 80–100 | unknown | 22/25 | [Rules and decisions](i2c-pullup-hub/kicad-codegen/evaluation.json) |
| i2c-pullup-hub | tscircuit-codegen | unknown | 65–90 | false | 21/25 | [Rules and decisions](i2c-pullup-hub/tscircuit-codegen/evaluation.json) |
| led-indicator | kicad-codegen | unknown | 50–100 | unknown | 15/21 | [Rules and decisions](led-indicator/kicad-codegen/evaluation.json) |
| led-indicator | tscircuit-codegen | unknown | 50–100 | unknown | 16/21 | [Rules and decisions](led-indicator/tscircuit-codegen/evaluation.json) |
| mosfet-output-bank | kicad-codegen | unknown | 50–100 | unknown | 22/31 | [Rules and decisions](mosfet-output-bank/kicad-codegen/evaluation.json) |
| mosfet-output-bank | tscircuit-codegen | unknown | 50–90 | false | 26/31 | [Rules and decisions](mosfet-output-bank/tscircuit-codegen/evaluation.json) |
| npn-led-driver | kicad-codegen | unknown | 50–100 | unknown | 16/21 | [Rules and decisions](npn-led-driver/kicad-codegen/evaluation.json) |
| npn-led-driver | tscircuit-codegen | unknown | 50–100 | unknown | 16/21 | [Rules and decisions](npn-led-driver/tscircuit-codegen/evaluation.json) |
| rc-low-pass | kicad-codegen | unknown | 80–100 | unknown | 18/20 | [Rules and decisions](rc-low-pass/kicad-codegen/evaluation.json) |
| rc-low-pass | tscircuit-codegen | unknown | 65–100 | unknown | 17/20 | [Rules and decisions](rc-low-pass/tscircuit-codegen/evaluation.json) |
| stereo-passive-attenuator | kicad-codegen | unknown | 65–100 | unknown | 19/23 | [Rules and decisions](stereo-passive-attenuator/kicad-codegen/evaluation.json) |
| stereo-passive-attenuator | tscircuit-codegen | unknown | 50–90 | false | 19/23 | [Rules and decisions](stereo-passive-attenuator/tscircuit-codegen/evaluation.json) |
| voltage-divider | kicad-codegen | unknown | 80–100 | unknown | 18/20 | [Rules and decisions](voltage-divider/kicad-codegen/evaluation.json) |
| voltage-divider | tscircuit-codegen | unknown | 65–100 | unknown | 17/20 | [Rules and decisions](voltage-divider/tscircuit-codegen/evaluation.json) |

The full evaluator and rule bytes are archived alongside normalized facts and SHA-256 input manifests. Repeating the same command with unchanged inputs validates/reuses this directory; it never overwrites a different evaluation.
