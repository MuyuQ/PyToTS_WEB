/**
 * 课程结构单一数据源
 * ---------------------------------------------------------------------------
 * 重构前，课程顺序被硬编码在 4 个地方且互相矛盾：
 *   - src/lib/path-map.ts              （分页用）
 *   - src/components/SidebarProgress.astro   （侧边栏进度点用，含 36 题全量）
 *   - src/components/LessonProgressMarkers.astro（正文链接进度用，foundation 顺序还不一致）
 *   - src/components/Pagination.astro  （标题映射表）
 *
 * 现在顺序只在这里定义一次，上述四处全部从本模块派生。
 * 新增/调整课程只需改 CURRICULUM 与内容目录，其余自动跟随。
 */

export const TRACK_ORDER = ["preparation", "foundation", "migration", "advanced"] as const;

export type TrackId = (typeof TRACK_ORDER)[number];

export interface TrackMeta {
  id: TrackId;
  /** 侧边栏与导航上的短名 */
  label: string;
  /** 卡片/列表上的一句话说明 */
  summary: string;
  /** 面向读者的一句话定位 */
  pitch: string;
}

export const TRACKS: Record<TrackId, TrackMeta> = {
  preparation: {
    id: "preparation",
    label: "准备",
    summary: "环境就绪，建立第一印象",
    pitch: "TypeScript 是什么、和 JavaScript 什么关系，以及五分钟能跑起来的环境。",
  },
  foundation: {
    id: "foundation",
    label: "基础",
    summary: "建立 TypeScript 核心概念",
    pitch: "变量、函数、控制流、数据结构与类，先把语言本身用顺。",
  },
  migration: {
    id: "migration",
    label: "迁移",
    summary: "Python 心智模型映射到 TypeScript",
    pitch: "类型系统、异步、错误处理、模块与正则，专治「Python 里我明明会写」。",
  },
  advanced: {
    id: "advanced",
    label: "进阶",
    summary: "工程实践与面试准备",
    pitch: "泛型、类型守卫、工具类型、装饰器、设计模式与 Node.js。",
  },
};

/**
 * 每条路径的课程顺序（slug 列表，不含 /paths/<track>/ 前缀）。
 * "index" 表示该路径的入口页本身。
 */
export const CURRICULUM: Record<TrackId, readonly string[]> = {
  preparation: ["index", "typescript-intro", "setup"],
  foundation: [
    "variables",
    "functions-basics",
    "control-flow",
    "data-structures",
    "classes-objects",
  ],
  migration: ["types", "functions", "modules", "async", "error-handling", "enums", "strings-regex"],
  advanced: [
    "generics",
    "type-guards",
    "utility-types",
    "declarations-config",
    "decorators",
    "design-patterns",
    "datetime",
    "nodejs-basics",
  ],
};

/** 难度中文标签（DifficultyBadge 与索引页共用） */
export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "入门",
  medium: "进阶",
  hard: "高阶",
};

export const DIFFICULTY_ORDER = ["easy", "medium", "hard"] as const;

export function isTrack(value: string): value is TrackId {
  return (TRACK_ORDER as readonly string[]).includes(value);
}

/** slug → 站内路由（不含部署 base 前缀） */
export function lessonRoute(track: TrackId, slug: string): string {
  return slug === "index" ? `/paths/${track}/` : `/paths/${track}/${slug}/`;
}

/** 某条路径的全部课程路由，按教学顺序 */
export function trackRoutes(track: TrackId): string[] {
  return CURRICULUM[track].map((slug) => lessonRoute(track, slug));
}

/** 全部课程路由（不含算法题），按 准备 → 基础 → 迁移 → 进阶 */
export function allLessonRoutes(): string[] {
  return TRACK_ORDER.flatMap((track) => trackRoutes(track));
}

/** 每条路径的课程数（index 入口页不计入课时） */
export function trackLessonCount(track: TrackId): number {
  return CURRICULUM[track].filter((slug) => slug !== "index").length;
}

export function totalLessonCount(): number {
  return TRACK_ORDER.reduce((sum, track) => sum + trackLessonCount(track), 0);
}

/**
 * 解析 /paths/<track>/<slug>/ 形式的路由。
 * 传入的路由应当已经剥离部署 base 前缀。
 */
export function parseLessonRoute(
  route: string
): { track: TrackId; slug: string; index: number } | null {
  const match = route.match(/^\/paths\/(preparation|foundation|migration|advanced)\/([^/]*)\/?$/);
  if (!match) return null;

  const track = match[1] as TrackId;
  const rawSlug = match[2];
  const slug = rawSlug === "" ? "index" : rawSlug;
  const index = CURRICULUM[track].indexOf(slug);
  if (index === -1) return null;

  return { track, slug, index };
}

/** 同一条路径内的上一课 / 下一课（不跨路径） */
export function neighbourLesson(
  track: TrackId,
  currentSlug: string,
  direction: -1 | 1
): { track: TrackId; slug: string; route: string } | null {
  const steps = CURRICULUM[track];
  const index = steps.indexOf(currentSlug);
  if (index === -1) return null;

  const target = steps[index + direction];
  if (!target) return null;

  return { track, slug: target, route: lessonRoute(track, target) };
}
