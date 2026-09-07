# Website verified score v1

The website's `verified-score-v1` metric, requested as a simpler numeric comparison, measures the weighted share of applicable checks with verified passes. It is separate from the frozen deterministic-v1 correctness score. Historical evaluations, including null totals and unknown outcomes, remain unchanged.

For each applicable category, multiply its existing weight by `passed / (passed + failed + unknown_or_unsupported)`. Sum these contributions, divide by the total applicable weight, and multiply by 100. Display the result rounded to one decimal place. Checks are equally weighted within each category; the existing category weights are 30/30/20/20. No applicable categories yields null. Invalid category evidence throws an error.

Higher values mean more verified requirements under the available evidence. Unverified checks earn no points in this evidence metric, but remain unknown in the evaluation; they are not converted into failures. This metric does not establish overall correctness, manufacturing readiness, or a controlled ranking of methods. A critical failure does not zero the evidence metric and is explicitly labeled beside the number. The website removes category/rule tables and score bounds; full original outcomes remain in the results download alongside the separately versioned metric.

The overall score uses `equal-design-mean-v1`: the arithmetic mean of all ten per-design verified scores (using their published one-decimal values), rounded to one decimal. Every design has equal weight, including designs with critical failures. If any design score is null, the overall score is null rather than dropping that design. The results download records the aggregation, design count, and overall value per method.
