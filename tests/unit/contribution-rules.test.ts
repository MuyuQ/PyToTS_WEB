import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("contribution guardrails", () => {
  it("documents commit-per-slice rule", () => {
    const content = readFileSync("CONTRIBUTING.md", "utf8");
    expect(content).toMatch(/完成后立即提交/);
  });

  it("QuizContainer 不使用 any 类型（用 unknown/精确类型替代）", () => {
    const content = readFileSync("src/components/QuizContainer.astro", "utf8");
    expect(content).not.toMatch(/:\s*any\b/);
  });

  it("Astro 组件客户端脚本不使用 require（浏览器 ESM 无 require）", () => {
    const content = readFileSync("src/components/QuizContainer.astro", "utf8");
    // 剥离字符串字面量：题面文本里的 require('os') 是数据，不是调用
    const code = content.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/gs, '""');
    expect(code).not.toMatch(/[^a-zA-Z]require\s*\(/);
  });
});
