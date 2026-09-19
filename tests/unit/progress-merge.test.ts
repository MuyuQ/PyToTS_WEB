/**
 * 备份恢复（导出/导入）的合并逻辑。
 * 进度文件来自外部输入：形状不合格必须被拒绝，合并必须保住两边的数据。
 */
import { describe, expect, it } from "vitest";
import {
  mergeLearningProgress,
  parseProgressBlob,
  type LearningProgress,
} from "../../src/lib/progress-store";

function makeProgress(overrides: Partial<LearningProgress> = {}): LearningProgress {
  return {
    lessons: [],
    quizzes: [],
    bookmarks: [],
    lastVisited: "",
    ...overrides,
  };
}

describe("parseProgressBlob", () => {
  it("接受形状正确的备份", () => {
    const blob = JSON.stringify({
      lessons: [
        { path: "/paths/foundation/", title: "x", completedAt: "2026-01-01", type: "lesson" },
      ],
      quizzes: [],
      bookmarks: ["/algorithms/two-sum/"],
      lastVisited: "",
    });
    expect(parseProgressBlob(blob)?.bookmarks).toEqual(["/algorithms/two-sum/"]);
  });

  it("拒绝损坏的 JSON 与形状不对的对象", () => {
    expect(parseProgressBlob("not json")).toBeNull();
    expect(parseProgressBlob("{}")).toBeNull();
    expect(parseProgressBlob(JSON.stringify({ lessons: "no" }))).toBeNull();
  });
});

describe("mergeLearningProgress", () => {
  it("同一课程按 completedAt 新者胜", () => {
    const current = makeProgress({
      lessons: [
        { path: "/paths/migration/types/", title: "旧", completedAt: "2026-01-01", type: "lesson" },
      ],
    });
    const incoming = makeProgress({
      lessons: [
        { path: "/paths/migration/types/", title: "新", completedAt: "2026-06-01", type: "lesson" },
      ],
    });
    const merged = mergeLearningProgress(current, incoming);
    expect(merged.lessons).toHaveLength(1);
    expect(merged.lessons[0]?.title).toBe("新");
  });

  it("completedAt 相同或更旧时保留当前记录", () => {
    const current = makeProgress({
      lessons: [
        {
          path: "/paths/migration/types/",
          title: "当前",
          completedAt: "2026-06-01",
          type: "lesson",
        },
      ],
    });
    const incoming = makeProgress({
      lessons: [
        { path: "/paths/migration/types/", title: "旧", completedAt: "2026-01-01", type: "lesson" },
      ],
    });
    expect(mergeLearningProgress(current, incoming).lessons[0]?.title).toBe("当前");
  });

  it("路径尾部斜杠差异视为同一课程", () => {
    const current = makeProgress({
      lessons: [
        {
          path: "/paths/foundation/variables",
          title: "a",
          completedAt: "2026-01-01",
          type: "lesson",
        },
      ],
    });
    const incoming = makeProgress({
      lessons: [
        {
          path: "/paths/foundation/variables/",
          title: "a",
          completedAt: "2026-02-01",
          type: "lesson",
        },
      ],
    });
    expect(mergeLearningProgress(current, incoming).lessons).toHaveLength(1);
  });

  it("收藏取并集且去重", () => {
    const merged = mergeLearningProgress(
      makeProgress({ bookmarks: ["/algorithms/two-sum/"] }),
      makeProgress({ bookmarks: ["/algorithms/two-sum/", "/handbook/cheat-sheet/"] })
    );
    expect(merged.bookmarks.sort()).toEqual(["/algorithms/two-sum/", "/handbook/cheat-sheet/"]);
  });

  it("测验成绩按 quizId 保留较新一次", () => {
    const current = makeProgress({
      quizzes: [{ quizId: "types", score: 2, total: 5, percentage: 40, completedAt: "2026-01-01" }],
    });
    const incoming = makeProgress({
      quizzes: [{ quizId: "types", score: 4, total: 5, percentage: 80, completedAt: "2026-05-01" }],
    });
    expect(mergeLearningProgress(current, incoming).quizzes[0]?.percentage).toBe(80);
  });

  it("当前设备已有学习记录时不覆盖 lastVisited", () => {
    expect(
      mergeLearningProgress(
        makeProgress({ lastVisited: "/paths/migration/types/" }),
        makeProgress({ lastVisited: "/algorithms/two-sum/" })
      ).lastVisited
    ).toBe("/paths/migration/types/");
    expect(
      mergeLearningProgress(makeProgress(), makeProgress({ lastVisited: "/algorithms/two-sum/" }))
        .lastVisited
    ).toBe("/algorithms/two-sum/");
  });
});
