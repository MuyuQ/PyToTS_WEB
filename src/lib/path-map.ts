/**
 * 学习路径映射（兼容层）
 * ---------------------------------------------------------------------------
 * 顺序数据已上移到 src/lib/curriculum.ts，本模块保留原有导出签名，
 * 供既有调用方与测试使用。新代码请直接使用 curriculum。
 */

import { CURRICULUM, TRACK_ORDER, neighbourLesson, type TrackId } from "./curriculum";

const PATHS: Record<string, readonly string[]> = CURRICULUM;

function stepOrNull(track: string, current: string, direction: -1 | 1): string | null {
  if (!(track in PATHS)) return null;
  const step = neighbourLesson(track as TrackId, current.replace(/\/$/, ""), direction);
  return step ? `${step.track}/${step.slug}` : null;
}

/**
 * 获取下一课的路径
 * @param track 学习路径名称（preparation/foundation/migration/advanced）
 * @param current 当前课程标识
 * @returns "track/slug" 形式，没有则返回 null
 */
export function getNextPathStep(track: string, current: string): string | null {
  return stepOrNull(track, current, 1);
}

/**
 * 获取上一课的路径
 * @param track 学习路径名称
 * @param current 当前课程标识
 * @returns "track/slug" 形式，没有则返回 null
 */
export function getPrevPathStep(track: string, current: string): string | null {
  return stepOrNull(track, current, -1);
}

/** 获取某条路径的所有课程 slug */
export function getPathSteps(track: string): readonly string[] {
  return PATHS[track] ?? [];
}

/** 获取所有路径名称 */
export function getAllTracks(): readonly string[] {
  return TRACK_ORDER;
}
