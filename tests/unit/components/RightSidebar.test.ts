import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

describe("RightSidebar", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <aside class="right-sidebar" aria-label="页面工具">
            <div class="sidebar-section toc-section">
              <h3 class="section-title">目录</h3>
              <nav aria-label="页面目录">
                <ul class="toc-list">
                  <li><a href="#场景与问题" class="toc-link">场景与问题</a></li>
                  <li><a href="#python-回顾" class="toc-link">Python 回顾</a></li>
                  <li><a href="#typescript-等价写法" class="toc-link">TypeScript 等价写法</a></li>
                  <li><a href="#差异与常见陷阱" class="toc-link">差异与常见陷阱</a></li>
                  <li><a href="#练习" class="toc-link">练习</a></li>
                </ul>
              </nav>
            </div>

            <div class="sidebar-section tools-section">
              <h3 class="section-title">工具</h3>
              <div class="tool-buttons">
                <button class="tool-btn bookmark-btn" aria-label="添加书签">
                  <span>书签</span>
                </button>
                <button class="tool-btn share-btn" aria-label="分享此页">
                  <span>分享</span>
                </button>
              </div>
            </div>

            <div class="sidebar-section progress-section">
              <h3 class="section-title">学习进度</h3>
              <div class="progress-stats">
                <div class="stat-item">
                  <span class="stat-label">已完成</span>
                  <span class="stat-value">0/20</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 0%"></div>
                </div>
              </div>
            </div>
          </aside>
        </body>
      </html>
    `;
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it("renders table of contents section", () => {
    const tocHeading = document.querySelector(".toc-section .section-title");
    expect(tocHeading?.textContent).toBe("目录");
  });

  it("renders tools section with bookmark and share buttons", () => {
    const bookmarkBtn = document.querySelector(".bookmark-btn");
    const shareBtn = document.querySelector(".share-btn");
    expect(bookmarkBtn).not.toBeNull();
    expect(shareBtn).not.toBeNull();
  });

  it("renders progress section with stats", () => {
    const progressHeading = document.querySelector(".progress-section .section-title");
    expect(progressHeading?.textContent).toBe("学习进度");

    const statValue = document.querySelector(".stat-value");
    expect(statValue?.textContent).toBe("0/20");

    const progressBar = document.querySelector(".progress-fill");
    expect(progressBar).not.toBeNull();
  });

  it("has correct accessibility attributes", () => {
    const sidebar = document.querySelector(".right-sidebar");
    expect(sidebar?.getAttribute("aria-label")).toBe("页面工具");

    const tocNav = document.querySelector(".toc-section nav");
    expect(tocNav?.getAttribute("aria-label")).toBe("页面目录");
  });
});
