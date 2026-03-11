import { test, expect } from "@playwright/test";

test("search and taxonomy pages load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("searchbox")).toBeVisible();
});