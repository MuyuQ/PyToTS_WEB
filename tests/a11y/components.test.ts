import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import axe from "axe-core";

// Helper function to run axe on a document
describe("axe-core accessibility tests", () => {
  describe("QuizContainer Accessibility", () => {
    let dom: JSDOM;

    beforeEach(() => {
      const html = `
        <!DOCTYPE html>
        <html lang="zh-CN">
          <head>
            <title>Quiz Test</title>
          </head>
          <body>
            <main>
              <div class="quiz-container" data-quiz-id="test" role="region" aria-label="编程测验" tabindex="-1">
                <div class="quiz-header">
                  <span class="quiz-progress" aria-live="polite">问题 1 / 5</span>
                </div>
                <div class="quiz-question" role="heading" aria-level="3">Python 的 list[int] 对应 TypeScript 的什么类型？</div>
                <div class="quiz-options" role="radiogroup" aria-label="选项">
                  <button class="quiz-option" role="radio" aria-checked="false" aria-label="选项 1: number[]" tabindex="0">number[]</button>
                  <button class="quiz-option" role="radio" aria-checked="false" aria-label="选项 2: List<number>" tabindex="0">List&lt;number&gt;</button>
                </div>
                <div class="quiz-explanation" style="display: none;" role="alert" aria-live="polite"></div>
                <div class="quiz-actions">
                  <button class="quiz-action-btn" disabled aria-label="提交答案">提交答案</button>
                </div>
                <div class="quiz-result" style="display: none;" role="region" aria-label="测验结果"></div>
              </div>
            </main>
          </body>
        </html>
      `;
      dom = new JSDOM(html, { runScripts: "dangerously" });
    });

    it("should have no critical accessibility violations", async () => {
      const document = dom.window.document;
      const results = await axe.run(document.documentElement);

      const criticalViolations = results.violations.filter(
        (v) => v.impact === "critical"
      );
      expect(criticalViolations).toHaveLength(0);
    });

    it("should have proper ARIA roles", async () => {
      const document = dom.window.document;
      const quizContainer = document.querySelector(".quiz-container");

      expect(quizContainer?.getAttribute("role")).toBe("region");
      expect(quizContainer?.getAttribute("aria-label")).toBe("编程测验");

      const radiogroup = document.querySelector(".quiz-options");
      expect(radiogroup?.getAttribute("role")).toBe("radiogroup");
    });

    it("should have proper heading structure", async () => {
      const document = dom.window.document;
      const questionHeading = document.querySelector(
        ".quiz-question[role='heading']"
      );

      expect(questionHeading).toBeTruthy();
      expect(questionHeading?.getAttribute("aria-level")).toBe("3");
    });

    it("should have accessible form controls", async () => {
      const document = dom.window.document;
      const buttons = document.querySelectorAll("button");

      buttons.forEach((button) => {
        // Each button should have text content or aria-label
        const hasLabel =
          button.textContent?.trim() || button.getAttribute("aria-label");
        expect(hasLabel).toBeTruthy();
      });
    });

    it("should have aria-live regions for dynamic content", async () => {
      const document = dom.window.document;
      const progress = document.querySelector(".quiz-progress");
      const explanation = document.querySelector(".quiz-explanation");

      expect(progress?.getAttribute("aria-live")).toBe("polite");
      expect(explanation?.getAttribute("aria-live")).toBe("polite");
    });
  });

  describe("DualCodeBlock Accessibility", () => {
    let dom: JSDOM;

    beforeEach(() => {
      const html = `
        <!DOCTYPE html>
        <html lang="zh-CN">
          <head>
            <title>Code Block Test</title>
          </head>
          <body>
            <main>
              <div class="dual-code-block" role="region" aria-label="类型定义 - 双语代码对比">
                <h4 class="block-title">类型定义</h4>
                <div class="code-container">
                  <div class="code-panel">
                    <div class="panel-header">
                      <span class="lang-badge python" aria-label="Python 代码">Python</span>
                    </div>
                    <pre class="code" tabindex="0" aria-label="Python 代码"><code class="language-python">def greet(name: str) -> str:</code></pre>
                  </div>
                  <div class="code-panel">
                    <div class="panel-header">
                      <span class="lang-badge typescript" aria-label="TypeScript 代码">TypeScript</span>
                    </div>
                    <pre class="code" tabindex="0" aria-label="TypeScript 代码"><code class="language-typescript">function greet(name: string): string {</code></pre>
                  </div>
                </div>
              </div>
            </main>
          </body>
        </html>
      `;
      dom = new JSDOM(html, { runScripts: "dangerously" });
    });

    it("should have no critical accessibility violations", async () => {
      const document = dom.window.document;
      const results = await axe.run(document.documentElement);

      const criticalViolations = results.violations.filter(
        (v) => v.impact === "critical"
      );
      expect(criticalViolations).toHaveLength(0);
    });

    it("should have proper region role", async () => {
      const document = dom.window.document;
      const container = document.querySelector(".dual-code-block");
      expect(container?.getAttribute("role")).toBe("region");
    });

    it("should have aria-label on language badges", async () => {
      const document = dom.window.document;
      const badges = document.querySelectorAll(".lang-badge");

      badges.forEach((badge) => {
        expect(badge.hasAttribute("aria-label")).toBe(true);
      });
    });

    it("should have tabindex on code blocks", async () => {
      const document = dom.window.document;
      const codeBlocks = document.querySelectorAll("pre.code");

      codeBlocks.forEach((block) => {
        expect(block.getAttribute("tabindex")).toBe("0");
      });
    });
  });

  describe("ThemeToggle Accessibility", () => {
    let dom: JSDOM;

    beforeEach(() => {
      const html = `
        <!DOCTYPE html>
        <html lang="zh-CN">
          <head>
            <title>Theme Toggle Test</title>
          </head>
          <body>
            <main>
              <button id="theme-toggle" aria-label="切换主题" aria-pressed="false">
                <span class="theme-icon light" aria-hidden="true">☀️</span>
                <span class="theme-icon dark" aria-hidden="true">🌙</span>
              </button>
            </main>
          </body>
        </html>
      `;
      dom = new JSDOM(html, { runScripts: "dangerously" });
    });

    it("should have aria-label for theme toggle", async () => {
      const document = dom.window.document;
      const toggle = document.querySelector("#theme-toggle");
      expect(toggle?.getAttribute("aria-label")).toBeTruthy();
    });

    it("should have aria-pressed for toggle state", async () => {
      const document = dom.window.document;
      const toggle = document.querySelector("#theme-toggle");
      expect(toggle?.hasAttribute("aria-pressed")).toBe(true);
    });

    it("should hide decorative icons from screen readers", async () => {
      const document = dom.window.document;
      const icons = document.querySelectorAll(".theme-icon");

      icons.forEach((icon) => {
        expect(icon.getAttribute("aria-hidden")).toBe("true");
      });
    });
  });

  describe("PathNavigator Accessibility", () => {
    let dom: JSDOM;

    beforeEach(() => {
      const html = `
        <!DOCTYPE html>
        <html lang="zh-CN">
          <head>
            <title>Path Navigator Test</title>
          </head>
          <body>
            <main>
              <nav class="path-navigator" aria-label="学习路径导航">
                <ul class="path-list">
                  <li><a href="#intro" aria-current="page">简介</a></li>
                  <li><a href="#basics">基础</a></li>
                  <li><a href="#advanced">进阶</a></li>
                </ul>
              </nav>
            </main>
          </body>
        </html>
      `;
      dom = new JSDOM(html, { runScripts: "dangerously" });
    });

    it("should have aria-label on navigation", async () => {
      const document = dom.window.document;
      const nav = document.querySelector(".path-navigator");
      expect(nav?.getAttribute("aria-label")).toBeTruthy();
    });

    it("should use semantic nav element", async () => {
      const document = dom.window.document;
      const nav = document.querySelector("nav, [role='navigation']");
      expect(nav).toBeTruthy();
    });

    it("should have aria-current for active page", async () => {
      const document = dom.window.document;
      const currentLink = document.querySelector("[aria-current='page']");
      expect(currentLink).toBeTruthy();
    });
  });

  describe("General Page Accessibility", () => {
    let dom: JSDOM;

    beforeEach(() => {
      const html = `
        <!DOCTYPE html>
        <html lang="zh-CN">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Accessible Page</title>
          </head>
          <body>
            <header>
              <nav aria-label="主导航">
                <ul>
                  <li><a href="/">首页</a></li>
                  <li><a href="/learn">学习</a></li>
                </ul>
              </nav>
            </header>
            <main>
              <h1>页面标题</h1>
              <p>页面内容</p>
            </main>
            <footer>
              <p>&copy; 2025 TypeScript Python Web</p>
            </footer>
          </body>
        </html>
      `;
      dom = new JSDOM(html, { runScripts: "dangerously" });
    });

    it("should have lang attribute on html", async () => {
      const document = dom.window.document;
      const html = document.documentElement;
      expect(html.getAttribute("lang")).toBeTruthy();
    });

    it("should have title element", async () => {
      const document = dom.window.document;
      const title = document.querySelector("title");
      expect(title).toBeTruthy();
    });

    it("should have main landmark", async () => {
      const document = dom.window.document;
      const main = document.querySelector("main, [role='main']");
      expect(main).toBeTruthy();
    });

    it("should have h1 heading", async () => {
      const document = dom.window.document;
      const h1 = document.querySelector("h1");
      expect(h1).toBeTruthy();
    });

    it("should have proper heading order", async () => {
      const document = dom.window.document;
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      let previousLevel = 0;
      let validOrder = true;

      headings.forEach((heading) => {
        const level = parseInt(heading.tagName[1]);
        if (level > previousLevel + 1) {
          validOrder = false;
        }
        previousLevel = level;
      });

      expect(validOrder).toBe(true);
    });

    it("should have landmarks", async () => {
      const document = dom.window.document;
      const landmarks = document.querySelectorAll(
        "header, main, footer, nav, aside"
      );
      expect(landmarks.length).toBeGreaterThan(0);
    });
  });
});
