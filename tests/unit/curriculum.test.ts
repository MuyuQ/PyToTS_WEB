import { describe, expect, it } from "vitest";
import {
  CURRICULUM,
  TRACK_ORDER,
  isTrack,
  lessonRoute,
  neighbourLesson,
  parseLessonRoute,
  totalLessonCount,
  trackLessonCount,
  trackRoutes,
} from "../../src/lib/curriculum";

describe("curriculum 单一数据源", () => {
  it("TRACK_ORDER 覆盖四条路径", () => {
    expect(TRACK_ORDER).toEqual(["preparation", "foundation", "migration", "advanced"]);
  });

  it("课程 slug 均唯一且不含 index 之外的重复", () => {
    for (const track of TRACK_ORDER) {
      const slugs = CURRICULUM[track];
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("trackRoutes 与 lessonRoute 口径一致", () => {
    const routes = trackRoutes("foundation");
    expect(routes[0]).toBe(lessonRoute("foundation", "variables"));
    expect(routes.every((r) => r.startsWith("/paths/foundation/"))).toBe(true);
  });

  it("trackLessonCount 不计入 index 入口页", () => {
    // preparation 的列表含 index，foundation 起始即正课——两种形态都验证
    expect(trackLessonCount("preparation")).toBe(CURRICULUM.preparation.length - 1);
    expect(trackLessonCount("foundation")).toBe(CURRICULUM.foundation.length);
    expect(trackLessonCount("foundation")).toBe(5);
  });

  it("isTrack 只认已知路径", () => {
    expect(isTrack("foundation")).toBe(true);
    expect(isTrack("nope")).toBe(false);
  });

  it("totalLessonCount 是各路径课时之和", () => {
    const sum = TRACK_ORDER.reduce((acc, t) => acc + trackLessonCount(t), 0);
    expect(totalLessonCount()).toBe(sum);
  });

  describe("parseLessonRoute", () => {
    it("解析课程路由并给出教学序号", () => {
      const parsed = parseLessonRoute("/paths/foundation/control-flow/");
      expect(parsed).toEqual({ track: "foundation", slug: "control-flow", index: 2 });
    });

    it("课程序之外的入口页不参与上一课/下一课（foundation 无 index 条目 → null）", () => {
      expect(parseLessonRoute("/paths/foundation/")).toBeNull();
    });

    it("preparation 的入口页在列表内，可解析为 index 第 0 位", () => {
      expect(parseLessonRoute("/paths/preparation/")).toEqual({
        track: "preparation",
        slug: "index",
        index: 0,
      });
    });

    it("非课程路由返回 null", () => {
      expect(parseLessonRoute("/algorithms/two-sum/")).toBeNull();
      expect(parseLessonRoute("/paths/unknown-track/x/")).toBeNull();
      expect(parseLessonRoute("/bookmarks/")).toBeNull();
    });
  });

  describe("neighbourLesson", () => {
    it("向后取下一课", () => {
      expect(neighbourLesson("foundation", "variables", 1)).toEqual({
        track: "foundation",
        slug: "functions-basics",
        route: "/paths/foundation/functions-basics/",
      });
    });

    it("向前取上一课", () => {
      expect(neighbourLesson("foundation", "control-flow", -1)?.slug).toBe("functions-basics");
    });

    it("首课无上一课、末课无下一课", () => {
      const first = CURRICULUM.foundation[0];
      const last = CURRICULUM.foundation[CURRICULUM.foundation.length - 1];
      expect(neighbourLesson("foundation", first, -1)).toBeNull();
      expect(neighbourLesson("foundation", last, 1)).toBeNull();
    });

    it("未知课程返回 null", () => {
      expect(neighbourLesson("foundation", "no-such-lesson", 1)).toBeNull();
    });
  });
});
