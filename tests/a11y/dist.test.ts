import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

/**
 * 对真实构建产物（dist/）做可访问性检查。
 *
 * 历史教训：本目录曾对手写 HTML fixture 断言（.skip-link / #theme-toggle /
 * .dual-code-block 等真实站点里根本不存在的东西），永远全绿但对零真实覆盖。
 * 现在直接解析 dist 页面跑 axe + 结构断言，构建产物是什么就测什么。
 *
 * 前置条件：先 npm run build（npm run check 的执行顺序是 build → test）。
 */

const PAGES = [
  "",
  "paths/",
  "paths/migration/types/",
  "algorithms/climbing-stairs/",
  "practice/quiz/",
] as const;

function distFile(page: string): string {
  return resolve("dist", page, "index.html");
}

function loadPage(page: string): string {
  const file = distFile(page);
  if (!existsSync(file)) {
    throw new Error(
      `dist/${page}/index.html 不存在——请先 npm run build（npm run check 已保证 build 先于 test）`
    );
  }
  return readFileSync(file, "utf8");
}

/** 在页面自身的 JS 上下文里跑 axe（runScripts: outside-only，页面脚本不执行） */
async function axeViolations(html: string): Promise<{ id: string; impact: string | null }[]> {
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
  dom.window.eval(readFileSync(resolve("node_modules/axe-core/axe.min.js"), "utf8"));
  const violations = await dom.window.eval(
    "axe.run(document, { resultTypes: ['violations'] }).then((r) => JSON.parse(JSON.stringify(r.violations)))"
  );
  return violations as { id: string; impact: string | null }[];
}

describe.each(PAGES)("真实页面可访问性：/%s", (page) => {
  const html = loadPage(page);

  it("axe：无 serious/critical 违规", async () => {
    const violations = await axeViolations(html);
    const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      blocking.map((v) => `${v.id}(${v.impact})`),
      `发现阻断级违规：${blocking.map((v) => v.id).join(", ")}`
    ).toEqual([]);
  }, 30_000);

  it("html[lang]、title、单一 h1、站点主导航 aria-label", () => {
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    expect(doc.documentElement.getAttribute("lang")).toBeTruthy();
    expect(doc.querySelector("title")?.textContent).toBeTruthy();

    const h1s = doc.querySelectorAll("h1");
    expect(h1s.length).toBe(1);

    // 真实组件 SiteNav.astro 的产物（旧测试断言的「主导航」是虚构的）
    const nav = doc.querySelector("nav.site-nav");
    expect(nav?.getAttribute("aria-label")).toBe("站点主导航");
  });
});

describe("真实组件标记（来自构建产物）", () => {
  it("CodeCompare：figure 双栏，Python 在前", () => {
    const doc = new JSDOM(loadPage("algorithms/climbing-stairs/")).window.document;
    const figure = doc.querySelector("figure.code-compare");
    expect(figure).toBeTruthy();

    const panes = figure?.querySelectorAll(".code-compare__pane");
    expect(panes?.length).toBe(2);
    expect(panes?.[0].classList.contains("code-compare__pane--py")).toBe(true);
    expect(panes?.[1].classList.contains("code-compare__pane--ts")).toBe(true);

    // 两个面板都有可读的语言标题
    const headers = figure?.querySelectorAll(".code-compare__header");
    expect(headers?.[0].textContent).toContain("Python");
    expect(headers?.[1].textContent).toContain("TypeScript");
  });

  it("测验页：radiogroup + polite 解释区（无 role=alert）", () => {
    const doc = new JSDOM(loadPage("practice/quiz/")).window.document;

    const container = doc.querySelector(".quiz-container[data-quiz-id]");
    expect(container).toBeTruthy();
    // 题库已改为客户端 import，页面不再内嵌 data-questions JSON
    expect(container?.hasAttribute("data-questions")).toBe(false);

    expect(doc.querySelector('.quiz-options[role="radiogroup"]')).toBeTruthy();

    const explanations = doc.querySelectorAll(".quiz-explanation");
    expect(explanations.length).toBeGreaterThan(0);
    for (const el of explanations) {
      expect(el.getAttribute("aria-live")).toBe("polite");
      expect(el.getAttribute("role")).toBeNull();
    }
  });
});
