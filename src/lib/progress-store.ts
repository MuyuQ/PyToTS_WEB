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
 * 合并两份进度（导出/导入的备份恢复）：
 * 课程与测验按 path/quizId 去重，completedAt 更新的一方胜出；收藏取并集。
 */
export function mergeLearningProgress(
  current: LearningProgress,
  incoming: LearningProgress
): LearningProgress {
  const lessons = new Map(current.lessons.map((l) => [normPath(l.path), l]));
  for (const lesson of incoming.lessons) {
    const key = normPath(lesson.path);
    const existing = lessons.get(key);
    if (!existing || existing.completedAt < lesson.completedAt) {
      lessons.set(key, { ...lesson, path: key });
    }
  }

  const quizzes = new Map(current.quizzes.map((q) => [q.quizId, q]));
  for (const quiz of incoming.quizzes) {
    const existing = quizzes.get(quiz.quizId);
    if (!existing || existing.completedAt < quiz.completedAt) {
      quizzes.set(quiz.quizId, quiz);
    }
  }

  // 作答历史取并集：quizId + completedAt + score 相同的重复记录只留一条
  const attemptKey = (attempt: QuizResult) =>
    `${attempt.quizId}\u0000${attempt.completedAt}\u0000${attempt.score}`;
  const attempts = new Map(current.quizAttempts.map((a) => [attemptKey(a), a]));
  for (const attempt of incoming.quizAttempts) {
    attempts.set(attemptKey(attempt), attempt);
  }

  return {
    lessons: [...lessons.values()],
    quizzes: [...quizzes.values()],
    quizAttempts: [...attempts.values()],
    bookmarks: [...new Set([...current.bookmarks, ...incoming.bookmarks])],
    // 当前设备已有学习记录时不覆盖"继续学习"的落点
    lastVisited: current.lastVisited || incoming.lastVisited,
  };
}

/** 解析导入文件文本：形状不合格返回 null，调用方据此提示而不是盲目写入 */
export function parseProgressBlob(text: string): LearningProgress | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return parseProgress(parsed);
  } catch {
    return null;
  }
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
