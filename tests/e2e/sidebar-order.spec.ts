import { test, expect } from "@playwright/test";
import { CURRICULUM, TRACK_ORDER, neighbourLesson, type TrackId } from "../../src/lib/curriculum";
import playwrightConfig from "../../playwright.config";

// base 前缀只认配置里的 baseURL（与 Pagination 组件的 BASE_URL 同源），不在用例里硬编码
const BASE = new URL(
  playwrightConfig.use?.baseURL ?? "http://127.0.0.1:4321/PyToTS_WEB"
).pathname.replace(/\/+$/, "");

/**
 * 侧边栏课程顺序必须与 curriculum 的教学顺序一致。
 * 此前 Starlight autogenerate 按字母序排列，学习路径完全颠倒——用 E2E 防回归。
 */
const TRACKS = TRACK_ORDER;

function expectedHrefs(track: TrackId): string[] {
  // index 入口页（curriculum 里以 'index' 占位）排在组内第一位，其余按教学顺序
  return [
    `${BASE}/paths/${track}/`,
    ...CURRICULUM[track]
      .filter((slug) => slug !== "index")
      .map((slug) => `${BASE}/paths/${track}/${slug}/`),
  ];
}

// DOM 侧边栏 href 自带 base 前缀，与同样带前缀的 expected 直接比较；
// page.goto 则传站点根相对路径，由 baseURL 自动拼接
test.describe("sidebar curriculum order", () => {
  for (const track of TRACKS) {
    test(`${track} 路径侧边栏按教学顺序排列`, async ({ page }) => {
      const steps = CURRICULUM[track];
      const firstSlug = steps[0];
      const firstHref = firstSlug === "index" ? `paths/${track}/` : `paths/${track}/${firstSlug}/`;
      await page.goto(firstHref);

      // 侧边栏链接按 DOM 顺序排列；collapsed 分组也渲染在 DOM 中
      const sidebarHrefs = await page
        .locator(".sidebar-content a[href]")
        .evaluateAll((links) =>
          links.map((link) => (link as HTMLAnchorElement).getAttribute("href"))
        );
      const expected = expectedHrefs(track);

      // 从侧边栏序列中按顺序筛出该 track 的课程链接，得到实际相对顺序
      const trackPrefix = `${BASE}/paths/${track}/`;
      const actual = sidebarHrefs.filter((href) => href?.startsWith(trackPrefix));

      expect(actual, `${track} 侧边栏应包含全部课程`).toEqual(expected);
    });
  }

  test("课程页上一课/下一课遵循教学顺序", async ({ page }) => {
    // 期望从 curriculum 推导：课程重排时用例自动跟随，不会误报
    const prevStep = neighbourLesson("migration", "types", -1);
    const nextStep = neighbourLesson("migration", "types", 1);
    await page.goto("paths/migration/types/");

    if (nextStep) {
      const nextLink = page.locator(".pagination-links a[rel='next']");
      await expect(nextLink).toHaveAttribute("href", new RegExp(`${nextStep.slug}/$`));
    }

    if (prevStep) {
      const prevLink = page.locator(".pagination-links a[rel='prev']");
      await expect(prevLink).toHaveAttribute("href", new RegExp(`${prevStep.slug}/$`));
    }
  });
});
