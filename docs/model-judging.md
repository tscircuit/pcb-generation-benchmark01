# Model judging and regression tracking

This is a configuration and record scaffold, not an implemented judge. The initial rubric has four explicit categories totaling 100 points. Each maps to prewritten binary acceptance tests and receives 0, 1, or 2; unsupported conclusions stay unknown. Copy `templates/acceptance-tests.template.json` into each prompt directory and replace every placeholder before collection.

## Reduce score variation

Pin the judge model snapshot, exact instruction bytes, rubric, acceptance tests, input evidence and order, and supported inference settings. Temperature zero and a supported fixed seed can reduce variability; they do not guarantee identical responses. Record unavailable controls. Use the same judge independently for every method and hide method identity and baseline/candidate labels where possible. Record unavoidable format clues. Preserve raw responses and all repeats; never select a preferred judgment.

Use three independent judgments of an identical evidence packet as the provisional default. The future evaluator computes totals from criterion scores, then uses the median of all three totals. If any repeat is unscorable or malformed, mark the aggregate unscorable and retain it; do not silently drop it. Record minimum, maximum, and per-criterion disagreement. Deterministic tool results and exact acceptance tests should supply evidence wherever available. Model judgments interpret evidence and are not proof of circuit correctness.

## Improvement or regression

Freeze a baseline experiment and compare matched prompt revision, method, replicate, generation conditions, and judge configuration. For cross-method comparisons, explicitly name the baseline and candidate methods and match the remaining factors. For changed generation rules, record the old and new rule revisions as the intended experimental variable. Evaluate both sides with the same frozen judge; if judging rules change, rescore both under a new evaluation version and preserve the original scores.

Score delta is candidate median minus baseline median on a 0–100 scale. Start with a provisional 2-point tolerance and calibrate it using repeated judgments of unchanged artifacts before using it for conclusions. Classify improvement only when delta is greater than tolerance AND the candidate repeat range is wholly above the baseline range. Classify regression only when delta is below negative tolerance AND the candidate range is wholly below the baseline range. Otherwise label inconclusive. This is a conservative heuristic, not a statistical significance test.

A newly failed critical requirement is a regression regardless of total. A newly passed critical requirement must be reported separately, with any numeric regression still visible. Unscorable/missing pairs are reported separately; never convert them to zeros or hide their counts. Report paired score deltas together with execution success and critical-pass rates so excluded failures cannot make a candidate appear better. For overall results use the mean of matched paired deltas and counts by classification; do not compare unmatched averages.

## Implement later

1. Validate acceptance tests and applicability before generation.
2. Assemble frozen evidence packets with checksums and bounded input size.
3. Call the judge with structured output, retain raw responses and provenance.
4. Validate evidence references and compute scores in code.
5. Collect repeated judgments and calibrate tolerance on unchanged designs.
6. Produce baseline/candidate comparisons with per-prompt explanations.

No judge provider, model, or API has been selected or called. Default weights, repeat count, and tolerance are draft choices to validate in the pilot.
