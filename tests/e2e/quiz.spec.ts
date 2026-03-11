import { test, expect } from "@playwright/test";

test("quiz interaction works on practice page", async ({ page }) => {
  await page.goto("/practice/quiz/");

  const firstQuiz = page.locator(".quiz-container").first();
  await expect(firstQuiz).toBeVisible();

  const firstOption = firstQuiz.locator(".quiz-option").first();
  await expect(firstOption).toBeVisible();
  await firstOption.click();

  const actionButton = firstQuiz.locator(".quiz-action-btn");
  await expect(actionButton).toBeEnabled();
  await actionButton.click();

  const explanation = firstQuiz.locator(".quiz-explanation");
  await expect(explanation).toBeVisible();

  await actionButton.click();
  await expect(firstQuiz.locator(".quiz-progress")).toContainText("问题 2 /");
});
