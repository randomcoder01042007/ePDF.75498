import { describe, expect, it } from "vitest";
import { parseRanges } from "@/lib/tools";

describe("parseRanges", () => {
  it("parses ranges into zero-based sorted pages", () => {
    expect(parseRanges("5, 1-3", 6)).toEqual([0, 1, 2, 4]);
  });
  it("rejects pages beyond the document", () => {
    expect(() => parseRanges("1-9", 6)).toThrow();
  });
});
