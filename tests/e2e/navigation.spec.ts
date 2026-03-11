import { test, expect } from "@playwright/test";

test("top nav routes are reachable", async ({ page }) => {
  await page.goto("/paths/");
  await expect(page.getByRole("heading", { name: "学习路径" }).first()).toBeVisible();

  await page.goto("/paths/foundation/");
  await expect(page.getByRole("heading", { name: /基础路径/i }).first()).toBeVisible();

  await page.goto("/paths/migration/");
  await expect(page.getByRole("heading", { name: /迁移路径/i }).first()).toBeVisible();

  await page.goto("/paths/advanced/");
  await expect(page.getByRole("heading", { name: /进阶路径/i }).first()).toBeVisible();

  await page.goto("/handbook/");
  await expect(page.getByRole("heading", { name: /手册/i }).first()).toBeVisible();

  await page.goto("/algorithms/");
  await expect(page.getByRole("heading", { name: /算法/i }).first()).toBeVisible();

  await page.goto("/practice/");
  await expect(page.getByRole("heading", { name: /practice/i }).first()).toBeVisible();

  await page.goto("/about/");
  await expect(page.getByRole("heading", { name: /about/i }).first()).toBeVisible();
});
