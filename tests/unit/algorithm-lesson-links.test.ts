/**
 * 守护「题解 ↔ 课程」双向连接：只连高置信的 10 道，且不允许单向链接。
 * 映射依据见 .workbuddy/s1-mapping-2026-11-12.md。
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(process.cwd(), "src", "content", "docs");
const ALGO = join(ROOT, "algorithms");
const PATHS = join(ROOT, "paths");
const TRACKS = ["preparation", "foundation", "migration", "advanced"];

const backlinks = readdirSync(ALGO)
  .filter((name) => name.endsWith(".mdx") && name !== "index.mdx")
  .flatMap((name) => {
    const source = readFileSync(join(ALGO, name), "utf8");
    const match = source.match(/\*\*回到课程：\*\*[^\n]*\]\(\.\.\/\.\.\/paths\/([^/]+\/[^/]+)\/\)/);
    return match ? [{ slug: name.replace(/\.mdx$/, ""), lesson: match[1] }] : [];
  });

function lessonFiles(): string[] {
  return TRACKS.flatMap((track) =>
    readdirSync(join(PATHS, track))
      .filter((name) => name.endsWith(".mdx") && name !== "index.mdx")
      .map((name) => join(PATHS, track, name))
  );
}

describe("题解与课程的双向连接", () => {
  it("只连高置信的 10 道题，不多不少", () => {
    expect(backlinks.length).toBe(10);
  });

  it.each(backlinks)("$slug 回链的课程文件存在", ({ lesson }) => {
    expect(existsSync(join(PATHS, `${lesson}.mdx`))).toBe(true);
  });

  it.each(backlinks)("$slug 在课程页有反向链接", ({ slug, lesson }) => {
    const source = readFileSync(join(PATHS, `${lesson}.mdx`), "utf8");
    expect(source).toContain(`](../../../algorithms/${slug}/)`);
  });

  it("课程页配套区里的每道题都有回链（无单向链接）", () => {
    const linked = new Set(backlinks.map((item) => item.slug));
    const dangling: string[] = [];
    for (const file of lessonFiles()) {
      const source = readFileSync(file, "utf8");
      if (!source.includes("**配套题解**")) continue;
      for (const match of source.matchAll(/\]\(\.\.\/\.\.\/\.\.\/algorithms\/([^/]+)\/\)/g)) {
        if (!linked.has(match[1])) dangling.push(`${file}: ${match[1]}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  it("配套题解区只出现在确实有映射的课程页", () => {
    const withSection = lessonFiles().filter((file) =>
      readFileSync(file, "utf8").includes("**配套题解**")
    );
    expect(withSection.length).toBe(2);
  });
});
