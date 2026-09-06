/**
 * 上一项 / 下一项计算
 * ---------------------------------------------------------------------------
 * 课程：遵循 curriculum.ts 定义的教学顺序，不跨路径。
 * 算法：Starlight 侧边栏是字母序，对刷题没有意义。这里按「难度递进，
 *       同难度内按题名」排序，让「下一题」真的是"下一道该做的题"。
 *
 * 标题统一从内容集合读取，不再维护任何手写标题映射表。
 */

import { getCollection, type CollectionEntry } from "astro:content";
import { neighbourLesson, parseLessonRoute, DIFFICULTY_ORDER, type TrackId } from "./curriculum";
import { docRoute } from "./doc-id";

export interface Neighbour {
  href: string;
  label: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

/** entry.id → 站内路由（与 Starlight 生成的路由一致） */
function routeFromId(id: string): string {
  return docRoute(id);
}

function withBase(route: string): string {
  return `${BASE}${route}`;
}

/** 剥离部署 base 前缀，得到站内路由 */
export function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length) || "/";
  }
  return pathname;
}

let lessonTitleCache: Promise<Map<string, string>> | null = null;

function lessonTitles(): Promise<Map<string, string>> {
  lessonTitleCache ??= getCollection("docs").then((entries) => {
    const map = new Map<string, string>();
    for (const entry of entries) {
      map.set(routeFromId(entry.id), entry.data.title);
    }
    return map;
  });
  return lessonTitleCache;
}

/**
 * 课程的上一课 / 下一课。
 * @param route 站内路由，形如 /paths/migration/types/（已剥离 base）
 */
export async function getLessonNeighbours(route: string): Promise<{
  prev?: Neighbour;
  next?: Neighbour;
  track?: TrackId;
}> {
  const parsed = parseLessonRoute(route);
  if (!parsed) return {};

  const titles = await lessonTitles();

  const make = (track: TrackId, slug: string): Neighbour | undefined => {
    const target = `/paths/${track}/${slug === "index" ? "" : slug + "/"}`;
    const label = titles.get(target);
    if (!label) return undefined;
    return { href: withBase(target), label };
  };

  const prevStep = neighbourLesson(parsed.track, parsed.slug, -1);
  const nextStep = neighbourLesson(parsed.track, parsed.slug, 1);

  return {
    prev: prevStep ? make(prevStep.track, prevStep.slug) : undefined,
    next: nextStep ? make(nextStep.track, nextStep.slug) : undefined,
    track: parsed.track,
  };
}

interface AlgorithmEntry {
  route: string;
  title: string;
  difficulty: string;
}

let algorithmEntriesCache: Promise<AlgorithmEntry[]> | null = null;

/** 算法题，按「难度递进 → 题名」排序 */
function algorithmEntries(): Promise<AlgorithmEntry[]> {
  algorithmEntriesCache ??= getCollection("docs").then((entries) => {
    return entries
      .filter(
        (entry: CollectionEntry<"docs">) =>
          entry.id.startsWith("algorithms/") && entry.data.kind === "algorithm"
      )
      .sort((a, b) => {
        const rank = (entry: CollectionEntry<"docs">) => {
          const index = DIFFICULTY_ORDER.findIndex((d) => d === entry.data.difficulty);
          return index === -1 ? DIFFICULTY_ORDER.length : index;
        };
        return rank(a) - rank(b) || a.data.title.localeCompare(b.data.title, "zh-Hans-CN");
      })
      .map((entry) => ({
        route: routeFromId(entry.id),
        title: entry.data.title,
        difficulty: entry.data.difficulty ?? "",
      }));
  });
  return algorithmEntriesCache;
}

/** 算法题按「难度递进 → 题名」排序后的路由序列 */
async function algorithmSequence(): Promise<string[]> {
  const entries = await algorithmEntries();
  return entries.map((entry) => entry.route);
}

/**
 * 与指定题目同难度的其他题（不含自己）
 *
 * 「下一题」是顺着难度序列往前走，但刷题的人常想在同一档里多练几道再升级。
 * 这里给的是同档内的横向选择，两者互补。
 *
 * @param route 站内路由，形如 /algorithms/two-sum/
 * @param limit 返回条数
 */
export async function getSimilarAlgorithms(route: string, limit = 4): Promise<Neighbour[]> {
  const entries = await algorithmEntries();
  const current = entries.find((entry) => entry.route === route);
  if (!current?.difficulty) return [];

  return entries
    .filter((entry) => entry.route !== route && entry.difficulty === current.difficulty)
    .slice(0, limit)
    .map((entry) => ({ href: withBase(entry.route), label: entry.title }));
}

/**
 * 算法题的上一题 / 下一题。
 * @param route 站内路由，形如 /algorithms/two-sum/
 */
export async function getAlgorithmNeighbours(
  route: string
): Promise<{ prev?: Neighbour; next?: Neighbour }> {
  const sequence = await algorithmSequence();
  const index = sequence.indexOf(route);
  if (index === -1) return {};

  const titles = await lessonTitles();
  const make = (target: string): Neighbour | undefined => {
    const label = titles.get(target);
    if (!label) return undefined;
    return { href: withBase(target), label };
  };

  return {
    prev: index > 0 ? make(sequence[index - 1]) : undefined,
    next: index < sequence.length - 1 ? make(sequence[index + 1]) : undefined,
  };
}
