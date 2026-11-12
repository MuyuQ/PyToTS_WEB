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

  it("单行写法的 CodeCompare 超长也应报错", () => {
    const longTs = "const value: number = 12345; // 这一行注释刻意超过四十八个字符的上限";
    const issues = lintLines(
      "a.mdx",
      `---\ntitle: t\nkind: page\n---\n<CodeCompare py={\`x = 1\`} ts={\`${longTs}\`} />\n`
    );
    expect(issues.some((m) => m.includes("CodeCompare"))).toBe(true);
  });

  it("规范内容应零报错", () => {
    const issues = lintLines(
      "a.mdx",
      "---\ntitle: t\nkind: lesson\nlevel: migration\ntopic: x\ndifficulty: easy\nprerequisites: [a]\npython_tags: [b]\nts_tags: [c]\ndescription: d\n---\n## 标题\n[课](../paths/)\n"
    );
    expect(issues).toEqual([]);
  });

  it("课程缺练一练或自测清单应报错（真实路径）", () => {
    const issues = lintLines(
      "src/content/docs/paths/foundation/x.mdx",
      "---\ntitle: t\nkind: lesson\nlevel: foundation\ntopic: x\ndifficulty: easy\nprerequisites: []\npython_tags: []\nts_tags: []\n---\n## 标题\n"
    );
    expect(issues.some((m) => m.includes("练一练出口"))).toBe(true);
    expect(issues.some((m) => m.includes("自测清单"))).toBe(true);
  });

  it("题解缺九段模板或追问未折叠应报错", () => {
    const issues = lintLines(
      "src/content/docs/algorithms/x.mdx",
      "---\ntitle: t\nkind: algorithm\ndifficulty: easy\ntags: [a]\n---\n## 问题描述\n"
    );
    expect(issues.some((m) => m.includes("必备小节"))).toBe(true);
    expect(issues.some((m) => m.includes("追问未折叠"))).toBe(true);
  });

  it("路径入口页不要求闭环元素", () => {
    const issues = lintLines(
      "src/content/docs/paths/preparation/index.mdx",
      "---\ntitle: t\nkind: lesson\nlevel: preparation\ntopic: x\ndifficulty: easy\nprerequisites: []\npython_tags: []\nts_tags: []\n---\n## TypeScript 是什么\n"
    );
    expect(issues).toEqual([]);
  });

  it("kind: page 的内容不校验教学模板", () => {
    const issues = lintLines(
      "src/content/docs/handbook/cheat-sheet.mdx",
      "---\ntitle: t\nkind: page\n---\n## 变量声明\n"
    );
    expect(issues).toEqual([]);
  });
});
