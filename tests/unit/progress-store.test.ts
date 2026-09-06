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
});
