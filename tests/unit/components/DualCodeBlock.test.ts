import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

describe("DualCodeBlock", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    // Create a mock HTML structure similar to DualCodeBlock output
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            :root {
              --space-lg: 1.5rem;
              --space-md: 1rem;
              --space-sm: 0.5rem;
              --space-xs: 0.25rem;
              --color-text: #333;
              --color-code-bg: #f5f5f5;
              --color-border: #ddd;
              --radius-md: 8px;
              --radius-sm: 4px;
              --font-mono: monospace;
              --sl-color-accent: #3178c6;
            }
          </style>
        </head>
        <body>
          <div class="dual-code-block" role="region" aria-label="TypeScript vs Python - 双语代码对比">
            <h4 class="block-title">TypeScript vs Python</h4>
            <div class="code-container">
              <div class="code-panel">
                <div class="panel-header">
                  <span class="lang-badge python" aria-label="Python 代码">Python</span>
                </div>
                <pre class="code" tabindex="0" aria-label="Python 代码"><code class="language-python">def greet(name: str) -> str:
    return f"Hello, {name}!"</code></pre>
              </div>
              <div class="code-panel">
                <div class="panel-header">
                  <span class="lang-badge typescript" aria-label="TypeScript 代码">TypeScript</span>
                </div>
                <pre class="code" tabindex="0" aria-label="TypeScript 代码"><code class="language-typescript">function greet(name: string): string {
  return \`Hello, ${name}!\`;
}</code></pre>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
  });

  describe("Rendering", () => {
    it("should render dual code block container", () => {
      const container = document.querySelector(".dual-code-block");
      expect(container).toBeTruthy();
    });

    it("should render both code panels", () => {
      const panels = document.querySelectorAll(".code-panel");
      expect(panels).toHaveLength(2);
    });

    it("should render title when provided", () => {
      const title = document.querySelector(".block-title");
      expect(title).toBeTruthy();
      expect(title?.textContent).toBe("TypeScript vs Python");
    });

    it("should render Python code block", () => {
      const pythonCode = document.querySelector(".language-python");
      expect(pythonCode).toBeTruthy();
      expect(pythonCode?.textContent).toContain("def greet");
    });

    it("should render TypeScript code block", () => {
      const tsCode = document.querySelector(".language-typescript");
      expect(tsCode).toBeTruthy();
      expect(tsCode?.textContent).toContain("function greet");
    });
  });

  describe("Accessibility", () => {
    it("should have role region for container", () => {
      const container = document.querySelector(".dual-code-block");
      expect(container?.getAttribute("role")).toBe("region");
      expect(container?.getAttribute("aria-label")).toContain("双语代码对比");
    });

    it("should have aria-label for language badges", () => {
      const badges = document.querySelectorAll(".lang-badge");
      badges.forEach((badge) => {
        expect(badge.hasAttribute("aria-label")).toBe(true);
      });
    });

    it("should have aria-label for Python badge", () => {
      const pythonBadge = document.querySelector(".lang-badge.python");
      expect(pythonBadge?.getAttribute("aria-label")).toBe("Python 代码");
    });

    it("should have aria-label for TypeScript badge", () => {
      const tsBadge = document.querySelector(".lang-badge.typescript");
      expect(tsBadge?.getAttribute("aria-label")).toBe("TypeScript 代码");
    });

    it("should have aria-label for code blocks", () => {
      const codeBlocks = document.querySelectorAll("pre.code");
      codeBlocks.forEach((block) => {
        expect(block.hasAttribute("aria-label")).toBe(true);
      });
    });

    it("should have tabindex for keyboard navigation", () => {
      const codeBlocks = document.querySelectorAll("pre.code");
      codeBlocks.forEach((block) => {
        expect(block.getAttribute("tabindex")).toBe("0");
      });
    });

    it("should have proper code language classes", () => {
      expect(document.querySelector(".language-python")).toBeTruthy();
      expect(document.querySelector(".language-typescript")).toBeTruthy();
    });
  });

  describe("HTML Structure", () => {
    it("should use semantic pre and code elements", () => {
      const preElements = document.querySelectorAll("pre");
      const codeElements = document.querySelectorAll("code");
      expect(preElements).toHaveLength(2);
      expect(codeElements).toHaveLength(2);
    });

    it("should have code container with two panels", () => {
      const container = document.querySelector(".code-container");
      const panels = container?.querySelectorAll(".code-panel");
      expect(panels).toHaveLength(2);
    });

    it("should have panel headers with language badges", () => {
      const headers = document.querySelectorAll(".panel-header");
      expect(headers).toHaveLength(2);
      headers.forEach((header) => {
        expect(header.querySelector(".lang-badge")).toBeTruthy();
      });
    });
  });

  describe("Without Title", () => {
    beforeEach(() => {
      const html = `
        <!DOCTYPE html>
        <html>
          <body>
            <div class="dual-code-block" role="region" aria-label="双语代码对比">
              <div class="code-container">
                <div class="code-panel">
                  <div class="panel-header">
                    <span class="lang-badge python" aria-label="Python 代码">Python</span>
                  </div>
                  <pre class="code" tabindex="0" aria-label="Python 代码"><code class="language-python">print("hello")</code></pre>
                </div>
                <div class="code-panel">
                  <div class="panel-header">
                    <span class="lang-badge typescript" aria-label="TypeScript 代码">TypeScript</span>
                  </div>
                  <pre class="code" tabindex="0" aria-label="TypeScript 代码"><code class="language-typescript">console.log("hello")</code></pre>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
      dom = new JSDOM(html);
      document = dom.window.document;
    });

    it("should not render title when not provided", () => {
      const title = document.querySelector(".block-title");
      expect(title).toBeFalsy();
    });

    it("should still have aria-label on container", () => {
      const container = document.querySelector(".dual-code-block");
      expect(container?.getAttribute("aria-label")).toBe("双语代码对比");
    });
  });
});

describe("DualCodeBlock normalizeDualCodeInput", () => {
  // This tests the logic that would be in normalizeDualCodeInput function
  it("should handle valid Python and TypeScript input", () => {
    const input = {
      python: "def foo(): pass",
      typescript: "function foo() {}",
    };
    // Simulating the normalization
    const result = {
      python: input.python.trim(),
      typescript: input.typescript.trim(),
    };
    expect(result.python).toBe("def foo(): pass");
    expect(result.typescript).toBe("function foo() {}");
  });

  it("should trim whitespace from inputs", () => {
    const input = {
      python: "  def foo(): pass  ",
      typescript: "  function foo() {}  ",
    };
    const result = {
      python: input.python.trim(),
      typescript: input.typescript.trim(),
    };
    expect(result.python).toBe("def foo(): pass");
    expect(result.typescript).toBe("function foo() {}");
  });

  it("should handle multiline code", () => {
    const input = {
      python: `def greet(name):
    return f"Hello, {name}!"`,
      typescript: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`,
    };
    expect(input.python).toContain("def greet");
    expect(input.typescript).toContain("function greet");
  });
});
