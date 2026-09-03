import { describe, it, expect, beforeEach } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  addBookmark,
  removeBookmark,
  isBookmarked,
  getBookmarks,
  clearProgress,
} from "../../src/lib/progress-store";

describe("书签功能", () => {
  beforeEach(() => {
    clearProgress();
  });

  it("addBookmark 后 isBookmarked 为 true", () => {
    addBookmark("/paths/migration/types/");
    expect(isBookmarked("/paths/migration/types/")).toBe(true);
    expect(getBookmarks()).toContain("/paths/migration/types/");
  });

  it("重复收藏不会产生重复条目", () => {
    addBookmark("/paths/migration/types/");
    addBookmark("/paths/migration/types/");
    expect(getBookmarks().filter((b) => b === "/paths/migration/types/")).toHaveLength(1);
  });

  it("removeBookmark 后取消收藏", () => {
    addBookmark("/paths/migration/types/");
    removeBookmark("/paths/migration/types/");
    expect(isBookmarked("/paths/migration/types/")).toBe(false);
  });

  it("存在 BookmarkToggle 组件并复用 progress-store 书签 API", () => {
    const file = "src/components/BookmarkToggle.astro";
    expect(existsSync(file)).toBe(true);
    const content = readFileSync(file, "utf8");
    expect(content).toMatch(/addBookmark/);
    expect(content).toMatch(/removeBookmark/);
    expect(content).toMatch(/isBookmarked/);
    expect(content).toMatch(/aria-pressed/);
  });

  it("PageTitle 在课程/算法页挂载书签开关", () => {
    const content = readFileSync("src/components/overrides/PageTitle.astro", "utf8");
    expect(content).toMatch(/BookmarkToggle/);
  });

  it("书签页渲染收藏容器并加载渲染脚本", () => {
    const content = readFileSync("src/content/docs/bookmarks/index.mdx", "utf8");
    expect(content).toMatch(/id="bookmarks-container"/);
    expect(content).toMatch(/bookmarks\.js/);
  });

  it("bookmarks.js 从自身 script 地址推导 base（MDX 内联脚本会被 Markdown 改写，不可用）", () => {
    const content = readFileSync("public/bookmarks.js", "utf8");
    expect(content).toMatch(/currentScript/);
    expect(content).not.toMatch(/__BASE_URL__/);
  });

  it("SidebarProgress 路径匹配兼容子路径 base 前缀", () => {
    const content = readFileSync("src/components/SidebarProgress.astro", "utf8");
    expect(content).toMatch(/endsWith/);
  });
});
