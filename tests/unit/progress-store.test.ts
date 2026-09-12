import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateOverallProgress,
  clearProgress,
  getCompletionStats,
  getProgress,
  getQuizResult,
  isCompleted,
  markAsCompleted,
  saveQuizResult,
  updateLastVisited,
} from "../../src/lib/progress-store";

describe("progress-store 工具函数", () => {
  beforeEach(() => {
    clearProgress();
  });

  it("markAsCompleted 记录完成；重复标记保持单条", () => {
    markAsCompleted("/paths/foundation/variables/", "变量与数据类型", "lesson");
    markAsCompleted("/paths/foundation/variables/", "变量与数据类型", "lesson");
    expect(getProgress().lessons).toHaveLength(1);
    expect(isCompleted("/paths/foundation/variables/")).toBe(true);
    expect(isCompleted("/algorithms/two-sum/")).toBe(false);
  });

  it("updateLastVisited 写入最后访问路径", () => {
    updateLastVisited("/paths/migration/types/");
    expect(getProgress().lastVisited).toBe("/paths/migration/types/");
  });

  it("saveQuizResult 覆盖同一 quizId 的旧成绩", () => {
    saveQuizResult("types", 1, 2);
    saveQuizResult("types", 2, 2);
    const quizzes = getProgress().quizzes;
    expect(quizzes).toHaveLength(1);
    expect(quizzes[0]?.score).toBe(2);
    expect(getQuizResult("types")?.percentage).toBe(100);
    expect(getQuizResult("no-such-quiz")).toBeNull();
    expect(getProgress().quizAttempts.map((attempt) => attempt.score)).toEqual([1, 2]);
    expect(getCompletionStats().quizzesTaken).toBe(2);
    expect(getCompletionStats().averageScore).toBe(100);
  });

  it("calculateOverallProgress 与 getCompletionStats 正确汇总", () => {
    expect(calculateOverallProgress(0)).toBe(0);

    markAsCompleted("/paths/foundation/variables/", "变量与数据类型", "lesson");
    saveQuizResult("types", 1, 2);
    expect(calculateOverallProgress(4)).toBe(25);

    const stats = getCompletionStats();
    expect(stats.totalCompleted).toBe(1);
    expect(stats.quizzesTaken).toBe(1);
    expect(stats.averageScore).toBe(50);
  });

  it("损坏的 localStorage 数据不抛错（形状校验兜底）", () => {
    localStorage.setItem("ts-py-learning-progress", "{oops");
    expect(getProgress().lessons).toEqual([]);

    localStorage.setItem("ts-py-learning-progress", JSON.stringify({ nonsense: true }));
    expect(getProgress().quizzes).toEqual([]);
    expect(getProgress().bookmarks).toEqual([]);
  });

  it("迁移旧成绩时保留最近成绩作为历史起点，再次读取不重复迁移", () => {
    const oldResult = {
      quizId: "types",
      score: 1,
      total: 2,
      percentage: 50,
      completedAt: "2026-09-01T00:00:00Z",
    };
    localStorage.setItem(
      "ts-py-learning-progress",
      JSON.stringify({ lessons: [], bookmarks: ["/paths/migration/types/"], quizzes: [oldResult] })
    );
    expect(getProgress().quizAttempts).toEqual([oldResult]);
    saveQuizResult("types", 2, 2);
    expect(getProgress().quizAttempts.map((attempt) => attempt.score)).toEqual([1, 2]);
    expect(getProgress().quizAttempts).toHaveLength(2);
    expect(getProgress().bookmarks).toEqual(["/paths/migration/types/"]);
    expect(getProgress().lastVisited).toBe("");
  });

  it("忽略损坏的数组成员，不接受无效成绩", () => {
    localStorage.setItem(
      "ts-py-learning-progress",
      JSON.stringify({
        lessons: [null],
        quizzes: [null, {}],
        quizAttempts: [null],
        bookmarks: [42, "/paths/migration/types/"],
      })
    );
    expect(isCompleted("/paths/migration/types/")).toBe(false);
    expect(getCompletionStats().quizzesTaken).toBe(0);
    expect(getProgress().bookmarks).toEqual(["/paths/migration/types/"]);
    for (const [score, total] of [
      [1, 0],
      [-1, 2],
      [3, 2],
      [0.5, 2],
    ])
      saveQuizResult("types", score, total);
    expect(getProgress().quizAttempts).toEqual([]);
  });

  it("入口页、算法和重复尾斜杠不会增加课程完成率", () => {
    markAsCompleted("/paths/preparation/", "准备", "lesson");
    markAsCompleted("/algorithms/two-sum/", "两数之和", "algorithm");
    markAsCompleted("/paths/preparation/setup/", "搭建环境", "lesson");
    markAsCompleted("/paths/preparation/setup", "搭建环境", "lesson");
    expect(calculateOverallProgress(2)).toBe(50);
    expect(getCompletionStats().totalCompleted).toBe(2);
  });
});
