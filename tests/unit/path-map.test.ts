import { describe, it, expect } from "vitest";
import { getNextPathStep } from "../../src/lib/path-map";

describe("getNextPathStep", () => {
  it("returns next lesson slug in same track", () => {
    expect(getNextPathStep("migration", "functions")).toBe("migration/async");
  });
});