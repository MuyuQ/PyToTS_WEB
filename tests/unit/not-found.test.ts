/**
 * 404 页的配色与站点同源校验
 *
 * 404 是 GitHub Pages 直接展示的独立页面，拿不到站点 CSS，颜色只能内联。
 * 曾经这里硬编码了一套 hex 色（#4051b5 等），站点换 OKLCH 后就漂移了。
 * 现在改为构建时从 tokens.css 抽取——本测试守住这条链路不被改回硬编码。
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// 与项目其它单测一致：路径相对 vitest 的项目根目录
const notFound = readFileSync("src/pages/404.astro", "utf8");
const tokens = readFileSync("src/styles/tokens.css", "utf8");

/** tokens.css 里某个变量的定义值（原语块 / 语义块都找） */
function tokenValue(name: string): string | undefined {
  return tokens.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`))?.[1]?.trim();
}

describe("404 页配色", () => {
  it("从 tokens.css 抽取色值，不在页内硬编码", () => {
    expect(notFound).toContain("from '../styles/tokens.css?raw'");
    expect(notFound).toMatch(/resolve\(light\['--surface-page'\]/);
    expect(notFound).toMatch(/resolve\(dark\['--surface-page'\]/);
  });

  it("不残留旧的 hex 色值", () => {
    // 旧配色：#4051b5 强调色、#1a1a2e 墨色、#e1e4e8 边框、#0c0e12 暗底
    for (const hex of ["#4051b5", "#1a1a2e", "#e1e4e8", "#0c0e12"]) {
      expect(notFound).not.toContain(hex);
    }
  });

  it("抽取逻辑依赖的令牌在 tokens.css 中仍然存在", () => {
    const needed = [
      "--surface-page",
      "--surface-raised",
      "--text-strong",
      "--text-muted",
      "--border-subtle",
      "--accent",
      "--accent-hover",
      "--accent-quiet",
      "--accent-ink",
    ] as const;

    for (const name of needed) {
      // 变量在明暗两块中都应存在，否则 404 会在某个主题下取到空值
      const occurrences = tokens.match(new RegExp(`\\${name}\\s*:`, "g")) ?? [];
      expect(occurrences.length, `${name} 应同时定义在明暗两块`).toBeGreaterThanOrEqual(2);
    }
  });

  it("tokens.css 的色值块顺序未变（抽取依赖它）", () => {
    // primitives 取第一个 `:root {`，light/dark 按 data-theme 定位；
    // 若有人在文件顶部插入另一个 :root 块，抽取就会取错
    const firstRoot = tokens.search(/^:root\s*\{/m);
    const primitivesStart = tokens.indexOf("--brand-50");
    expect(firstRoot).toBeGreaterThanOrEqual(0);
    expect(primitivesStart).toBeGreaterThan(firstRoot);

    expect(tokens).toMatch(/:root,\s*\[data-theme="light"\]\s*\{/);
    expect(tokens).toMatch(/\[data-theme="dark"\]\s*\{/);
  });

  it("给出具体出口而不只是返回首页", () => {
    for (const slug of ["paths", "algorithms", "handbook"]) {
      // 出口用 base 拼接，保证子路径部署下不会 404 到站内
      expect(notFound).toMatch(new RegExp(`href:\\s*\`\\$\\{base\\}${slug}/\``));
    }
    expect(notFound).toContain("const base = '/PyToTS_WEB/';");
  });

  it("品牌色变量确实解析得到 OKLCH 值", () => {
    const accent = tokenValue("brand-600");
    expect(accent).toMatch(/^oklch\(/);
  });
});
