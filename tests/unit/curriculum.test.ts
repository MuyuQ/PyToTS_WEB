import { describe, expect, it } from "vitest";
import {
  CURRICULUM,
  TRACK_ORDER,
  isTrack,
  lessonRoute,
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
});
