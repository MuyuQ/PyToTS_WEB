import { test, expect } from "@playwright/test";

test("search and taxonomy pages load", async ({ page }) => {
  await page.goto("tags/");
  await expect(page.getByRole("heading", { name: /标签索引/i }).first()).toBeVisible();

  await page.goto("difficulty/");
  await expect(page.getByRole("heading", { name: /难度索引/i }).first()).toBeVisible();

  await page.goto("./");
  await expect(page.getByRole("button", { name: /搜索/i })).toBeVisible();
});
