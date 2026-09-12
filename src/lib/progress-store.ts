/**
 * 学习进度存储系统
 * 使用 localStorage 存储用户的学习进度
 */
import { allLessonRoutes } from "./curriculum";

export interface LessonProgress {
  path: string;
  title: string;
  completedAt: string;
  type: "lesson" | "algorithm" | "quiz";
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export interface LearningProgress {
  lessons: LessonProgress[];
  quizzes: QuizResult[];
  /** 每次完成的作答记录；旧数据以保留的最近成绩作为历史起点。 */
  quizAttempts: QuizResult[];
  bookmarks: string[];
  lastVisited: string;
}

const STORAGE_KEY = "ts-py-learning-progress";

/** 路径规范化：统一去掉尾部斜杠，作为进度匹配的口径 */
export function normPath(path: string): string {
  return String(path || "").replace(/\/$/, "");
}

/** localStorage 是外部输入（手改/旧版本/损坏都可能），读取时校验形状而不是盲目 cast */
function isLessonProgress(value: unknown): value is LessonProgress {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.path === "string" &&
    typeof v.title === "string" &&
    typeof v.completedAt === "string" &&
    (v.type === "lesson" || v.type === "algorithm" || v.type === "quiz")
  );
}

function isQuizResult(value: unknown): value is QuizResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.quizId === "string" &&
    typeof v.completedAt === "string" &&
    typeof v.score === "number" &&
    Number.isInteger(v.score) &&
    v.score >= 0 &&
    typeof v.total === "number" &&
    Number.isInteger(v.total) &&
    v.total > 0 &&
    v.score <= v.total &&
    typeof v.percentage === "number" &&
    Number.isFinite(v.percentage)
  );
}

function parseProgress(value: unknown): LearningProgress | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.lessons) || !Array.isArray(v.quizzes) || !Array.isArray(v.bookmarks))
    return null;
  const quizzes = v.quizzes.filter(isQuizResult);
  return {
    lessons: v.lessons.filter(isLessonProgress),
    quizzes,
    quizAttempts: Array.isArray(v.quizAttempts)
      ? v.quizAttempts.filter(isQuizResult)
      : [...quizzes],
    bookmarks: v.bookmarks.filter((path): path is string => typeof path === "string"),
    lastVisited: typeof v.lastVisited === "string" ? v.lastVisited : "",
  };
}

function emptyProgress(): LearningProgress {
  return { lessons: [], quizzes: [], quizAttempts: [], bookmarks: [], lastVisited: "" };
}

/**
 * 获取当前进度
 */
export function getProgress(): LearningProgress {
  if (typeof window === "undefined") {
    return emptyProgress();
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed: unknown = JSON.parse(data);
      const progress = parseProgress(parsed);
      if (progress) return progress;
    }
  } catch (e) {
    console.error("Failed to load progress:", e);
  }

  return emptyProgress();
}

/**
 * 保存进度
 */
export function setProgress(progress: LearningProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent("progress-updated", { detail: progress }));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

/**
 * 清除所有进度
 */
export function clearProgress(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear progress:", e);
  }
}

/**
 * 标记课程/算法为已完成
 */
export function markAsCompleted(
  path: string,
  title: string,
  type: "lesson" | "algorithm" | "quiz"
): void {
  const progress = getProgress();

  // 检查是否已存在
  const existingIndex = progress.lessons.findIndex((l) => l.path === path);
  const lesson: LessonProgress = {
    path,
    title,
    completedAt: new Date().toISOString(),
    type,
  };

  if (existingIndex >= 0) {
    progress.lessons[existingIndex] = lesson;
  } else {
    progress.lessons.push(lesson);
  }

  setProgress(progress);
}

/**
 * 检查是否已完成
 */
export function isCompleted(path: string): boolean {
  const progress = getProgress();
  return progress.lessons.some((l) => l.path === path);
}

/**
 * 保存测验结果
 */
export function saveQuizResult(quizId: string, score: number, total: number): void {
  if (
    !Number.isInteger(score) ||
    !Number.isInteger(total) ||
    total <= 0 ||
    score < 0 ||
    score > total
  )
    return;
  const progress = getProgress();
  const percentage = Math.round((score / total) * 100);

  const result: QuizResult = {
    quizId,
    score,
    total,
    percentage,
    completedAt: new Date().toISOString(),
  };

  // 检查是否已存在
  const existingIndex = progress.quizzes.findIndex((q) => q.quizId === quizId);
  if (existingIndex >= 0) {
    progress.quizzes[existingIndex] = result;
  } else {
    progress.quizzes.push(result);
  }
  progress.quizAttempts.push(result);

  setProgress(progress);
}

/**
 * 获取测验结果
 */
export function getQuizResult(quizId: string): QuizResult | null {
  const progress = getProgress();
  return progress.quizzes.find((q) => q.quizId === quizId) || null;
}

/**
 * 添加书签
 */
export function addBookmark(path: string): void {
  const progress = getProgress();
  if (!progress.bookmarks.includes(path)) {
    progress.bookmarks.push(path);
    setProgress(progress);
  }
}

/**
 * 移除书签
 */
export function removeBookmark(path: string): void {
  const progress = getProgress();
  progress.bookmarks = progress.bookmarks.filter((b) => b !== path);
  setProgress(progress);
}

/**
 * 检查是否已收藏
 */
export function isBookmarked(path: string): boolean {
  const progress = getProgress();
  return progress.bookmarks.includes(path);
}

/**
 * 获取所有书签
 */
export function getBookmarks(): string[] {
  const progress = getProgress();
  return progress.bookmarks;
}

/**
 * 更新最后访问时间
 */
export function updateLastVisited(path: string): void {
  const progress = getProgress();
  progress.lastVisited = path;
  setProgress(progress);
}

/**
 * 计算总体完成进度
 */
export function calculateOverallProgress(totalLessons: number): number {
  const progress = getProgress();
  if (totalLessons <= 0) return 0;
  const lessonPaths = new Set(allLessonRoutes().map(normPath));
  const completed = new Set(
    progress.lessons
      .filter((item) => lessonPaths.has(normPath(item.path)))
      .map((item) => normPath(item.path))
  );
  return Math.min(100, Math.round((completed.size / totalLessons) * 100));
}

/**
 * 获取完成数量统计
 */
export function getCompletionStats(): {
  totalCompleted: number;
  quizzesTaken: number;
  averageScore: number;
  bookmarksCount: number;
} {
  const progress = getProgress();

  const lessonPaths = new Set(allLessonRoutes().map(normPath));
  const totalCompleted = new Set(
    progress.lessons
      .filter((item) => item.type === "algorithm" || lessonPaths.has(normPath(item.path)))
      .map((item) => normPath(item.path))
  ).size;
  const quizzesTaken = progress.quizAttempts.length;
  const averageScore =
    progress.quizzes.length > 0
      ? Math.round(
          progress.quizzes.reduce((sum, q) => sum + q.percentage, 0) / progress.quizzes.length
        )
      : 0;
  const bookmarksCount = progress.bookmarks.length;

  return {
    totalCompleted,
    quizzesTaken,
    averageScore,
    bookmarksCount,
  };
}
