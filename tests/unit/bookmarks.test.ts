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

  it("书签页挂载进度面板，收藏容器由组件提供", () => {
    const page = readFileSync("src/content/docs/bookmarks/index.mdx", "utf8");
    expect(page).toMatch(/ProgressPanel/);

    const panel = readFileSync("src/components/ProgressPanel.astro", "utf8");
    expect(panel).toMatch(/id="bookmarks-container"/);
    // 存储键收敛在 progress-store 一处；面板必须经它读写，收藏数据才能互通
    expect(panel).toMatch(/from "\.\.\/lib\/progress-store"/);
  });

  it("进度面板用构建期 BASE_URL 生成链接，不依赖运行时从 script 推导", () => {
    // 此前由 public/bookmarks.js 在运行时读 currentScript 反推 base（子路径部署下脆弱）。
    // 现在链接在构建时拼好，运行时无需推导。
    const panel = readFileSync("src/components/ProgressPanel.astro", "utf8");
    expect(panel).toMatch(/import\.meta\.env\.BASE_URL/);
    expect(panel).not.toMatch(/currentScript/);
  });

  it("收藏卡 href 拼接子路径 base（存储路径不带前缀，直接用会 404）", () => {
    const panel = readFileSync("src/components/ProgressPanel.astro", "utf8");
    // base 由构建期写入 data-*，运行时读取后经 withBase 拼接
    expect(panel).toMatch(/data-base=/);
    expect(panel).toMatch(/card\.href = withBase\(path\)/);
    expect(panel).not.toMatch(/card\.href = path/);
  });

  it("SidebarProgress 路径匹配兼容子路径 base 前缀", () => {
    const content = readFileSync("src/components/SidebarProgress.astro", "utf8");
    expect(content).toMatch(/endsWith/);
  });
});
