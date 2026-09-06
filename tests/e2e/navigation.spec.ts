import { test, expect } from "@playwright/test";

test("top nav routes are reachable", async ({ page }) => {
  await page.goto("paths/");
  await expect(page.getByRole("heading", { name: "学习路径" }).first()).toBeVisible();

  await page.goto("paths/foundation/");
  await expect(page.getByRole("heading", { name: /基础路径/i }).first()).toBeVisible();

  await page.goto("paths/migration/");
  await expect(page.getByRole("heading", { name: /迁移路径/i }).first()).toBeVisible();

  await page.goto("paths/advanced/");
  await expect(page.getByRole("heading", { name: /进阶路径/i }).first()).toBeVisible();

  await page.goto("handbook/");
  await expect(page.getByRole("heading", { name: /手册/i }).first()).toBeVisible();

  await page.goto("algorithms/");
  await expect(page.getByRole("heading", { name: /算法/i }).first()).toBeVisible();

  await page.goto("practice/");
  // 页面标题现为「练习与自测」（2026-09 内容加厚时由「练习与测验」改名）
  await expect(page.getByRole("heading", { name: /练习与自测/i }).first()).toBeVisible();

  await page.goto("about/");
  await expect(page.getByRole("heading", { name: /关于与贡献/i }).first()).toBeVisible();
});

test("missing page serves the custom 404 with exits", async ({ page }) => {
  const response = await page.goto("no-such-page/");
  expect(response?.status()).toBe(404);

  await expect(page.getByRole("heading", { name: "页面不存在" })).toBeVisible();
  await expect(page.getByRole("link", { name: "返回首页" })).toBeVisible();
  // 流失点要有具体出口：课程 / 题库 / 手册
  for (const exit of ["课程", "题库", "手册"]) {
    await expect(page.locator(".exits").getByRole("link", { name: exit })).toBeVisible();
  }
});
