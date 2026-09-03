import { describe, it, expect } from "vitest";
import { lintLines } from "../../scripts/content-lint.mjs";

describe("content-lint", () => {
  it("标题含 emoji 应报错", () => {
    const issues = lintLines("a.mdx", "---\ntitle: t\nkind: page\n---\n## 🎯 标题\n");
    expect(issues.some((m) => m.includes("emoji"))).toBe(true);
  });

  it("根相对 Markdown 链接应报错", () => {
    const issues = lintLines("a.mdx", "---\ntitle: t\nkind: page\n---\n[课](/paths/)\n");
    expect(issues.some((m) => m.includes("根相对链接"))).toBe(true);
  });

  it("原生 a 标签根相对链接应报错", () => {
    const issues = lintLines("a.mdx", '---\ntitle: t\nkind: page\n---\n<a href="/paths/">课</a>\n');
    expect(issues.some((m) => m.includes("根相对链接"))).toBe(true);
  });

  it("lesson 缺必填 frontmatter 应报错", () => {
    const issues = lintLines("a.mdx", "---\ntitle: t\nkind: lesson\n---\n正文\n");
    expect(issues.some((m) => m.includes("level"))).toBe(true);
    expect(issues.some((m) => m.includes("difficulty"))).toBe(true);
  });

  it("algorithm 缺 tags 应报错", () => {
    const issues = lintLines(
      "a.mdx",
      "---\ntitle: t\nkind: algorithm\ndifficulty: easy\n---\n正文\n"
    );
    expect(issues.some((m) => m.includes("tags"))).toBe(true);
  });

  it("规范内容应零报错", () => {
    const issues = lintLines(
      "a.mdx",
      "---\ntitle: t\nkind: lesson\nlevel: migration\ntopic: x\ndifficulty: easy\nprerequisites: [a]\npython_tags: [b]\nts_tags: [c]\ndescription: d\n---\n## 标题\n[课](../paths/)\n"
    );
    expect(issues).toEqual([]);
  });
});
