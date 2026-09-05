/**
 * 测验覆盖率：每门课程都应该有对应的编程测验
 *
 * 对应关系按约定派生：课程 slug（kebab-case）→ quizId（camelCase），
 * 例如 control-flow → controlFlow。这意味着 slug 拼写错一个连字符，
 * 这里就会立刻报出来，而不是测验页静默少一块。
 *
 * 豁免：QUAZZES 豁免名单里的课没有知识点测验（环境/工具准备类）。
 * 给课程补了测验后，记得把它从豁免名单里删掉。
 */
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { QUIZZES, quizIds } from "../../src/data/quizzes";

const PATHS_DIR = "src/content/docs/paths";

/** 课程页路径 → 测验页渲染 <QuizContainer> 的 id */
function slugToQuizId(slug: string): string {
  return slug
    .split("-")
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
}

/** 全部课程 slug（排除 index 入口页） */
function lessonSlugs(): { track: string; slug: string }[] {
  const result: { track: string; slug: string }[] = [];
  for (const track of readdirSync(PATHS_DIR, { withFileTypes: true })) {
    if (!track.isDirectory()) continue;
    for (const file of readdirSync(`${PATHS_DIR}/${track.name}`)) {
      if (!file.endsWith(".mdx")) continue;
      const slug = file.replace(/\.mdx$/, "");
      if (slug === "index") continue;
      result.push({ track: track.name, slug });
    }
  }
  return result;
}

/** 测验页引用的全部 quizId */
function referencedQuizIds(): string[] {
  const page = readFileSync("src/content/docs/practice/quiz/index.mdx", "utf8");
  return [...page.matchAll(/quizId="([\w-]+)"/g)].map((m) => m[1]);
}

/** 这些课是环境/工具准备，没有可出题的知识点，暂不要求覆盖 */
const EXEMPT_SLUGS = new Set(["setup", "typescript-intro"]);

describe("quiz coverage", () => {
  it("每门课程（除豁免）都有对应测验", () => {
    const missing: string[] = [];

    for (const { track, slug } of lessonSlugs()) {
      if (EXEMPT_SLUGS.has(slug)) continue;
      const id = slugToQuizId(slug);
      if (!(id in QUIZZES)) missing.push(`${track}/${slug} → 期望 quizId "${id}"`);
    }

    expect(missing, `以下课程缺少测验：\n${missing.join("\n")}`).toEqual([]);
  });

  it("测验页引用的每个 quizId 都真实存在（防 slug 拼错静默失效）", () => {
    const unknown = referencedQuizIds().filter((id) => !(id in QUIZZES));
    expect(unknown, `测验页引用了不存在的 quizId：${unknown.join(", ")}`).toEqual([]);
  });

  it("题库里的每个 quizId 都被测验页引用（防死数据堆积）", () => {
    const referenced = new Set(referencedQuizIds());
    const orphan = quizIds().filter((id) => !referenced.has(id));
    expect(orphan, `这些 quizId 没有任何页面引用：${orphan.join(", ")}`).toEqual([]);
  });

  it("测验数据文件存在且可读", () => {
    expect(existsSync("src/data/quizzes.ts")).toBe(true);
  });
});
