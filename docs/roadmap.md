# Future implementation checklist

- [ ] Choose prompt families, deliverable scope, acceptance criteria, and licensing.
- [ ] Author and review the common prompt set; freeze revisions and splits.
- [ ] Define JSON Schemas and a dataset integrity validator.
- [ ] Pin tool/library versions and prepare reproducible environments.
- [ ] Implement the three adapters according to `methods/` contracts.
- [ ] Implement isolated execution, budgets, retries, provenance, and evidence capture.
- [ ] Implement artifact inspection and requirement checks without editing outputs.
- [x] Implement and test deterministic rule evaluation and weighted score calculation on retained artifacts.
- [ ] Implement the optional historical model-judge proposal if requested.
- [ ] Calibrate judge variation and baseline regression tolerance.
- [ ] Run a small paired pilot and review evidence before freezing the protocol.
- [ ] Collect the complete paired dataset, retaining all failures.
- [ ] Produce reports with paired outcomes and documented limitations.
- [ ] Select large-file storage, licenses, and a versioned release manifest.

Ten draft prompts have been authored with difficulty and topic labels, and 20 generation outcomes have been collected in an exploratory two-method pilot. Full prompt review, split assignment, licensing, reusable adapters/runner, calibrated scoring, and full three-method collection remain pending.
