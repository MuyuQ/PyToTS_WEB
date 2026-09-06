import { test, expect } from "@playwright/test";

test("mobile viewport (375px): nav usable and quiz interaction works", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto("./");
  const nav = page.locator("nav.site-nav");
  await expect(nav).toBeVisible();
  // 窄屏导航是横向滚动条而非汉堡菜单：链接仍可点
  await expect(nav.getByRole("link", { name: "题库" })).toBeVisible();

  await page.goto("practice/quiz/");
  const quiz = page.locator(".quiz-container").first();
  await expect(quiz).toBeVisible();

  await quiz.locator(".quiz-option").first().click();
  const actionButton = quiz.locator(".quiz-action-btn");
  await actionButton.click();
  await expect(quiz.locator(".quiz-explanation")).toBeVisible();

  await page.goto("algorithms/");
  // 窄屏下表格转卡片列表（td 用 data-label 做字段名），筛选仍然可用
  await page.locator('.filter-btn[data-filter="medium"]').click();
  const visibleRows = page.locator(".algo-index tbody tr:visible");
  expect(await visibleRows.count()).toBeGreaterThan(0);
});
