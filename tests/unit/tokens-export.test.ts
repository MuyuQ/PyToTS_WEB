/**
 * 设计令牌导出脚本的数据契约：
 * tokens.css 改块结构（如插入新的 :root 块）时这里会先红，避免导出悄悄取错层。
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { extractTokens, buildSnapshot } from "../../scripts/export-tokens.mjs";

const tokens = readFileSync("src/styles/tokens.css", "utf8");
const layers = extractTokens(tokens);

describe("design tokens 导出", () => {
  it("primitives 层抓到品牌与语言色", () => {
    expect(layers.primitives["--brand-500"]).toMatch(/^oklch\(/);
    expect(layers.primitives["--py-ink"]).toMatch(/^oklch\(/);
    expect(layers.primitives["--ts-ink"]).toMatch(/^oklch\(/);
  });

  it("明暗两层都包含核心语义令牌", () => {
    for (const name of ["--surface-page", "--text-strong", "--accent"]) {
      expect(layers.light[name], `light 缺 ${name}`).toBeTruthy();
      expect(layers.dark[name], `dark 缺 ${name}`).toBeTruthy();
    }
  });

  it("明暗底色必须是 tokens.css 内联脚本快照的来源", () => {
    // astro.config 内联防白闪脚本的 DARK/LIGHT 字面值依赖这两层
    expect(layers.dark["--surface-page"]).toContain("var(--neutral-950)");
    expect(layers.light["--surface-page"]).toContain("var(--neutral-25)");
  });

  it("快照含 $meta 且令牌总数为正", () => {
    const snapshot = buildSnapshot(tokens);
    expect(snapshot.$meta.layers.primitives).toBeGreaterThan(0);
    expect(snapshot.$meta.layers.light).toBeGreaterThan(0);
    expect(snapshot.$meta.layers.dark).toBeGreaterThan(0);
  });

  it("空输入导出中止", () => {
    expect(() => buildSnapshot("/* empty */")).toThrow();
  });
});
