"""Pure scoring: no model calls, wall clock, randomness, or filesystem access."""
from fractions import Fraction

CATEGORIES = {
    'functional_requirements': 30,
    'connectivity': 30,
    'physical_constraints': 20,
    'deliverable_integrity': 20,
}
OUTCOMES = {'pass', 'fail', 'unknown', 'unsupported'}


def validate_rules(rules):
    if rules.get('version') != '1.0.0':
        raise ValueError('Unsupported rules version')
    if rules.get('weights') != CATEGORIES:
        raise ValueError('Rules must use the frozen 30/30/20/20 weights')
    applicability = rules.get('applicability', {})
    if set(applicability) != set(CATEGORIES) or any(type(x) is not bool for x in applicability.values()):
        raise ValueError('Every category needs explicit boolean applicability')
    seen = set()
    counts = dict.fromkeys(CATEGORIES, 0)
    for test in rules.get('tests', []):
        test_id = test.get('id')
        if not isinstance(test_id, str) or not test_id or test_id in seen:
            raise ValueError('Missing or duplicate test ID')
        seen.add(test_id)
        category = test.get('category')
        if category not in CATEGORIES or type(test.get('critical')) is not bool:
            raise ValueError('Invalid category or critical flag')
        if not isinstance(test.get('rule'), dict) or not test.get('requirement') or not test.get('source_criteria'):
            raise ValueError('Every test needs an executable rule and requirement provenance')
        counts[category] += 1
    if any(applicability[c] and counts[c] == 0 for c in CATEGORIES):
        raise ValueError('Applicable categories cannot have zero tests')
    return rules


def score(rules, outcomes):
    """Require exactly one evidence-backed decision per applicable rule."""
    validate_rules(rules)
    tests = {t['id']: t for t in rules['tests']}
    if len(outcomes) != len(tests) or {o['test_id'] for o in outcomes} != set(tests):
        raise ValueError('Missing, duplicate, or unexpected outcomes')
    for o in outcomes:
        if o.get('outcome') not in OUTCOMES:
            raise ValueError('Invalid outcome')
        if o['outcome'] in {'pass', 'fail'} and not o.get('evidence'):
            raise ValueError('Pass/fail requires evidence')
    by_id = {o['test_id']: o for o in outcomes}
    categories = []
    points = Fraction(0)
    lower = Fraction(0)
    upper = Fraction(0)
    denominator = 0
    any_unknown = False
    applicable_outcomes = []
    critical_failure = False
    for category, weight in CATEGORIES.items():
        applicable = rules['applicability'][category]
        selected = [by_id[t['id']]['outcome'] for t in tests.values() if t['category'] == category] if applicable else []
        n_pass = selected.count('pass')
        n_fail = selected.count('fail')
        n_unknown = sum(o in {'unknown', 'unsupported'} for o in selected)
        value = None
        lo = hi = None
        if applicable:
            denominator += weight
            applicable_outcomes.extend(selected)
            if n_unknown:
                any_unknown = True
                lo = 1 if n_pass else 0
                hi = 1 if n_fail else 2
            else:
                value = 2 if n_pass == len(selected) else 1 if n_pass else 0
                lo = hi = value
                points += Fraction(weight * value, 2)
            lower += Fraction(weight * lo, 2)
            upper += Fraction(weight * hi, 2)
            critical_failure |= any(t['critical'] and by_id[t['id']]['outcome'] == 'fail' for t in tests.values() if t['category'] == category)
        categories.append({'category': category, 'weight': weight, 'applicable': applicable, 'score': value,
                           'possible_score_min': lo, 'possible_score_max': hi,
                           'passed': n_pass, 'failed': n_fail, 'unknown_or_unsupported': n_unknown})
    total = float(100 * points / denominator) if denominator and not any_unknown else None
    overall = False if critical_failure else None if any_unknown or not denominator else all(o == 'pass' for o in applicable_outcomes)
    return {'category_scores': categories, 'total_score': total, 'overall_pass': overall,
            'critical_failure': critical_failure,
            'possible_total_min': float(100 * lower / denominator) if denominator else None,
            'possible_total_max': float(100 * upper / denominator) if denominator else None,
            'resolved_test_count': sum(o in {'pass', 'fail'} for o in applicable_outcomes),
            'applicable_test_count': len(applicable_outcomes)}
