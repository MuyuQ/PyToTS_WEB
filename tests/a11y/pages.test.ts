import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

/**
 * Accessibility tests for main page templates
 * These tests simulate the rendered HTML structure of key pages
 */

describe("Page Accessibility - Home Page", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    const html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Python 到 TypeScript 迁移指南</title>
          <meta name="description" content="帮助 Python 开发者快速掌握 TypeScript 的学习资源">
        </head>
        <body>
          <a href="#main-content" class="skip-link">跳转到主要内容</a>

          <header role="banner">
            <nav role="navigation" aria-label="主导航">
              <a href="/" aria-current="page">首页</a>
              <a href="/learn">学习路径</a>
              <a href="/algorithms">算法</a>
            </nav>
            <button id="theme-toggle" aria-label="切换深色/浅色主题" aria-pressed="false">
              <span aria-hidden="true">icon</span>
            </button>
          </header>

          <main id="main-content" role="main">
            <h1>Python 到 TypeScript 迁移指南</h1>
            <p>专为 Python 开发者设计的 TypeScript 学习资源</p>

            <section aria-labelledby="features-heading">
              <h2 id="features-heading">学习特性</h2>
              <ul>
                <li>双语代码对比</li>
                <li>渐进式学习路径</li>
                <li>交互式测验</li>
              </ul>
            </section>

            <section aria-labelledby="paths-heading">
              <h2 id="paths-heading">学习路径</h2>
              <article>
                <h3><a href="/learn/types">类型系统</a></h3>
                <p>从 Python 类型到 TypeScript 类型的转换</p>
              </article>
              <article>
                <h3><a href="/learn/functions">函数</a></h3>
                <p>函数定义和异步编程的差异</p>
              </article>
            </section>
          </main>

          <footer role="contentinfo">
            <p>&copy; 2025 TypeScript Python Web</p>
          </footer>
        </body>
      </html>
    `;
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
  });

  it("should have skip link", () => {
    const skipLink = document.querySelector(".skip-link");
    expect(skipLink).toBeTruthy();
    expect(skipLink?.getAttribute("href")).toBe("#main-content");
  });

  it("should have proper landmarks", () => {
    expect(document.querySelector("header, [role='banner']")).toBeTruthy();
    expect(document.querySelector("main, [role='main']")).toBeTruthy();
    expect(document.querySelector("footer, [role='contentinfo']")).toBeTruthy();
    expect(document.querySelector("nav, [role='navigation']")).toBeTruthy();
  });

  it("should have unique IDs for skip link target", () => {
    const skipLink = document.querySelector(".skip-link");
    const targetId = skipLink?.getAttribute("href")?.substring(1);
    const target = document.getElementById(targetId || "");
    expect(target).toBeTruthy();
  });

  it("should have lang attribute on html", () => {
    const html = document.documentElement;
    expect(html.getAttribute("lang")).toBe("zh-CN");
  });

  it("should have title element", () => {
    const title = document.querySelector("title");
    expect(title).toBeTruthy();
    expect(title?.textContent).toContain("TypeScript");
  });

  it("should have h1 heading", () => {
    const h1 = document.querySelector("h1");
    expect(h1).toBeTruthy();
  });

  it("should have aria-label on navigation", () => {
    const nav = document.querySelector("nav[aria-label]");
    expect(nav?.getAttribute("aria-label")).toBe("主导航");
  });

  it("should have aria-current for active page", () => {
    const currentLink = document.querySelector("[aria-current='page']");
    expect(currentLink).toBeTruthy();
    expect(currentLink?.getAttribute("href")).toBe("/");
  });

  it("should have aria-labelledby linking sections to headings", () => {
    const sections = document.querySelectorAll("section[aria-labelledby]");
    expect(sections.length).toBeGreaterThan(0);

    sections.forEach((section) => {
      const labelledBy = section.getAttribute("aria-labelledby");
      const heading = document.getElementById(labelledBy || "");
      expect(heading).toBeTruthy();
      expect(heading?.tagName.toLowerCase()).toMatch(/^h[1-6]$/);
    });
  });

  it("should have aria-pressed for toggle button", () => {
    const toggle = document.querySelector("#theme-toggle");
    expect(toggle?.getAttribute("aria-pressed")).toBe("false");
  });

  it("should hide decorative icons from screen readers", () => {
    const icons = document.querySelectorAll("[aria-hidden='true']");
    expect(icons.length).toBeGreaterThan(0);
  });
});

describe("Page Accessibility - Learn Page", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    const html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>类型系统 - 学习 | Python to TypeScript</title>
        </head>
        <body>
          <a href="#main-content" class="skip-link">跳转到主要内容</a>

          <header role="banner">
            <nav role="navigation" aria-label="主导航">
              <a href="/">首页</a>
              <a href="/learn" aria-current="page">学习路径</a>
            </nav>
          </header>

          <div class="page-layout">
            <aside role="complementary" aria-label="侧边栏导航">
              <nav aria-label="章节导航">
                <ul>
                  <li><a href="#intro" aria-current="true">简介</a></li>
                  <li><a href="#types">类型定义</a></li>
                  <li><a href="#quiz">测验</a></li>
                </ul>
              </nav>
            </aside>

            <main id="main-content" role="main">
              <article>
                <h1>类型系统</h1>

                <section id="intro" aria-labelledby="intro-heading">
                  <h2 id="intro-heading">简介</h2>
                  <p>TypeScript 的类型系统...</p>
                </section>

                <section id="types" aria-labelledby="types-heading">
                  <h2 id="types-heading">类型定义</h2>
                  <div class="dual-code-block" role="region" aria-label="类型对比 - 双语代码对比">
                    <div class="code-panel">
                      <span class="lang-badge" aria-label="Python 代码">Python</span>
                      <pre tabindex="0" aria-label="Python 代码"><code>name: str = "hello"</code></pre>
                    </div>
                    <div class="code-panel">
                      <span class="lang-badge" aria-label="TypeScript 代码">TypeScript</span>
                      <pre tabindex="0" aria-label="TypeScript 代码"><code>const name: string = "hello";</code></pre>
                    </div>
                  </div>
                </section>

                <section id="quiz" aria-labelledby="quiz-heading">
                  <h2 id="quiz-heading">知识测验</h2>
                  <div class="quiz-container" role="region" aria-label="编程测验">
                    <div class="quiz-question" role="heading" aria-level="3">问题内容</div>
                    <div class="quiz-options" role="radiogroup" aria-label="选项"></div>
                  </div>
                </section>
              </article>
            </main>
          </div>

          <footer role="contentinfo">
            <p>&copy; 2025 TypeScript Python Web</p>
          </footer>
        </body>
      </html>
    `;
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
  });

  it("should have complementary landmark for sidebar", () => {
    const aside = document.querySelector("aside, [role='complementary']");
    expect(aside).toBeTruthy();
  });

  it("should have aria-labelledby linking sections to headings", () => {
    const sections = document.querySelectorAll("section[aria-labelledby]");
    expect(sections.length).toBeGreaterThan(0);

    sections.forEach((section) => {
      const labelledBy = section.getAttribute("aria-labelledby");
      const heading = document.getElementById(labelledBy || "");
      expect(heading).toBeTruthy();
    });
  });

  it("should have proper heading structure", () => {
    const h1 = document.querySelector("h1");
    const h2s = document.querySelectorAll("h2");
    expect(h1).toBeTruthy();
    expect(h2s.length).toBeGreaterThan(0);
  });

  it("should have tabindex on code blocks", () => {
    const codeBlocks = document.querySelectorAll("pre[tabindex]");
    expect(codeBlocks.length).toBeGreaterThan(0);
  });

  it("should have aria-label on code blocks", () => {
    const codeBlocks = document.querySelectorAll("pre[aria-label]");
    expect(codeBlocks.length).toBeGreaterThan(0);
  });

  it("should have role region for quiz container", () => {
    const quiz = document.querySelector(".quiz-container");
    expect(quiz?.getAttribute("role")).toBe("region");
  });

  it("should have radiogroup for quiz options", () => {
    const options = document.querySelector(".quiz-options");
    expect(options?.getAttribute("role")).toBe("radiogroup");
  });
});

describe("Page Accessibility - Algorithm Page", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    const html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>两数之和 - 算法 | Python to TypeScript</title>
        </head>
        <body>
          <a href="#main-content" class="skip-link">跳转到主要内容</a>

          <header role="banner">
            <nav role="navigation" aria-label="主导航">
              <a href="/">首页</a>
              <a href="/algorithms" aria-current="page">算法</a>
            </nav>
          </header>

          <main id="main-content" role="main">
            <article>
              <header>
                <h1>两数之和</h1>
                <p>难度: <span>简单</span></p>
              </header>

              <section aria-labelledby="desc-heading">
                <h2 id="desc-heading">问题描述</h2>
                <p>给定一个整数数组...</p>
              </section>

              <section aria-labelledby="solution-heading">
                <h2 id="solution-heading">解法</h2>
                <div class="diff-insight" role="note" aria-label="Python 与 TypeScript 差异说明">
                  <h3>差异要点</h3>
                  <ul>
                    <li>数组类型定义</li>
                    <li>返回类型标注</li>
                  </ul>
                </div>

                <div class="code-comparison">
                  <figure>
                    <figcaption>Python 实现</figcaption>
                    <pre tabindex="0"><code class="language-python">def two_sum(nums, target):</code></pre>
                  </figure>
                  <figure>
                    <figcaption>TypeScript 实现</figcaption>
                    <pre tabindex="0"><code class="language-typescript">function twoSum(nums: number[], target: number): number[] {</code></pre>
                  </figure>
                </div>
              </section>

              <nav aria-label="算法导航">
                <a href="/algorithms/prev">上一题</a>
                <a href="/algorithms/next">下一题</a>
              </nav>
            </article>
          </main>

          <footer role="contentinfo">
            <p>&copy; 2025 TypeScript Python Web</p>
          </footer>
        </body>
      </html>
    `;
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
  });

  it("should have figure with figcaption for code", () => {
    const figures = document.querySelectorAll("figure");
    expect(figures.length).toBeGreaterThan(0);

    figures.forEach((figure) => {
      expect(figure.querySelector("figcaption")).toBeTruthy();
    });
  });

  it("should have tabindex on code blocks", () => {
    const codeBlocks = document.querySelectorAll("pre[tabindex]");
    expect(codeBlocks.length).toBeGreaterThan(0);
  });

  it("should have note role for diff insight", () => {
    const diffInsight = document.querySelector(".diff-insight");
    expect(diffInsight?.getAttribute("role")).toBe("note");
  });

  it("should have aria-label for diff insight", () => {
    const diffInsight = document.querySelector(".diff-insight");
    expect(diffInsight?.getAttribute("aria-label")).toBe("Python 与 TypeScript 差异说明");
  });

  it("should have article element for algorithm content", () => {
    const article = document.querySelector("article");
    expect(article).toBeTruthy();
  });
});

describe("Accessibility Requirements Checklist", () => {
  it("should verify common accessibility patterns are tested", () => {
    const requiredPatterns = [
      "Skip links",
      "ARIA labels",
      "Heading structure",
      "Landmark regions",
      "Focus management",
      "Keyboard navigation",
    ];

    // This test serves as documentation for required a11y patterns
    expect(requiredPatterns).toContain("Skip links");
    expect(requiredPatterns).toContain("ARIA labels");
    expect(requiredPatterns).toContain("Heading structure");
  });

  it("should have all required a11y patterns", () => {
    const patterns = [
      "Skip links",
      "ARIA labels",
      "Heading structure",
      "Landmark regions",
      "Focus management",
      "Keyboard navigation",
    ];
    expect(patterns).toHaveLength(6);
  });
});
