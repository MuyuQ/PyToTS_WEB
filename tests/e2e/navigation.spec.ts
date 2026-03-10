import { test, expect } from "@playwright/test";

test("top nav routes are reachable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /paths/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /algorithms/i })).toBeVisible();
});