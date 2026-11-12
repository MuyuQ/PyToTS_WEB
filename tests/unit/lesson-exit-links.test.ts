/**
 * 课程学习闭环守护。
 *
 * 两件事曾经各写一套、互相漂移：
 * 1. 课程顺序：curriculum.ts 是单一数据源，但正文里还手写「下一步」，导致跳课/倒退。
 *    下一课现在只由 Pagination.astro 派生，正文不得再写。
 * 2. 练习出口：题库按课程分好组，但课程页没有链接过去，学员学完不会去练。
 *    每课尾部统一放「练一练」直达本课题组。
 *
 * 锚点是否真实存在由 scripts/link-check.mjs 在构建产物层校验，这里只守源码契约。
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CURRICULUM, TRACK_ORDER } from "../../src/lib/curriculum";

const docsRoot = join(process.cwd(), "src", "content", "docs");

const lessons = TRACK_ORDER.flatMap((track) =>
  CURRICULUM[track].filter((slug) => slug !== "index").map((slug) => ({ track, slug }))
);

function sourceOf(track: string, slug: string): string {
  return readFileSync(join(docsRoot, "paths", track, `${slug}.mdx`), "utf8");
}

describe("课程学习闭环", () => {
  it.each(lessons)("$track/$slug 有直达测验页的练一练出口", ({ track, slug }) => {
    const source = sourceOf(track, slug);
    expect(source).toMatch(/\*\*练一练：\*\*[^\n]*\]\(\.\.\/\.\.\/\.\.\/practice\/quiz\/#[^)]+\)/);
  });

  it.each(lessons)("$track/$slug 不残留手写下一课导航", ({ track, slug }) => {
    const source = sourceOf(track, slug);
    expect(source, "下一课由 Pagination 依据 curriculum 派生，正文不要写第二套顺序").not.toMatch(
      /\*\*下一步：\*\*\s*\[|\[下一课：/
    );
    expect(source, "不要用箭头链接手写下一课，交给 Pagination").not.toMatch(/^→ \[/m);
  });

  it("练一练统一位于文末，且每课只有一处", () => {
    for (const { track, slug } of lessons) {
      const source = sourceOf(track, slug);
      const count = (source.match(/\*\*练一练：\*\*/g) ?? []).length;
      expect(count, `${track}/${slug} 的练一练出口数量`).toBe(1);
    }
  });
});
