import { test, expect } from "bun:test";
import { overallVerifiedScore } from "../website/verifiedScore";

test("overall verified score weights designs equally and retains missing and failed designs", () => {
  expect(overallVerifiedScore([100, 0])).toBe(50);
  expect(overallVerifiedScore([80, 90, 90])).toBe(86.7);
  expect(overallVerifiedScore([100, null])).toBeNull();
  expect(overallVerifiedScore([])).toBeNull();
  expect(() => overallVerifiedScore([101])).toThrow("Invalid design score");
});
