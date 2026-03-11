import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("lesson structure", () => {
  it("contains both Python and TypeScript sections", () => {
    const content = readFileSync("src/content/docs/paths/migration/functions.mdx", "utf8");
    expect(content).toMatch(/## Python/);
    expect(content).toMatch(/## TypeScript/);
  });
});