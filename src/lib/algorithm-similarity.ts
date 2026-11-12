/**
 * 按标签重合度挑选题解。
 *
 * 单独成模块是为了不依赖 astro:content 的虚拟模块，让这段排序逻辑能被单测直接覆盖。
 * 标签全部来自题解 frontmatter，不做任何推断或编造。
 */

export interface Taggable {
  title: string;
  tags: string[];
}

/**
 * 返回与 current 标签重合度最高的若干条（不含 current 本身，重合度为 0 的不返回）。
 * 同分时按题名排序，保证结果稳定；调用方传入的 entries 顺序作为最终兜底。
 */
export function rankByTagOverlap<T extends Taggable>(
  entries: readonly T[],
  current: T,
  limit: number
): T[] {
  const tags = new Set(current.tags);
  if (tags.size === 0) return [];

  // 常见标签（如 array）几乎每道题都有，区分度低；稀有标签（如 hash-table）
  // 才代表「同一类问题」。用文档频率倒数加权，避免推荐全被泛标签占满。
  const documentFrequency = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of new Set(entry.tags)) {
      documentFrequency.set(tag, (documentFrequency.get(tag) ?? 0) + 1);
    }
  }

  return entries
    .filter((entry) => entry !== current)
    .map((entry, index) => ({
      entry,
      index,
      score: [...new Set(entry.tags)]
        .filter((tag) => tags.has(tag))
        .reduce((sum, tag) => sum + 1 / (documentFrequency.get(tag) ?? 1), 0),
    }))
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.entry.title.localeCompare(b.entry.title, "zh-Hans-CN") ||
        a.index - b.index
    )
    .slice(0, limit)
    .map((item) => item.entry);
}
