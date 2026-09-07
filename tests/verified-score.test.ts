import { test, expect } from "bun:test";
import { verifiedScore } from "../website/verifiedScore";

test("verified score uses weighted passing evidence without treating missing checks as passes", () => {
  const category = { applicable: true, weight: 30, passed: 1, failed: 0, unknown_or_unsupported: 2 };
  expect(verifiedScore([category])).toBe(33.3);
  expect(verifiedScore([category, { ...category, weight: 70, passed: 4, unknown_or_unsupported: 0 }])).toBe(80);
  expect(verifiedScore([{ ...category, passed: 0 }])).toBe(0);
  expect(verifiedScore([{ ...category, unknown_or_unsupported: 0 }])).toBe(100);
  expect(verifiedScore([{ ...category, applicable: false }])).toBeNull();
  expect(() => verifiedScore([{ ...category, passed: -1 }])).toThrow("Invalid category evidence");
  expect(() => verifiedScore([{ ...category, passed: 0, unknown_or_unsupported: 0 }])).toThrow("Invalid category evidence");
  expect(category.unknown_or_unsupported).toBe(2);
});
