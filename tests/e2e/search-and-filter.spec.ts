import { test, expect } from "@playwright/test";

test("search and taxonomy pages load", async ({ page }) => {
  await page.goto("tags/");
  await expect(page.getByRole("heading", { name: /标签索引/i }).first()).toBeVisible();

  await page.goto("difficulty/");
  await expect(page.getByRole("heading", { name: /难度索引/i }).first()).toBeVisible();

  await page.goto("./");
  await expect(page.getByRole("button", { name: /搜索/i })).toBeVisible();
});

test("search modal groups results by content type and supports type filters", async ({ page }) => {
  await page.goto("./");

  await page.locator("site-search button[data-open-modal]").click();
  const dialog = page.locator("site-search dialog");
  await expect(dialog).toBeVisible();

  const input = page.locator("site-search [data-search-input]");
  await input.fill("类型");
  const status = page.locator("[data-search-status]");
  await expect(status).not.toContainText("搜索中", { timeout: 10_000 });

  // "全部"视图：结果按内容类型分组
  const groupLabels = page.locator(".search-group__label");
  await expect(groupLabels.first()).toBeVisible();
  const labels = (await groupLabels.allTextContents()).filter(Boolean);
  expect(labels.length).toBeGreaterThan(0);
  expect(labels).toContain("课程");

  // 切到「题解」过滤片：只剩算法题解的扁平列表
  await page.locator('site-search [data-chip="题解"]').click();
  await expect(status).toContainText(/结果/, { timeout: 10_000 });
  await expect(page.locator(".search-group__label")).toHaveCount(0);
  await expect(page.locator(".search-result").first()).toBeVisible();
  // 过滤片徽标计数来自 Pagefind filter（Banner 注入的类型标记）
  await expect(page.locator('site-search [data-chip-count="题解"]')).toHaveText("36", {
    timeout: 10_000,
  });

  // Esc 关闭模态
  await input.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("algorithm index difficulty filter keeps only matching rows", async ({ page }) => {
  await page.goto("algorithms/");

  const rows = page.locator(".algo-index tbody tr");
  const total = await rows.count();
  expect(total).toBeGreaterThanOrEqual(30);

  await page.locator('.filter-btn[data-filter="easy"]').click();
  await expect(page.locator('.filter-btn[data-filter="easy"]')).toHaveClass(/is-active/);

  const visibleRows = page.locator(".algo-index tbody tr:visible");
  const easyCount = await visibleRows.count();
  expect(easyCount).toBeGreaterThan(0);
  expect(easyCount).toBeLessThan(total);
  for (const row of await visibleRows.all()) {
    await expect(row).toHaveAttribute("data-difficulty", "easy");
  }
});

test("algorithm index search narrows rows and shows empty state for garbage", async ({ page }) => {
  await page.goto("algorithms/");

  const search = page.locator("[data-algo-search]");
  await search.fill("two");
  const visibleRows = page.locator(".algo-index tbody tr:visible");
  const hitCount = await visibleRows.count();
  expect(hitCount).toBeGreaterThan(0);
  expect(hitCount).toBeLessThan(30);
  for (const row of await visibleRows.all()) {
    await expect(row).toContainText(/two/i);
  }

  await search.fill("不存在的关键词zzz");
  await expect(page.locator("[data-algo-empty]")).toBeVisible();

  await search.fill("");
  await expect(page.locator(".algo-index tbody tr:visible").first()).toBeVisible();
  await expect(page.locator("[data-algo-empty]")).toBeHidden();
});
