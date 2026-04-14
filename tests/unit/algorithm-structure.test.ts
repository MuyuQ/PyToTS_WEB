import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("algorithm docs", () => {
  it("includes complexity and bilingual implementations", () => {
    const content = readFileSync("src/content/docs/algorithms/two-sum.mdx", "utf8");
    expect(content).toMatch(/## 复杂度分析/);
    expect(content).toMatch(/## 双语实现/);
    expect(content).toMatch(/<Tabs/);
    expect(content).toMatch(/<TabItem/);
    expect(content).toMatch(/syncKey="language"/);
  });
});
