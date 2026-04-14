import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("algorithm docs", () => {
  it("includes complexity and bilingual implementations", () => {
    const content = readFileSync("src/content/docs/algorithms/two-sum.mdx", "utf8");
    expect(content).toMatch(/## 复杂度分析/);
    expect(content).toMatch(/## Python 实现/);
    expect(content).toMatch(/## TypeScript 实现/);
  });
});
