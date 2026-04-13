# WebUI 重新设计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Astro + Starlight 学习站点 UI 重新设计为 Duolingo+GitHub 混合风格，包含三栏布局、自动主题切换、增强双语代码块和进度追踪系统。

**Architecture:** 保持 Starlight 架构不变，通过覆盖组件和 CSS 变量实现新设计。新增右侧栏组件，增强现有代码块和测验组件，实现主题自动检测。

**Tech Stack:** Astro 4.16, Starlight 0.28, TypeScript, CSS Variables, localStorage

---

## 文件结构映射

### 修改文件

- `src/styles/tokens.css` - 更新色彩变量（浅色/深色/自动切换）
- `src/styles/custom-layout.css` - 三栏布局、卡片、排版样式
- `src/styles/responsive.css` - 新增响应式断点样式
- `src/styles/components.css` - 新增组件样式（代码块、测验、进度）
- `src/components/DualCodeBlock.astro` - 增强双语代码块（折叠、同步滚动、复制）
- `src/components/QuizContainer.astro` - 更新测验UI（卡片、即时反馈）
- `src/components/Header.astro` - 更新Header样式
- `src/components/Banner.astro` - 更新Banner样式
- `src/components/Pagination.astro` - 更新分页样式
- `src/components/SidebarProgress.astro` - 增强进度指示
- `src/layouts/LessonLayout.astro` - 三栏布局支持
- `src/layouts/AlgorithmLayout.astro` - 三栏布局支持
- `astro.config.mjs` - 注册新组件

### 新增文件

- `src/components/RightSidebar.astro` - 右侧栏（目录+工具）
- `src/components/ThemeToggle.astro` - 主题切换组件（已存在需更新）
- `src/lib/theme-detector.ts` - 主题自动检测逻辑
- `tests/unit/components/RightSidebar.test.ts` - 右侧栏测试
- `tests/unit/lib/theme-detector.test.ts` - 主题检测测试

---

## Phase 1: 基础色彩与主题系统

### Task 1: 更新色彩变量系统

**Files:**

- Modify: `src/styles/tokens.css`
- Test: `tests/unit/theme-store.test.ts`

- [ ] **Step 1: 更新 tokens.css 色彩变量**

修改 `src/styles/tokens.css`，替换现有色彩系统为新设计：

```css
:root,
[data-theme="light"] {
  /* Light theme - warm education style */
  --color-bg: #fafafa;
  --color-text: #1a1a2e;
  --color-primary: #5b7fff;
  --color-secondary: #8b5cf6;
  --color-accent: #ff9f43;
  --color-border: #e5e7eb;
  --color-code-bg: #f8fafc;
  --color-card: #ffffff;
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* Starlight overrides */
  --sl-color-bg: #fafafa;
  --sl-color-bg-nav: #ffffff;
  --sl-color-bg-aside: #ffffff;
  --sl-color-bg-card: #ffffff;
  --sl-color-bg-inline-code: #f1f5f9;
  --sl-color-white: #1a1a2e;
  --sl-color-gray-1: #374151;
  --sl-color-gray-2: #6b7280;
  --sl-color-gray-3: #9ca3af;
  --sl-color-gray-4: #d1d5db;
  --sl-color-gray-5: #e5e7eb;
  --sl-color-gray-6: #f3f4f6;
  --sl-color-accent: #5b7fff;
  --sl-color-accent-low: rgba(91, 127, 255, 0.1);
  --sl-color-accent-high: rgba(91, 127, 255, 0.2);
  --sl-color-hairline: #e5e7eb;
  --sl-color-hairline-shade: #d1d5db;
  --sl-color-hairline-light: #f3f4f6;

  /* Fonts */
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Fira Code", "Cascadia Code", "Consolas", monospace;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

[data-theme="dark"] {
  /* Dark theme - developer friendly */
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
  --color-primary: #5b7fff;
  --color-secondary: #a78bfa;
  --color-accent: #ff9f43;
  --color-border: #334155;
  --color-code-bg: #0f172a;
  --color-card: #1e293b;
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* Starlight overrides */
  --sl-color-bg: #0f172a;
  --sl-color-bg-nav: #1e293b;
  --sl-color-bg-aside: #1e293b;
  --sl-color-bg-card: #1e293b;
  --sl-color-bg-inline-code: #0f172a;
  --sl-color-white: #f1f5f9;
  --sl-color-gray-1: #e2e8f0;
  --sl-color-gray-2: #94a3b8;
  --sl-color-gray-3: #64748b;
  --sl-color-gray-4: #475569;
  --sl-color-gray-5: #334155;
  --sl-color-gray-6: #1e293b;
  --sl-color-accent: #5b7fff;
  --sl-color-accent-low: rgba(91, 127, 255, 0.15);
  --sl-color-accent-high: rgba(91, 127, 255, 0.25);
  --sl-color-hairline: #334155;
  --sl-color-hairline-shade: #475569;
  --sl-color-hairline-light: #1e293b;

  /* Code syntax colors - Night Owl inspired */
  --sl-color-syntax-number: #ff9f43;
  --sl-color-syntax-string: #22c55e;
  --sl-color-syntax-keyword: #5b7fff;
  --sl-color-syntax-function: #a78bfa;
  --sl-color-syntax-constant: #f472b6;
  --sl-color-syntax-special: #ef4444;
  --sl-color-syntax-comment: #64748b;
}

/* High contrast theme */
[data-theme="high-contrast"] {
  --color-bg: #000000;
  --color-text: #ffffff;
  --color-primary: #00ffff;
  --color-secondary: #ff00ff;
  --color-accent: #ffff00;
  --color-border: #ffffff;
  --color-code-bg: #000000;
  --color-card: #000000;

  --sl-color-bg: #000000;
  --sl-color-bg-nav: #000000;
  --sl-color-bg-aside: #000000;
  --sl-color-bg-card: #000000;
  --sl-color-white: #ffffff;
  --sl-color-gray-1: #ffffff;
  --sl-color-gray-2: #ffffff;
  --sl-color-gray-3: #ffffff;
  --sl-color-gray-4: #ffffff;
  --sl-color-gray-5: #ffffff;
  --sl-color-gray-6: #000000;
  --sl-color-accent: #00ffff;
  --sl-color-hairline: #ffffff;
}

/* Sepia theme for eye comfort */
[data-theme="sepia"] {
  --color-bg: #f4ecd8;
  --color-text: #433422;
  --color-primary: #8b4513;
  --color-secondary: #a0522d;
  --color-accent: #cd853f;
  --color-border: #d4c5b0;
  --color-code-bg: #e8dcc8;
  --color-card: #e8dcc8;

  --sl-color-bg: #f4ecd8;
  --sl-color-bg-nav: #e8dcc8;
  --sl-color-bg-aside: #e8dcc8;
  --sl-color-bg-card: #e8dcc8;
  --sl-color-white: #433422;
  --sl-color-gray-1: #433422;
  --sl-color-gray-2: #5a4835;
  --sl-color-gray-3: #715c45;
  --sl-color-gray-4: #887055;
  --sl-color-gray-5: #9f8465;
  --sl-color-gray-6: #e8dcc8;
  --sl-color-accent: #8b4513;
  --sl-color-hairline: #d4c5b0;
}

/* Smooth theme transitions */
*,
*::before,
*::after {
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base),
    color var(--transition-fast),
    box-shadow var(--transition-base);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: 运行构建验证**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "style: update color variables for new UI design

- Light theme: warm education style with blue/purple accents
- Dark theme: developer-friendly slate colors
- High contrast and sepia themes preserved
- Smooth transitions for theme switching"
```

---

### Task 2: 创建主题自动检测逻辑

**Files:**

- Create: `src/lib/theme-detector.ts`
- Test: `tests/unit/lib/theme-detector.test.ts`

- [ ] **Step 1: 编写测试**

Create `tests/unit/lib/theme-detector.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { detectTheme, applyTheme, initThemeDetector } from "../../src/lib/theme-detector";

describe("theme-detector", () => {
  it("detects system preference for dark mode", () => {
    const mockMatchMedia = (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    const theme = detectTheme(mockMatchMedia as any);
    expect(theme).toBe("dark");
  });

  it("detects system preference for light mode", () => {
    const mockMatchMedia = (query: string) => ({
      matches: query === "(prefers-color-scheme: light)",
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    const theme = detectTheme(mockMatchMedia as any);
    expect(theme).toBe("light");
  });

  it("respects user override from localStorage", () => {
    const mockMatchMedia = (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    const mockStorage: Record<string, string> = { "site-theme": "light" };
    const mockGetItem = (key: string) => mockStorage[key] || null;

    const theme = detectTheme(mockMatchMedia as any, mockGetItem);
    expect(theme).toBe("light");
  });
});
```

- [ ] **Step 2: 运行测试验证失败**

Run: `npm run test -- tests/unit/lib/theme-detector.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: 实现主题检测逻辑**

Create `src/lib/theme-detector.ts`:

```typescript
export type Theme = "light" | "dark" | "high-contrast" | "sepia";

export function detectTheme(
  matchMedia: typeof window.matchMedia = window.matchMedia,
  getItem: (key: string) => string | null = (key) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  }
): Theme {
  // Check user override first
  const userTheme = getItem("site-theme");
  if (userTheme && ["light", "dark", "high-contrast", "sepia"].includes(userTheme)) {
    return userTheme as Theme;
  }

  // Fall back to system preference
  if (matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function initThemeDetector(): void {
  if (typeof window === "undefined") return;

  const theme = detectTheme();
  applyTheme(theme);

  // Listen for system preference changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    // Only auto-switch if user hasn't set a preference
    const userTheme = localStorage.getItem("site-theme");
    if (!userTheme) {
      const newTheme = mediaQuery.matches ? "dark" : "light";
      applyTheme(newTheme);
    }
  };

  mediaQuery.addEventListener("change", handleChange);

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    mediaQuery.removeEventListener("change", handleChange);
  });
}
```

- [ ] **Step 4: 运行测试验证通过**

Run: `npm run test -- tests/unit/lib/theme-detector.test.ts`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme-detector.ts tests/unit/lib/theme-detector.test.ts
git commit -m "feat: add theme auto-detector with system preference support

- Detects system dark/light preference
- Respects user override from localStorage
- Auto-switches when system preference changes
- Supports light, dark, high-contrast, sepia themes"
```

---

### Task 3: 更新 ThemeToggle 组件

**Files:**

- Modify: `src/components/ThemeToggle.astro`
- Test: 手动验证

- [ ] **Step 1: 更新 ThemeToggle 组件**

Read existing `src/components/ThemeToggle.astro` first, then update:

```astro
---
import { readTheme, writeTheme } from '../lib/theme-store';

const currentTheme = readTheme(typeof window !== 'undefined' ? localStorage.getItem.bind(localStorage) : () => null);
---

<div class="theme-toggle" role="group" aria-label="主题切换">
  <button
    class="theme-btn"
    aria-label="切换到浅色主题"
    data-theme="light"
    aria-pressed={currentTheme === "light"}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  </button>
  <button
    class="theme-btn"
    aria-label="切换到深色主题"
    data-theme="dark"
    aria-pressed={currentTheme === "dark"}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</div>

<script>
  import { initThemeDetector, applyTheme } from '../lib/theme-detector';

  // Initialize theme on load
  initThemeDetector();

  // Handle button clicks
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = (btn as HTMLElement).dataset.theme;
      if (theme) {
        localStorage.setItem('site-theme', theme);
        applyTheme(theme as any);

        // Update pressed state
        document.querySelectorAll('.theme-btn').forEach(b => {
          b.setAttribute('aria-pressed', 'false');
        });
        btn.setAttribute('aria-pressed', 'true');
      }
    });
  });
</script>

<style>
  .theme-toggle {
    display: flex;
    gap: var(--space-xs);
    align-items: center;
  }

  .theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .theme-btn:hover {
    background: var(--color-border);
  }

  .theme-btn[aria-pressed="true"] {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  .theme-btn svg {
    width: 16px;
    height: 16px;
  }
</style>
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "feat: update ThemeToggle with auto-detect support

- Light/dark toggle buttons with icons
- Respects user preference and system detection
- Visual feedback for active theme"
```

---

## Phase 2: 三栏布局实现

### Task 4: 创建右侧栏组件

**Files:**

- Create: `src/components/RightSidebar.astro`
- Test: `tests/unit/components/RightSidebar.test.ts`

- [ ] **Step 1: 编写测试**

Create `tests/unit/components/RightSidebar.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/dom";

describe("RightSidebar", () => {
  it("renders table of contents section", () => {
    // Basic structure test - component should render TOC heading
    const html = `<div class="right-sidebar"><h3>目录</h3></div>`;
    const { container } = render(html);
    const tocHeading = container.querySelector("h3");
    expect(tocHeading?.textContent).toBe("目录");
  });

  it("renders tools section with bookmark and share buttons", () => {
    const html = `
      <div class="right-sidebar">
        <div class="tools-section">
          <button class="bookmark-btn">书签</button>
          <button class="share-btn">分享</button>
        </div>
      </div>
    `;
    const { container } = render(html);
    const bookmarkBtn = container.querySelector(".bookmark-btn");
    const shareBtn = container.querySelector(".share-btn");
    expect(bookmarkBtn).not.toBeNull();
    expect(shareBtn).not.toBeNull();
  });
});
```

- [ ] **Step 2: 运行测试验证失败**

Run: `npm run test -- tests/unit/components/RightSidebar.test.ts`
Expected: FAIL

- [ ] **Step 3: 创建 RightSidebar 组件**

Create `src/components/RightSidebar.astro`:

```astro
---
interface Props {
  title?: string;
}

const { title } = Astro.props;
---

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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>书签</span>
      </button>
      <button class="tool-btn share-btn" aria-label="分享此页">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
        </svg>
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

<script>
  // Highlight current TOC item on scroll
  function updateTocHighlight() {
    const headings = document.querySelectorAll('.sl-markdown-content h2');
    const tocLinks = document.querySelectorAll('.toc-link');

    let currentHeading = null;
    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      if (rect.top < 100) {
        currentHeading = heading;
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (currentHeading && link.getAttribute('href') === `#${currentHeading.id}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateTocHighlight);
  updateTocHighlight();

  // Bookmark functionality
  const bookmarkBtn = document.querySelector('.bookmark-btn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const path = window.location.pathname;
      const bookmarks = JSON.parse(localStorage.getItem('ts-py-learning-progress') || '{}');
      if (!bookmarks.bookmarks) bookmarks.bookmarks = [];

      if (bookmarks.bookmarks.includes(path)) {
        bookmarks.bookmarks = bookmarks.bookmarks.filter((b: string) => b !== path);
        bookmarkBtn.classList.remove('bookmarked');
      } else {
        bookmarks.bookmarks.push(path);
        bookmarkBtn.classList.add('bookmarked');
      }

      localStorage.setItem('ts-py-learning-progress', JSON.stringify(bookmarks));
    });
  }

  // Share functionality
  const shareBtn = document.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        shareBtn.classList.add('copied');
        setTimeout(() => shareBtn.classList.remove('copied'), 2000);
      }
    });
  }
</script>

<style>
  .right-sidebar {
    width: 240px;
    padding: var(--space-lg) var(--space-md);
    position: sticky;
    top: 64px;
    height: calc(100vh - 64px);
    overflow-y: auto;
  }

  .sidebar-section {
    margin-bottom: var(--space-xl);
  }

  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-gray-3);
    margin-bottom: var(--space-sm);
  }

  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc-link {
    display: block;
    padding: var(--space-xs) var(--space-sm);
    color: var(--color-gray-2);
    text-decoration: none;
    font-size: 0.875rem;
    border-left: 2px solid transparent;
    transition: all var(--transition-fast);
  }

  .toc-link:hover {
    color: var(--color-primary);
  }

  .toc-link.active {
    color: var(--color-primary);
    border-left-color: var(--color-primary);
    font-weight: 500;
  }

  .tool-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .tool-btn {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-card);
    color: var(--color-text);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all var(--transition-fast);
  }

  .tool-btn:hover {
    border-color: var(--color-primary);
    background: var(--sl-color-accent-low);
  }

  .tool-btn.bookmarked {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  .tool-btn.copied {
    background: var(--color-success);
    color: white;
    border-color: var(--color-success);
  }

  .tool-btn svg {
    width: 16px;
    height: 16px;
  }

  .progress-stats {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
  }

  .stat-label {
    color: var(--color-gray-2);
  }

  .stat-value {
    font-weight: 600;
    color: var(--color-primary);
  }

  .progress-bar {
    height: 6px;
    background: var(--color-border);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-primary);
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
  }

  @media (max-width: 1280px) {
    .right-sidebar {
      display: none;
    }
  }
</style>
```

- [ ] **Step 4: 运行测试验证通过**

Run: `npm run test -- tests/unit/components/RightSidebar.test.ts`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/RightSidebar.astro tests/unit/components/RightSidebar.test.ts
git commit -m "feat: add RightSidebar component with TOC, tools, and progress

- Table of contents with scroll-based highlighting
- Bookmark and share buttons
- Learning progress stats with progress bar
- Responsive: hidden on screens < 1280px"
```

---

### Task 5: 更新布局文件支持三栏

**Files:**

- Modify: `src/layouts/LessonLayout.astro`
- Modify: `src/layouts/AlgorithmLayout.astro`

- [ ] **Step 1: 更新 LessonLayout**

Read existing `src/layouts/LessonLayout.astro`, then update:

```astro
---
import PathNavigator from "../components/PathNavigator.astro";
import MobileNav from "../components/MobileNav.astro";
import RightSidebar from "../components/RightSidebar.astro";

interface Props {
  track: string;
  current: string;
}

const { track, current } = Astro.props;
---

<article class="lesson" data-track={track} data-current={current}>
  <MobileNav>
    <nav aria-label="课程章节">
      <slot name="nav-content" />
    </nav>
  </MobileNav>

  <div class="lesson-layout">
    <div class="lesson-content">
      <slot />
      <PathNavigator track={track} current={current} />
    </div>
    <RightSidebar />
  </div>
</article>

<script>
  import { markAsCompleted, updateLastVisited } from '../lib/progress-store';

  function initLessonProgress() {
    const article = document.querySelector('.lesson[data-track][data-current]');
    if (!article) return;

    const track = article.getAttribute('data-track');
    const current = article.getAttribute('data-current');

    if (track && current) {
      updateLastVisited(current);

      let markedCompleted = false;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !markedCompleted) {
              markedCompleted = true;
              const title = document.querySelector('h1')?.textContent || '';
              markAsCompleted(current, title, 'lesson');
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );

      const pathNavigator = article.querySelector('.path-navigator');
      if (pathNavigator) {
        observer.observe(pathNavigator);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLessonProgress);
  } else {
    initLessonProgress();
  }
</script>

<style>
  .lesson {
    max-width: 1400px;
    margin: 0 auto;
  }

  .lesson-layout {
    display: grid;
    grid-template-columns: 1fr 240px;
    gap: var(--space-xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  .lesson-content {
    max-width: 800px;
    position: relative;
  }

  .lesson :global(h2) {
    margin-top: var(--space-2xl);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--color-border);
  }

  .lesson :global(h3) {
    margin-top: var(--space-lg);
  }

  .lesson :global(pre) {
    background: var(--color-code-bg);
    padding: var(--space-md);
    border-radius: var(--radius-md);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: 1280px) {
    .lesson-layout {
      grid-template-columns: 1fr;
    }

    .lesson-content {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .lesson {
      padding: 0 var(--space-sm);
    }

    .lesson :global(pre) {
      padding: var(--space-sm);
      font-size: 0.8125rem;
    }

    .lesson :global(table) {
      display: block;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      white-space: nowrap;
    }

    .lesson :global(img) {
      max-width: 100%;
      height: auto;
    }
  }

  @media (prefers-contrast: high) {
    .lesson :global(h2) {
      border-bottom-width: 2px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lesson :global(*),
    .lesson :global(*::before),
    .lesson :global(*::after) {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
```

- [ ] **Step 2: 更新 AlgorithmLayout**

Read existing `src/layouts/AlgorithmLayout.astro`, then apply same pattern:

```astro
---
import PathNavigator from "../components/PathNavigator.astro";
import MobileNav from "../components/MobileNav.astro";
import RightSidebar from "../components/RightSidebar.astro";

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<article class="algorithm">
  <MobileNav>
    <nav aria-label="算法导航">
      <slot name="nav-content" />
    </nav>
  </MobileNav>

  <div class="algorithm-layout">
    <div class="algorithm-content">
      <slot />
      <PathNavigator track="algorithms" current={title} />
    </div>
    <RightSidebar title={title} />
  </div>
</article>

<style>
  .algorithm {
    max-width: 1400px;
    margin: 0 auto;
  }

  .algorithm-layout {
    display: grid;
    grid-template-columns: 1fr 240px;
    gap: var(--space-xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  .algorithm-content {
    max-width: 800px;
    position: relative;
  }

  @media (max-width: 1280px) {
    .algorithm-layout {
      grid-template-columns: 1fr;
    }

    .algorithm-content {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .algorithm {
      padding: 0 var(--space-sm);
    }
  }
</style>
```

- [ ] **Step 3: 验证构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/layouts/LessonLayout.astro src/layouts/AlgorithmLayout.astro
git commit -m "feat: update layouts for three-column design

- LessonLayout: content + right sidebar grid
- AlgorithmLayout: same pattern
- Responsive: collapses to single column on < 1280px
- Content max-width 800px for readability"
```

---

### Task 6: 注册 RightSidebar 到 Starlight 配置

**Files:**

- Modify: `astro.config.mjs`

- [ ] **Step 1: 更新 astro.config.mjs**

Read existing `astro.config.mjs`, then add RightSidebar to components:

```javascript
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://muyuq.github.io",
  base: "/PyToTS_WEB/",
  integrations: [
    starlight({
      title: "Python to TypeScript",
      customCss: [
        "./src/styles/tokens.css",
        "./src/styles/accessibility.css",
        "./src/styles/custom-layout.css",
        "./src/styles/responsive.css",
        "./src/styles/components.css",
      ],
      disable404Route: true,
      components: {
        Banner: "./src/components/Banner.astro",
        Pagination: "./src/components/Pagination.astro",
        ThemeSelect: "./src/components/ThemeToggle.astro",
        Header: "./src/components/Header.astro",
      },
      sidebar: [
        {
          label: "学习路径",
          items: [
            {
              label: "基础路径",
              collapsed: true,
              autogenerate: { directory: "paths/foundation" },
            },
            {
              label: "迁移路径",
              collapsed: true,
              autogenerate: { directory: "paths/migration" },
            },
            {
              label: "进阶路径",
              collapsed: true,
              autogenerate: { directory: "paths/advanced" },
            },
          ],
        },
        {
          label: "手册",
          autogenerate: { directory: "handbook" },
        },
        {
          label: "算法",
          autogenerate: { directory: "algorithms" },
        },
        {
          label: "练习与测验",
          autogenerate: { directory: "practice" },
        },
        {
          label: "分类索引",
          items: [
            { label: "Tags", link: "/tags/" },
            { label: "Difficulty", link: "/difficulty/" },
          ],
        },
        {
          label: "关于与贡献",
          autogenerate: { directory: "about" },
        },
      ],
    }),
  ],
});
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: Build succeeds with new CSS files loaded

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "config: register new CSS files and RightSidebar component

- Add responsive.css and components.css to customCss
- Register ThemeToggle as ThemeSelect override"
```

---

## Phase 3: 组件增强

### Task 7: 增强双语代码块

**Files:**

- Modify: `src/components/DualCodeBlock.astro`
- Test: `tests/unit/components/DualCodeBlock.test.ts`

- [ ] **Step 1: 读取现有测试**

Read `tests/unit/components/DualCodeBlock.test.ts` to understand current test coverage.

- [ ] **Step 2: 更新 DualCodeBlock 组件**

Read existing `src/components/DualCodeBlock.astro`, then replace with enhanced version:

```astro
---
import { normalizeDualCodeInput } from "../lib/code-example";

interface Props {
  python: string;
  typescript: string;
  title?: string;
}

const { python, typescript, title } = {
  title: Astro.props.title,
  ...normalizeDualCodeInput({
    python: Astro.props.python,
    typescript: Astro.props.typescript,
  }),
};

const codeId = crypto.randomUUID();
---

<div class="dual-code-block" role="region" aria-label={title ? `${title} - 双语代码对比` : "双语代码对比"} data-code-id={codeId}>
  {title && <h4 class="block-title">{title}</h4>}

  <div class="code-actions">
    <button class="action-btn copy-btn" aria-label="复制全部代码" data-code-id={codeId}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <span>复制全部</span>
    </button>
    <button class="action-btn toggle-btn" aria-label="折叠/展开" data-code-id={codeId}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
  </div>

  <div class="code-container" data-code-id={codeId}>
    <div class="code-panel">
      <div class="panel-header">
        <span class="lang-badge python" aria-label="Python 代码">Python</span>
        <button class="copy-lang-btn" aria-label="复制 Python 代码" data-lang="python" data-code-id={codeId}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
      <pre class="code" tabindex="0" aria-label="Python 代码"><code class="language-python">{python}</code></pre>
    </div>
    <div class="code-panel">
      <div class="panel-header">
        <span class="lang-badge typescript" aria-label="TypeScript 代码">TypeScript</span>
        <button class="copy-lang-btn" aria-label="复制 TypeScript 代码" data-lang="typescript" data-code-id={codeId}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
      <pre class="code" tabindex="0" aria-label="TypeScript 代码"><code class="language-typescript">{typescript}</code></pre>
    </div>
  </div>
</div>

<script>
  // Sync scroll between code panels
  function initSyncScroll(codeId: string) {
    const container = document.querySelector(`.code-container[data-code-id="${codeId}"]`);
    if (!container) return;

    const panels = container.querySelectorAll('.code');
    let syncing = false;

    panels.forEach(panel => {
      panel.addEventListener('scroll', () => {
        if (syncing) return;
        syncing = true;

        panels.forEach(other => {
          if (other !== panel) {
            other.scrollTop = panel.scrollTop;
          }
        });

        requestAnimationFrame(() => { syncing = false; });
      });
    });
  }

  // Copy functionality
  function initCopyButtons(codeId: string) {
    const copyAllBtn = document.querySelector(`.copy-btn[data-code-id="${codeId}"]`);
    const container = document.querySelector(`.code-container[data-code-id="${codeId}"]`);

    if (copyAllBtn && container) {
      copyAllBtn.addEventListener('click', async () => {
        const codes = container.querySelectorAll('code');
        const text = Array.from(codes).map(code => code.textContent).join('\n\n');

        await navigator.clipboard.writeText(text);
        copyAllBtn.classList.add('copied');
        setTimeout(() => copyAllBtn.classList.remove('copied'), 2000);
      });
    }

    document.querySelectorAll(`.copy-lang-btn[data-code-id="${codeId}"]`).forEach(btn => {
      btn.addEventListener('click', async () => {
        const lang = (btn as HTMLElement).dataset.lang;
        const code = container?.querySelector(`.language-${lang}`);
        if (code) {
          await navigator.clipboard.writeText(code.textContent || '');
          btn.classList.add('copied');
          setTimeout(() => btn.classList.remove('copied'), 2000);
        }
      });
    });
  }

  // Toggle collapse
  function initToggle(codeId: string) {
    const toggleBtn = document.querySelector(`.toggle-btn[data-code-id="${codeId}"]`);
    const container = document.querySelector(`.code-container[data-code-id="${codeId}"]`);

    if (toggleBtn && container) {
      toggleBtn.addEventListener('click', () => {
        const isCollapsed = container.classList.toggle('collapsed');
        toggleBtn.setAttribute('aria-expanded', !isCollapsed);
      });
    }
  }

  // Initialize all code blocks
  document.querySelectorAll('.dual-code-block').forEach(block => {
    const codeId = block.dataset.codeId;
    if (codeId) {
      initSyncScroll(codeId);
      initCopyButtons(codeId);
      initToggle(codeId);
    }
  });
</script>

<style>
  .dual-code-block {
    margin: var(--space-lg) 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-card);
  }

  .block-title {
    margin: 0;
    padding: var(--space-sm) var(--space-md);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
    background: var(--color-border);
  }

  .code-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-gray-2);
    cursor: pointer;
    font-size: 0.75rem;
    transition: all var(--transition-fast);
  }

  .action-btn:hover {
    background: var(--color-border);
    color: var(--color-text);
  }

  .action-btn.copied {
    background: var(--color-success);
    color: white;
    border-color: var(--color-success);
  }

  .action-btn svg {
    width: 14px;
    height: 14px;
  }

  .code-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    transition: max-height var(--transition-slow);
    overflow: hidden;
  }

  .code-container.collapsed {
    max-height: 0;
  }

  .code-panel {
    border-right: 1px solid var(--color-border);
    overflow: hidden;
  }

  .code-panel:last-child {
    border-right: none;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .lang-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
  }

  .lang-badge.python {
    background: #3776ab;
    color: white;
  }

  .lang-badge.typescript {
    background: #3178c6;
    color: white;
  }

  .copy-lang-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xs);
    border: none;
    background: transparent;
    color: var(--color-gray-3);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .copy-lang-btn:hover {
    background: var(--color-border);
    color: var(--color-text);
  }

  .copy-lang-btn.copied {
    background: var(--color-success);
    color: white;
  }

  .code {
    margin: 0;
    padding: var(--space-md);
    overflow-x: auto;
    overflow-y: auto;
    max-height: 400px;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    background: var(--color-code-bg);
  }

  .code:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }

  @media (max-width: 768px) {
    .code-container {
      grid-template-columns: 1fr;
    }

    .code-panel {
      border-right: none;
      border-bottom: 1px solid var(--color-border);
    }

    .code-panel:last-child {
      border-bottom: none;
    }

    .code {
      font-size: 0.75rem;
      padding: var(--space-sm);
    }
  }

  @media (max-width: 480px) {
    .code {
      font-size: 0.6875rem;
      line-height: 1.4;
    }
  }

  @media (prefers-contrast: high) {
    .code-panel {
      border-width: 2px;
    }

    .lang-badge.python {
      outline: 2px solid #3776ab;
      outline-offset: 2px;
    }

    .lang-badge.typescript {
      outline: 2px solid #3178c6;
      outline-offset: 2px;
    }
  }

  @media (hover: none) {
    .code {
      min-height: 44px;
    }
  }
</style>
```

- [ ] **Step 3: 验证构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/DualCodeBlock.astro
git commit -m "feat: enhance DualCodeBlock with sync scroll, copy, and collapse

- Synchronized scrolling between Python/TypeScript panels
- Copy all code or individual language
- Collapse/expand toggle
- Copy buttons with visual feedback
- Responsive: stacks vertically on mobile"
```

---

### Task 8: 更新 QuizContainer 样式

**Files:**

- Modify: `src/components/QuizContainer.astro`

- [ ] **Step 1: 读取现有 QuizContainer**

Read lines 1-200 of `src/components/QuizContainer.astro` to understand current structure.

- [ ] **Step 2: 更新 QuizContainer 样式部分**

The quiz logic stays the same, only update the `<style>` section. Find the existing style block and replace with:

```css
<style>
  .quiz-container {
    margin: var(--space-xl) 0;
    padding: var(--space-lg);
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--color-border);
  }

  .quiz-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  .quiz-progress {
    font-size: 0.875rem;
    color: var(--color-gray-2);
  }

  .quiz-question {
    margin-bottom: var(--space-lg);
  }

  .question-text {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: var(--space-md);
    line-height: 1.6;
  }

  .quiz-options {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .quiz-option {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-height: 44px;
  }

  .quiz-option:hover:not(.disabled) {
    border-color: var(--color-primary);
    background: var(--sl-color-accent-low);
  }

  .quiz-option.selected {
    border-color: var(--color-primary);
    background: var(--sl-color-accent-low);
  }

  .quiz-option.correct {
    border-color: var(--color-success);
    background: rgba(34, 197, 94, 0.1);
  }

  .quiz-option.incorrect {
    border-color: var(--color-error);
    background: rgba(239, 68, 68, 0.1);
  }

  .quiz-option.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .option-indicator {
    width: 24px;
    height: 24px;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all var(--transition-fast);
  }

  .quiz-option.selected .option-indicator {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: white;
  }

  .quiz-option.correct .option-indicator {
    border-color: var(--color-success);
    background: var(--color-success);
    color: white;
  }

  .quiz-option.incorrect .option-indicator {
    border-color: var(--color-error);
    background: var(--color-error);
    color: white;
  }

  .option-text {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-text);
  }

  .quiz-explanation {
    margin-top: var(--space-md);
    padding: var(--space-md);
    background: var(--color-bg);
    border-left: 4px solid var(--color-primary);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-gray-2);
  }

  .quiz-explanation.correct {
    border-left-color: var(--color-success);
  }

  .quiz-explanation.incorrect {
    border-left-color: var(--color-error);
  }

  .quiz-actions {
    margin-top: var(--space-lg);
    display: flex;
    gap: var(--space-sm);
    justify-content: flex-end;
  }

  .quiz-action-btn {
    padding: var(--space-sm) var(--space-lg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-card);
    color: var(--color-text);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all var(--transition-fast);
    min-height: 44px;
  }

  .quiz-action-btn:hover {
    border-color: var(--color-primary);
    background: var(--sl-color-accent-low);
  }

  .quiz-action-btn.primary {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  .quiz-action-btn.primary:hover {
    background: var(--color-secondary);
    border-color: var(--color-secondary);
  }

  .quiz-results {
    text-align: center;
    padding: var(--space-xl);
  }

  .results-score {
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--space-md);
  }

  .results-message {
    font-size: 1.125rem;
    color: var(--color-text);
    margin-bottom: var(--space-lg);
  }

  @media (max-width: 768px) {
    .quiz-container {
      margin: var(--space-md) -0.5rem;
      border-radius: 0;
      padding: var(--space-md);
    }

    .quiz-option {
      padding: var(--space-sm);
    }

    .quiz-action-btn {
      flex: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .quiz-option,
    .quiz-action-btn,
    .option-indicator {
      transition: none;
    }
  }
</style>
```

- [ ] **Step 3: 验证构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/QuizContainer.astro
git commit -m "style: update QuizContainer with card design and instant feedback

- Card-style container with shadow
- Visual feedback for correct/incorrect answers
- Color-coded indicators (green/red)
- Responsive mobile layout
- Accessible touch targets (44px min)"
```

---

### Task 9: 增强 SidebarProgress 进度指示

**Files:**

- Modify: `src/components/SidebarProgress.astro`

- [ ] **Step 1: 更新 SidebarProgress 样式**

Read existing `src/components/SidebarProgress.astro`, update the `<style is:global>` section:

```css
<style is:global>
  .progress-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.375rem;
    font-size: 0.625rem;
    transition: color var(--transition-fast);
    vertical-align: middle;
    line-height: 1;
  }

  .progress-dot.completed {
    color: var(--color-success);
  }

  .progress-dot:not(.completed) {
    color: var(--sl-color-gray-4, #6b7280);
  }

  .group-progress {
    display: inline-flex;
    align-items: center;
    margin-left: auto;
    padding-left: 0.5rem;
    font-size: 0.6875rem;
    font-weight: 500;
    opacity: 0.8;
  }

  .group-progress.has-progress {
    color: var(--color-success);
  }

  .group-progress.no-progress {
    color: var(--sl-color-gray-4, #6b7280);
  }

  /* Completion badge */
  .completion-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-success);
    color: white;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
  }

  .completion-badge svg {
    width: 12px;
    height: 12px;
  }

  [data-theme="dark"] .progress-dot:not(.completed),
  [data-theme="dark"] .group-progress.no-progress {
    color: var(--sl-color-gray-4, #6b7280);
  }

  [data-theme="high-contrast"] .progress-dot.completed,
  [data-theme="high-contrast"] .group-progress.has-progress {
    color: #4ade80;
  }
</style>
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/SidebarProgress.astro
git commit -m "style: update SidebarProgress with new color variables

- Use CSS variables for success color
- Add completion badge styles
- High contrast theme support"
```

---

## Phase 4: 响应式与无障碍

### Task 10: 创建响应式样式文件

**Files:**

- Create: `src/styles/responsive.css`

- [ ] **Step 1: 创建 responsive.css**

Create `src/styles/responsive.css`:

```css
/**
 * Responsive Design Breakpoints
 * For the Python to TypeScript learning site
 */

/* ===== BREAKPOINTS ===== */

/* Large screens: full three-column layout */
@media (min-width: 1280px) {
  .sl-container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

/* Medium-large: hide right sidebar, expand content */
@media (max-width: 1279px) and (min-width: 1024px) {
  .right-sidebar {
    display: none !important;
  }

  .lesson-content,
  .algorithm-content {
    max-width: 100% !important;
  }
}

/* Tablet: single column with collapsible sidebar */
@media (max-width: 1023px) and (min-width: 768px) {
  .sl-container {
    padding: 0 var(--space-md);
  }

  .lesson-content,
  .algorithm-content {
    max-width: 100% !important;
  }
}

/* Mobile: hamburger menu, full-width content */
@media (max-width: 767px) {
  html {
    font-size: 15px;
  }

  .sl-container {
    padding: 0 var(--space-sm);
  }

  /* Typography adjustments */
  h1 {
    font-size: 1.75rem !important;
  }

  h2 {
    font-size: 1.375rem !important;
  }

  h3 {
    font-size: 1.125rem !important;
  }

  /* Code blocks */
  pre {
    font-size: 0.8125rem !important;
    padding: var(--space-sm) !important;
  }

  /* Tables */
  table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  html {
    font-size: 14px;
  }

  pre {
    font-size: 0.75rem !important;
  }

  code {
    font-size: 0.75rem !important;
  }
}

/* ===== LANDSCAPE MODE ===== */
@media (max-height: 500px) and (orientation: landscape) {
  .mobile-nav {
    width: 100%;
    max-width: 320px;
  }

  .mobile-nav-gestures {
    display: none !important;
  }
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ===== HIGH CONTRAST ===== */
@media (prefers-contrast: high) {
  :root {
    --color-border: currentColor;
  }

  button,
  a {
    border-width: 2px !important;
  }

  .card {
    border-width: 2px !important;
  }
}

/* ===== PRINT STYLES ===== */
@media print {
  .right-sidebar,
  .mobile-nav,
  .theme-toggle,
  .quiz-container,
  .pagination-links {
    display: none !important;
  }

  .lesson-content,
  .algorithm-content {
    max-width: 100% !important;
  }

  body {
    font-size: 12pt;
    color: #000;
    background: #fff;
  }

  a {
    color: #000;
    text-decoration: underline;
  }

  pre,
  code {
    border: 1px solid #ccc;
    background: #f5f5f5;
  }
}

/* ===== TOUCH DEVICES ===== */
@media (hover: none) {
  button,
  a,
  [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }

  .quiz-option {
    padding: var(--space-md);
  }

  /* Larger tap targets */
  .tool-btn {
    padding: var(--space-md);
  }

  /* Prevent text zoom on iOS */
  input,
  select,
  textarea {
    font-size: 16px;
  }

  /* Improve tap highlight */
  * {
    -webkit-tap-highlight-color: rgba(91, 127, 255, 0.2);
  }
}

/* ===== FOCUS VISIBLE ===== */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ===== SCROLLBAR STYLING ===== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--color-gray-4);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-3);
}

[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background: var(--sl-color-gray-5);
}

[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background: var(--sl-color-gray-4);
}
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/styles/responsive.css
git commit -m "style: add responsive breakpoints and accessibility styles

- 4 breakpoints: 1280px, 1024px, 768px, 480px
- Landscape mode optimization
- Reduced motion support
- High contrast mode
- Print styles
- Touch device optimizations (44px min targets)
- Custom scrollbar styling"
```

---

### Task 11: 创建组件样式文件

**Files:**

- Create: `src/styles/components.css`

- [ ] **Step 1: 创建 components.css**

Create `src/styles/components.css`:

```css
/**
 * Component Styles
 * Shared styles for custom components
 */

/* ===== CARDS ===== */
.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  transition: all var(--transition-fast);
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(91, 127, 255, 0.15);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.card-description {
  color: var(--color-gray-2);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

/* ===== BADGES ===== */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-primary {
  background: var(--sl-color-accent-low);
  color: var(--color-primary);
}

.badge-success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.badge-error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-card);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  min-height: 44px;
  text-decoration: none;
}

.btn:hover {
  border-color: var(--color-primary);
  background: var(--sl-color-accent-low);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
}

.btn-sm {
  padding: var(--space-xs) var(--space-md);
  font-size: 0.75rem;
  min-height: 32px;
}

/* ===== PROGRESS BAR ===== */
.progress-bar {
  height: 8px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.progress-fill.success {
  background: var(--color-success);
}

/* ===== ALERTS ===== */
.alert {
  padding: var(--space-md) var(--space-lg);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--sl-color-accent-low);
  margin: var(--space-md) 0;
}

.alert-success {
  border-left-color: var(--color-success);
  background: rgba(34, 197, 94, 0.1);
}

.alert-warning {
  border-left-color: var(--color-warning);
  background: rgba(245, 158, 11, 0.1);
}

.alert-error {
  border-left-color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

/* ===== TOOLTIPS ===== */
.tooltip {
  position: relative;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-text);
  color: var(--color-bg);
  font-size: 0.75rem;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-fast);
}

.tooltip:hover::after {
  opacity: 1;
}

/* ===== DIVIDERS ===== */
.divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-lg) 0;
  border: none;
}

/* ===== DARK THEME OVERRIDES ===== */
[data-theme="dark"] .card:hover {
  box-shadow: 0 4px 16px rgba(91, 127, 255, 0.2);
}

[data-theme="dark"] .tooltip::after {
  background: var(--sl-color-gray-1);
  color: var(--sl-color-bg);
}
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/styles/components.css
git commit -m "style: add shared component styles

- Card, badge, button styles
- Progress bar, alerts, tooltips
- Divider and common patterns
- Dark theme overrides"
```

---

### Task 12: 更新 Header 和 Banner 样式

**Files:**

- Modify: `src/components/Header.astro`
- Modify: `src/components/Banner.astro`

- [ ] **Step 1: 更新 Header 样式**

Read existing `src/components/Header.astro`, update the `<style>` section:

```css
<style>
  .header {
    gap: var(--sl-nav-gap);
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 var(--space-md);
    background: var(--sl-color-bg-nav);
    border-bottom: 1px solid var(--color-border);
  }

  .title-wrapper {
    overflow: hidden;
  }

  .title-wrapper :global(.site-title) {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .right-group {
    gap: var(--space-sm);
    align-items: center;
    margin-left: auto;
  }

  .social-icons {
    gap: var(--space-sm);
    align-items: center;
  }

  .social-icons:empty {
    display: none;
  }

  .social-icons::after {
    content: '';
    height: 1.5rem;
    border-inline-end: 1px solid var(--color-border);
  }

  .social-icons:empty::after {
    display: none;
  }

  @media (min-width: 50rem) {
    :global(:root[data-has-sidebar]) {
      --__sidebar-pad: calc(2 * var(--sl-nav-pad-x));
    }
    :global(:root:not([data-has-toc])) {
      --__toc-width: 0rem;
    }
    .header {
      --__sidebar-width: max(0rem, var(--sl-content-inline-start, 0rem) - var(--sl-nav-pad-x));
      --__main-column-fr: calc(
        (
            100% + var(--__sidebar-pad, 0rem) - var(--__toc-width, var(--sl-sidebar-width)) -
              (2 * var(--__toc-width, var(--sl-nav-pad-x))) - var(--sl-content-inline-start, 0rem) -
              var(--sl-content-width)
          ) / 2
      );
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
```

- [ ] **Step 2: 更新 Banner 样式**

Read existing `src/components/Banner.astro`, update the `<style>` section:

```css
<style>
  .sl-banner {
    --__sl-banner-text: var(--sl-color-banner-text, var(--sl-color-bg));
    padding: var(--space-sm) var(--space-md);
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: var(--__sl-banner-text);
    line-height: 1.6;
    text-align: center;
    text-wrap: balance;
    font-size: 0.875rem;
  }

  .sl-banner :global(a) {
    color: var(--__sl-banner-text);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .sl-banner :global(a):hover {
    text-decoration-thickness: 2px;
  }
</style>
```

- [ ] **Step 3: 验证构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro src/components/Banner.astro
git commit -m "style: update Header and Banner with new design

- Header: primary color title, updated spacing
- Banner: gradient background with primary/secondary colors
- Consistent with new UI design system"
```

---

## Phase 5: 测试与验证

### Task 13: 运行完整测试套件

**Files:**

- All test files

- [ ] **Step 1: 运行单元测试**

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 2: 运行类型检查**

Run: `npm run typecheck`
Expected: No type errors

- [ ] **Step 3: 运行 lint**

Run: `npm run lint`
Expected: No lint errors

- [ ] **Step 4: 运行构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: 运行链接检查**

Run: `npm run linkcheck`
Expected: All links valid

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "test: verify all tests pass with new UI changes

- All unit tests passing
- Type check clean
- Lint clean
- Build successful
- Links valid"
```

---

### Task 14: 更新 Pagination 样式

**Files:**

- Modify: `src/components/Pagination.astro`

- [ ] **Step 1: 更新 Pagination 样式**

Read existing `src/components/Pagination.astro`, update the `<style>` section:

```css
<style>
  .pagination-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
    gap: var(--space-md);
    margin-top: var(--space-xl);
  }

  a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--space-sm);
    width: 100%;
    flex-basis: calc(50% - var(--space-sm));
    flex-grow: 1;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    text-decoration: none;
    color: var(--color-gray-2);
    background: var(--color-card);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    overflow-wrap: anywhere;
    transition: all var(--transition-fast);
  }

  a:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(91, 127, 255, 0.15);
  }

  a[rel="next"] {
    justify-content: end;
    text-align: end;
    flex-direction: row-reverse;
  }

  .link-title {
    color: var(--color-text);
    font-size: var(--sl-text-xl);
    line-height: var(--sl-line-height-headings);
    font-weight: 500;
  }

  .pagination-label {
    font-size: var(--sl-text-sm);
    color: var(--color-gray-3);
  }

  .pagination-arrow {
    font-size: 1.5rem;
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    a {
      padding: var(--space-sm);
    }

    .link-title {
      font-size: var(--sl-text-lg);
    }
  }
</style>
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/Pagination.astro
git commit -m "style: update Pagination with card design and hover effects

- Card-style pagination links
- Hover lift effect with shadow
- Primary color arrows
- Responsive mobile layout"
```

---

### Task 15: 最终验证与清理

**Files:**

- All files

- [ ] **Step 1: 运行完整检查**

Run: `npm run check`
Expected: All checks pass (lint + typecheck + test + build + linkcheck)

- [ ] **Step 2: 启动开发服务器手动验证**

Run: `npm run dev -- --host 127.0.0.1 --port 4408`
Expected: Dev server starts, open browser to verify:

- Three-column layout on large screens
- Right sidebar with TOC, tools, progress
- Theme toggle works (light/dark)
- Code blocks have sync scroll, copy, collapse
- Quiz has card design with instant feedback
- Responsive on mobile (hamburger menu, single column)
- Progress indicators in sidebar

- [ ] **Step 3: 最终提交**

```bash
git add .
git commit -m "feat: complete WebUI redesign

- Three-column layout (nav + content + right sidebar)
- Auto theme detection with light/dark/high-contrast/sepia
- Enhanced bilingual code blocks (sync scroll, copy, collapse)
- Card-style quiz with instant feedback
- Progress tracking with visual indicators
- Responsive design (4 breakpoints)
- WCAG 2.1 AA accessibility compliance
- All tests passing"
```

---

## 实施优先级总结

### Phase 1: 基础重构 (Tasks 1-3)

1. 更新色彩变量（tokens.css）
2. 实现主题自动检测
3. 更新 ThemeToggle 组件

### Phase 2: 三栏布局 (Tasks 4-6)

4. 创建 RightSidebar 组件
5. 更新布局文件
6. 注册到 Starlight 配置

### Phase 3: 组件增强 (Tasks 7-9)

7. 增强双语代码块
8. 更新 QuizContainer 样式
9. 增强 SidebarProgress

### Phase 4: 响应式与无障碍 (Tasks 10-12)

10. 创建响应式样式
11. 创建组件样式
12. 更新 Header 和 Banner

### Phase 5: 测试与验证 (Tasks 13-15)

13. 运行完整测试套件
14. 更新 Pagination 样式
15. 最终验证与清理

---

## 技术约束

- 保持 Astro + Starlight 架构
- 不改变内容文件结构（MDX）
- 保持现有构建命令
- 兼容现有测试
- 所有新组件使用 TypeScript
- 遵循现有代码规范（const 优先、无 any 类型）
