import { test, expect } from "@playwright/test";

test("search and taxonomy pages load", async ({ page }) => {
  await page.goto("/tags/");
  await expect(page.getByRole("heading", { name: /tags/i }).first()).toBeVisible();

  await page.goto("/difficulty/");
  await expect(page.getByRole("heading", { name: /difficulty/i }).first()).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("button", { name: /search/i })).toBeVisible();
});
