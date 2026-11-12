import { describe, expect, it } from "vitest";
import { rankByTagOverlap, type Taggable } from "../../src/lib/algorithm-similarity";

const make = (title: string, tags: string[]): Taggable => ({ title, tags });

describe("按标签重合度推荐题解", () => {
  it("重合标签多的排在前面", () => {
    const current = make("当前", ["array", "hash-table", "two-pointers"]);
    const two = make("两个重合", ["array", "hash-table"]);
    const one = make("一个重合", ["array", "dp"]);
    const none = make("没有重合", ["graph", "bfs"]);
    expect(rankByTagOverlap([none, one, two, current], current, 4).map((x) => x.title)).toEqual([
      "两个重合",
      "一个重合",
    ]);
  });

  it("不返回自己与零重合项", () => {
    const current = make("当前", ["array"]);
    const other = make("别的", ["graph"]);
    expect(rankByTagOverlap([current, other], current, 4)).toEqual([]);
  });

  it("当前题没有标签时返回空，不做难度兜底", () => {
    const current = make("当前", []);
    expect(rankByTagOverlap([current, make("别的", ["array"])], current, 4)).toEqual([]);
  });

  it("稀有标签比常见标签权重高", () => {
    const current = make("当前", ["common", "rare"]);
    const common = Array.from({ length: 8 }, (_, index) => make(`常见${index}`, ["common"]));
    const rare = make("稀有", ["rare"]);
    expect(rankByTagOverlap([...common, rare, current], current, 1).map((x) => x.title)).toEqual([
      "稀有",
    ]);
  });

  it("limit 生效，且同分时结果稳定", () => {
    const current = make("当前", ["array"]);
    const a = make("A", ["array"]);
    const b = make("B", ["array"]);
    const c = make("C", ["array"]);
    expect(rankByTagOverlap([c, b, a, current], current, 2).map((x) => x.title)).toEqual([
      "A",
      "B",
    ]);
  });
});
