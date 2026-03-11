import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("contribution guardrails", () => {
  it("documents commit-per-slice rule", () => {
    const content = readFileSync("CONTRIBUTING.md", "utf8");
    expect(content).toMatch(/commit immediately after each completed slice/i);
  });
});