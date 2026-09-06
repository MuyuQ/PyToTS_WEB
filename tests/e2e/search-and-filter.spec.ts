import { test, expect } from "@playwright/test";

test("search and taxonomy pages load", async ({ page }) => {
  await page.goto("tags/");
  await expect(page.getByRole("heading", { name: /标签索引/i }).first()).toBeVisible();

  await page.goto("difficulty/");
  await expect(page.getByRole("heading", { name: /难度索引/i }).first()).toBeVisible();

  await page.goto("./");
  await expect(page.getByRole("button", { name: /搜索/i })).toBeVisible();
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

test("algorithm index search narrows rows and shows empty state for garbage", async ({
  page,
}) => {
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
