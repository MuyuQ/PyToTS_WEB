/**
 * 学习路径映射
 * 定义每条学习路径的课程顺序，用于导航（上一课/下一课）
 */

const PATHS: Record<string, string[]> = {
  // 准备路径（新增）
  preparation: ["index", "typescript-intro", "setup"],
  // 基础路径：5 个课程
  foundation: [
    "variables",
    "functions-basics",
    "control-flow",
    "data-structures",
    "classes-objects",
  ],
  // 迁移路径：7 个课程
  migration: ["types", "functions", "modules", "async", "error-handling", "enums", "strings-regex"],
  // 进阶路径：8 个课程
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

/**
 * 获取下一课的路径
 * @param track 学习路径名称（foundation/migration/advanced/preparation）
 * @param current 当前课程标识
 * @returns 下一课的完整路径，如果没有则返回 null
 */
export function getNextPathStep(track: string, current: string): string | null {
  const steps = PATHS[track] ?? [];
  // 处理带有斜杠的路径（如 "variables/" 或 "types/"）
  const normalizedCurrent = current.replace(/\/$/, "");
  const index = steps.indexOf(normalizedCurrent);
  if (index === -1 || index === steps.length - 1) return null;
  return `${track}/${steps[index + 1]}`;
}

/**
 * 获取上一课的路径
 * @param track 学习路径名称（foundation/migration/advanced/preparation）
 * @param current 当前课程标识
 * @returns 上一课的完整路径，如果没有则返回 null
 */
export function getPrevPathStep(track: string, current: string): string | null {
  const steps = PATHS[track] ?? [];
  // 处理带有斜杠的路径
  const normalizedCurrent = current.replace(/\/$/, "");
  const index = steps.indexOf(normalizedCurrent);
  if (index <= 0) return null;
  return `${track}/${steps[index - 1]}`;
}

/**
 * 获取某条路径的所有课程
 * @param track 学习路径名称
 * @returns 课程标识数组
 */
export function getPathSteps(track: string): string[] {
  return PATHS[track] ?? [];
}

/**
 * 获取所有路径名称
 * @returns 路径名称数组
 */
export function getAllTracks(): string[] {
  return Object.keys(PATHS);
}
