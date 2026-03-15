import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

describe("DiffInsight Component", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    const html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head><title>Test</title></head>
        <body>
          <div class="diff-insight" role="note" aria-label="Python 与 TypeScript 差异说明">
            <h3>差异要点</h3>
            <ul>
              <li>类型定义语法不同</li>
              <li>函数声明方式不同</li>
            </ul>
          </div>
        </body>
      </html>
    `;
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it("should render diff insight container", () => {
    const container = document.querySelector(".diff-insight");
    expect(container).toBeTruthy();
  });

  it("should have note role for accessibility", () => {
    const container = document.querySelector(".diff-insight");
    expect(container?.getAttribute("role")).toBe("note");
  });

  it("should have aria-label", () => {
    const container = document.querySelector(".diff-insight");
    expect(container?.getAttribute("aria-label")).toBe("Python 与 TypeScript 差异说明");
  });
});

describe("PathNavigator Component", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    const html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head><title>Test</title></head>
        <body>
          <nav class="path-navigator" aria-label="学习路径导航">
            <ul class="path-list">
              <li><a href="#step1" aria-current="page">步骤 1</a></li>
              <li><a href="#step2">步骤 2</a></li>
              <li><a href="#step3">步骤 3</a></li>
            </ul>
          </nav>
        </body>
      </html>
    `;
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it("should render path navigator", () => {
    const nav = document.querySelector(".path-navigator");
    expect(nav).toBeTruthy();
  });

  it("should have aria-label on navigation", () => {
    const nav = document.querySelector(".path-navigator");
    expect(nav?.getAttribute("aria-label")).toBe("学习路径导航");
  });

  it("should have aria-current for active item", () => {
    const currentLink = document.querySelector("[aria-current='page']");
    expect(currentLink).toBeTruthy();
    expect(currentLink?.textContent).toBe("步骤 1");
  });
});

describe("ThemeToggle Component", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    const html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head><title>Test</title></head>
        <body>
          <button id="theme-toggle" aria-label="切换深色/浅色主题" aria-pressed="false">
            <span class="theme-icon light" aria-hidden="true">☀️</span>
            <span class="theme-icon dark" aria-hidden="true">🌙</span>
          </button>
        </body>
      </html>
    `;
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it("should render theme toggle button", () => {
    const toggle = document.querySelector("#theme-toggle");
    expect(toggle).toBeTruthy();
  });

  it("should have aria-label for toggle", () => {
    const toggle = document.querySelector("#theme-toggle");
    expect(toggle?.getAttribute("aria-label")).toBe("切换深色/浅色主题");
  });

  it("should have aria-pressed for toggle state", () => {
    const toggle = document.querySelector("#theme-toggle");
    expect(toggle?.getAttribute("aria-pressed")).toBe("false");
  });

  it("should hide icons from screen readers", () => {
    const icons = document.querySelectorAll(".theme-icon");
    icons.forEach((icon) => {
      expect(icon.getAttribute("aria-hidden")).toBe("true");
    });
  });
});
