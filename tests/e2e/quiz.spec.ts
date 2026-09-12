import { test, expect } from "@playwright/test";

test("keyboard selection retains focus through completion and restart", async ({ page }) => {
  await page.goto("practice/quiz/");
  const quiz = page.locator('.quiz-container[data-quiz-id="prediction"]');
  const action = quiz.locator(".quiz-action-btn");
  for (const key of ["Space", "Enter", "Space"]) {
    const options = quiz.getByRole("radio");
    const order = await options.allTextContents();
    await options.first().focus();
    await page.keyboard.press(key);
    await expect(options.first()).toBeFocused();
    await expect(options.first()).toHaveAttribute("aria-checked", "true");
    expect(await options.allTextContents()).toEqual(order);
    await page.keyboard.press("Tab");
    await expect(action).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(quiz.locator(".quiz-explanation")).toBeFocused();
    expect(await options.allTextContents()).toEqual(order);
    await page.keyboard.press("Tab");
    await expect(action).toBeFocused();
    await page.keyboard.press("Enter");
  }
  await expect(quiz.locator(".quiz-result")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(quiz.locator(".quiz-restart-btn")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(quiz.getByRole("radio").first()).toBeFocused();
  await expect(action).toBeDisabled();
});

test("repeated attempts keep one completed group and two history records", async ({ page }) => {
  await page.goto("practice/quiz/");
  const quiz = page.locator('.quiz-container[data-quiz-id="prediction"]');
  const action = quiz.locator(".quiz-action-btn");
  for (let attempt = 0; attempt < 2; attempt++) {
    for (let question = 0; question < 3; question++) {
      await quiz.getByRole("radio").first().click();
      await action.click();
      await action.click();
    }
    await expect(quiz.locator(".quiz-result")).toBeVisible();
    if (attempt === 0) await quiz.locator(".quiz-restart-btn").click();
  }
  await page.goto("bookmarks/");
  await expect(page.locator('[data-stat="quizzes"]')).toHaveText("1");
  await expect(page.locator("[data-quiz-attempt-count]")).toHaveText("2");
  await page.getByText("查看作答记录", { exact: true }).click();
  await expect(page.locator("[data-quiz-history-body] tr")).toHaveCount(2);
  await expect(page.locator("[data-quiz-history-body] tr").first()).toContainText("预测输出");
  await page.setViewportSize({ width: 375, height: 812 });
  const cells = page.locator("[data-quiz-history-body] tr").first().locator("td");
  await expect(cells.first()).toHaveAttribute("data-label", "测验");
  await expect(cells.last()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
});

test("quiz interaction works on practice page", async ({ page }) => {
  await page.goto("practice/quiz/");

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

test("quiz full flow: complete, see result, restart", async ({ page }) => {
  await page.goto("practice/quiz/");

  const quiz = page.locator(".quiz-container").first();
  const actionButton = quiz.locator(".quiz-action-btn");

  // 答完整套：新题上「选择 → 提交」，非末题再点一次「下一题」；
  // 提交后选项为 aria-disabled（不可点击），必须先推进再选择
  for (let i = 0; i < 40; i++) {
    await quiz.locator(".quiz-option").first().click();
    await actionButton.click(); // 提交 → 显示解释
    if ((await actionButton.textContent()) === "查看结果") {
      await actionButton.click();
      break;
    }
    await actionButton.click(); // 下一题 → 渲染新题
  }

  const result = quiz.locator(".quiz-result");
  await expect(result).toBeVisible();
  await expect(result.locator(".quiz-result-header")).toContainText("测验完成");

  // 成绩已持久化到 localStorage
  const stored = await page.evaluate(() => localStorage.getItem("ts-py-learning-progress"));
  expect(stored).toContain("quizzes");

  // 重新测验：回到第一题，选项清空
  await result.locator(".quiz-restart-btn").click();
  await expect(quiz.locator(".quiz-progress")).toContainText("问题 1 /");
  const selected = quiz.locator(".quiz-option.selected");
  await expect(selected).toHaveCount(0);
});
