/** Website metric v1; independent of the frozen deterministic-v1 total. */
export interface VerifiedScoreCategory {
  applicable: boolean;
  weight: number;
  passed: number;
  failed: number;
  unknown_or_unsupported: number;
}

export function verifiedScore(categories: VerifiedScoreCategory[]): number | null {
  let points = 0;
  let weight = 0;
  for (const category of categories) {
    if (!category.applicable) continue;
    const counts = [category.passed, category.failed, category.unknown_or_unsupported];
    const total = counts.reduce((sum, count) => sum + count, 0);
    if (counts.some((count) => !Number.isSafeInteger(count) || count < 0) ||
      !Number.isFinite(category.weight) || category.weight <= 0 || total === 0) {
      throw Error("Invalid category evidence for verified score");
    }
    points += category.weight * category.passed / total;
    weight += category.weight;
  }
  return weight === 0 ? null : Math.round(1000 * points / weight) / 10;
}
