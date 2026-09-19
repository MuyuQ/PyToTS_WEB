/**
 * curriculum.ts 与内容目录的一致性校验。
 *
 * curriculum 是课程顺序的单一数据源，但它和磁盘上的 MDX 文件是两份事实：
 * slug 拼错或文件改名会让分页/测验/进度静默失效。这里双向核对——
 * curriculum 里有的课程必须有对应文件，目录里的课程必须登记在 curriculum 中。
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CURRICULUM, TRACK_ORDER, TRACKS } from "../../src/lib/curriculum";

// vitest 以仓库根为 cwd；jsdom 环境下 import.meta.url 不是 file 协议，用 cwd 拼路径
const docsRoot = join(process.cwd(), "src", "content", "docs");

function trackFiles(track: string): string[] {
  return readdirSync(join(docsRoot, "paths", track))
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((name) => name.replace(/\.(mdx|md)$/, ""));
}

describe("curriculum 与内容目录一致性", () => {
  it.each(TRACK_ORDER)("%s 路径：curriculum 的每个 slug 都有对应文件", (track) => {
    const files = new Set(trackFiles(track));
    const missing = CURRICULUM[track].filter((slug) => !files.has(slug));
    expect(missing, `缺少文件：${missing.join(", ")}`).toEqual([]);
  });

  it.each(TRACK_ORDER)("%s 路径：目录里的每个正课文件都登记在 curriculum", (track) => {
    // index.mdx 是侧边栏分组入口，约定不入课程序列（preparation 因历史原因例外，
    // 见 curriculum.test.ts 对入口页不参与上一课/下一课的断言）
    const registered = new Set(CURRICULUM[track]);
    const unregistered = trackFiles(track).filter(
      (slug) => slug !== "index" && !registered.has(slug)
    );
    expect(unregistered, `未登记进 curriculum：${unregistered.join(", ")}`).toEqual([]);
  });

  it("每条路径目录都有 index 入口页", () => {
    for (const track of TRACK_ORDER) {
      expect(
        trackFiles(track).some((slug) => slug === "index"),
        `${TRACKS[track].label}路径缺少 index.mdx`
      ).toBe(true);
    }
  });

  it("curriculum 内无重复 slug", () => {
    for (const track of TRACK_ORDER) {
      const slugs = CURRICULUM[track];
      expect(new Set(slugs).size, `${track} 存在重复 slug`).toBe(slugs.length);
    }
  });
});
