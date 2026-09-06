# KiCad vs tscircuit: code-generation comparison

**KiCad has fewer observed critical failures in this pilot: 1 of 10 designs, compared with 5 of 10 for tscircuit.** All six failures concern copper clearance. Every design still has unresolved required checks, so neither method has a confirmed full pass or a complete numeric score.

Same ten prompts, same deterministic rules and weights, one generated design per method per prompt. This exploratory, retrospective audit cannot establish an overall method winner.

| Result | KiCad codegen | tscircuit codegen |
| --- | --- | --- |
| Designs evaluated | 10 / 10 | 10 / 10 |
| Designs with a known critical failure | 1 / 10 | 5 / 10 |
| Designs awaiting evidence, without a known critical failure | 9 / 10 | 5 / 10 |
| Confirmed full passes | 0 / 10 | 0 / 10 |
| Complete numeric scores | 0 / 10 | 0 / 10 |

Each cell below shows **passed / failed / unresolved rule checks**. These counts are evidence, not weighted scores. Unresolved includes unknown or unsupported checks; zero failures does not mean a full pass. Click a count to inspect its rules.

| Prompt | Difficulty | Topic labels | KiCad: pass / fail / unresolved | tscircuit: pass / fail / unresolved | Known failure difference |
| --- | --- | --- | --- | --- | --- |
| LED power indicator | **easy** | led, current-limiting | [15 / 0 / 6](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/led-indicator/kicad-codegen/evaluation.json) | [16 / 0 / 5](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/led-indicator/tscircuit-codegen/evaluation.json) | Neither has a known failure |
| Single-stage RC low-pass filter | **easy** | rc-filter, analog, signal-conditioning | [18 / 0 / 2](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/rc-low-pass/kicad-codegen/evaluation.json) | [17 / 0 / 3](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/rc-low-pass/tscircuit-codegen/evaluation.json) | Neither has a known failure |
| Resistive voltage divider | **easy** | voltage-divider, analog | [18 / 0 / 2](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/voltage-divider/kicad-codegen/evaluation.json) | [17 / 0 / 3](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/voltage-divider/tscircuit-codegen/evaluation.json) | Neither has a known failure |
| Four-button digital input board | **medium** | buttons, digital-input, pull-up | [16 / 0 / 3](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/button-input-bank/kicad-codegen/evaluation.json) | [15 / 0 / 4](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/button-input-bank/tscircuit-codegen/evaluation.json) | Neither has a known failure |
| I2C connector and pull-up hub | **medium** | i2c, pull-up, connectors | [22 / 0 / 3](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/i2c-pullup-hub/kicad-codegen/evaluation.json) | [20 / 1 / 4](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/i2c-pullup-hub/tscircuit-codegen/evaluation.json) | tscircuit fails clearance; KiCad passes that check |
| Two-channel transistor LED driver | **medium** | transistor, led, low-side-switch | [16 / 0 / 5](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/npn-led-driver/kicad-codegen/evaluation.json) | [16 / 0 / 5](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/npn-led-driver/tscircuit-codegen/evaluation.json) | Neither has a known failure |
| Stereo AC-coupled attenuator | **medium** | audio, ac-coupling, voltage-divider | [19 / 0 / 4](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/stereo-passive-attenuator/kicad-codegen/evaluation.json) | [18 / 1 / 4](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/stereo-passive-attenuator/tscircuit-codegen/evaluation.json) | tscircuit fails clearance; KiCad passes that check |
| Six-channel divided and filtered analog input board | **hard** | analog, voltage-divider, rc-filter, multi-channel | [28 / 1 / 4](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/analog-input-bank/kicad-codegen/evaluation.json) | [28 / 1 / 4](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/analog-input-bank/tscircuit-codegen/evaluation.json) | Both fail clearance |
| Nine-key diode-isolated matrix | **hard** | key-matrix, diodes, digital-input | [31 / 0 / 6](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/diode-key-matrix/kicad-codegen/evaluation.json) | [31 / 1 / 5](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/diode-key-matrix/tscircuit-codegen/evaluation.json) | tscircuit fails clearance; KiCad passes that check |
| Four-channel protected MOSFET output board | **hard** | mosfet, inductive-load, flyback-protection, power-distribution | [22 / 0 / 9](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/mosfet-output-bank/kicad-codegen/evaluation.json) | [25 / 1 / 5](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/mosfet-output-bank/tscircuit-codegen/evaluation.json) | tscircuit fails clearance; KiCad passes that check |

**Possible score ranges (out of 100)** are shown separately to avoid confusing them with awarded scores. Every strict total remains unknown. Overlapping ranges do not identify a winner.

| Prompt | KiCad possible range | tscircuit possible range |
| --- | --- | --- |
| LED power indicator | 50–100 | 50–100 |
| Single-stage RC low-pass filter | 80–100 | 65–100 |
| Resistive voltage divider | 80–100 | 65–100 |
| Four-button digital input board | 65–100 | 50–100 |
| I2C connector and pull-up hub | 80–100 | 65–90 |
| Two-channel transistor LED driver | 50–100 | 50–100 |
| Stereo AC-coupled attenuator | 65–100 | 50–90 |
| Six-channel divided and filtered analog input board | 65–90 | 65–90 |
| Nine-key diode-isolated matrix | 50–100 | 50–90 |
| Four-channel protected MOSFET output board | 50–100 | 50–90 |

Required marking, component-documentation and source-replay evidence remains incomplete. Across both methods, 414 of 500 applicable checks are resolved. Functional requirements and connectivity each weigh 30%; physical constraints and deliverable integrity each weigh 20%. Rule counts above do not replace those weights.

Source: [preserved evaluation](../../data/evaluations/2026-09-05-codegen-pilot-01/deterministic-v1-5a9c0cca93c84a315b17/README.md) · [scoring contract](../../docs/deterministic-scoring.md) · [evaluation history](../../data/evaluations/2026-09-05-codegen-pilot-01/evaluation-history.json) · [PCB previews and generation files](README.md#pcb-previews). Original evaluations and designs are unchanged.
