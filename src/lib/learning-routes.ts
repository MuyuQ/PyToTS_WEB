/**
 * 学习内容路由表（不含 base 前缀）
 *
 * 「继续学习」「访问记录」都要一份「路由 → 标题」映射，放在同一处计算，
 * 避免两处各自遍历内容集合、算法不一致。
 */
import { getCollection } from "astro:content";
import { allLessonRoutes } from "./curriculum";
import { docRoute } from "./doc-id";

export interface LearningRoute {
  /** 不带 base 的站内路由，如 /paths/foundation/variables/ */
  route: string;
  title: string;
  kind: "lesson" | "algorithm";
}

/** entry.id 保留扩展名（paths/foundation/variables.mdx），归一为路由 */
export function routeOfId(id: string): string {
  return docRoute(id);
}

/**
 * 全部学习内容（课程 + 算法），按路由排序。
 * 首页、书签、手册这类工具页不在内——「继续学习」应该指回内容，不是指回工具。
 */
export async function learningRoutes(): Promise<LearningRoute[]> {
  const docs = await getCollection("docs");
  // 只有课程页在册的条目才算课程内容，避免把草稿或孤儿页记成学习进度
  const lessonRoutes = new Set(allLessonRoutes());

  return docs
    .filter((entry) => {
      const route = routeOfId(entry.id);
      return entry.data.kind === "algorithm" || lessonRoutes.has(route);
    })
    .map((entry) => ({
      route: routeOfId(entry.id),
      title: entry.data.title,
      kind: (entry.data.kind === "algorithm" ? "algorithm" : "lesson") as "lesson" | "algorithm",
    }))
    .sort((a, b) => a.route.localeCompare(b.route));
}
