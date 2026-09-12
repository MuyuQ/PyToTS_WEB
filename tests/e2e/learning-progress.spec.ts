import { test, expect } from "@playwright/test";

test("home, sidebar and progress panel count the same two preparation lessons", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "ts-py-learning-progress",
      JSON.stringify({
        lessons: [
          "/paths/preparation/",
          "/paths/preparation/typescript-intro/",
          "/paths/preparation/setup/",
        ].map((path) => ({
          path,
          title: path,
          type: "lesson",
          completedAt: "2026-09-01T00:00:00Z",
        })),
        quizzes: [],
        bookmarks: [],
        lastVisited: "",
      })
    );
  });
  await page.goto("./");
  const preparation = page.locator("[data-path-row]").first();
  await expect(preparation.locator(".path-row__count")).toHaveText("2 课");
  await expect(preparation.locator("[data-row-num]")).toHaveText("2/2");
  await expect(preparation).toHaveAttribute("data-completed", "true");

  await page.goto("bookmarks/");
  await expect(page.locator('[data-stat="lessons"]')).toHaveText("2");
  await expect(page.locator("[data-track-num]").first()).toHaveText("2/2");
  await expect(
    page.locator("summary").filter({ hasText: "准备" }).locator(".group-progress")
  ).toHaveText("2/2");
});
