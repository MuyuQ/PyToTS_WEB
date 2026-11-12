/**
 * 主动练习自检记录。
 *
 * 与 progress-store 分开存储：课程完成度是「学到哪」，自检是「这题我到底会不会」，
 * 混在一起会让进度分母失真。只记录「我答对了」，点「再看一遍」即撤销，
 * 不做错题本、不计分、不排名——避免把练习变成刷题 KPI。
 *
 * 数据只在本机 localStorage，不上传；形状按外部输入校验。
 */

const STORAGE_KEY = "ts-py-practice-checks";

export type PracticeCheckValue = "correct";
export type PracticeChecks = Record<string, PracticeCheckValue>;

/** localStorage 是外部输入（手改、旧版本、损坏都可能），只收合法键与合法值 */
export function parseChecks(value: unknown): PracticeChecks | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const result: PracticeChecks = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (key && entry === "correct") result[key] = "correct";
  }
  return result;
}

export function getChecks(): PracticeChecks {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return parseChecks(JSON.parse(raw) as unknown) ?? {};
  } catch {
    return {};
  }
}

/** value 传 null 表示「再看一遍」，即撤销这条自检 */
export function setCheck(id: string, value: PracticeCheckValue | null): PracticeChecks {
  const checks = getChecks();
  if (value === null) delete checks[id];
  else checks[id] = value;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
      window.dispatchEvent(new CustomEvent("practice-check-updated", { detail: checks }));
    } catch {
      // 无痕模式或配额满：静默降级，不打断阅读
    }
  }
  return checks;
}

/** 某一页已答对的题数；键格式为 `${pageKey}#${index}` */
export function countCorrect(checks: PracticeChecks, pageKey: string): number {
  const prefix = `${pageKey}#`;
  return Object.keys(checks).filter((key) => key.startsWith(prefix)).length;
}

export function totalCorrect(checks: PracticeChecks): number {
  return Object.keys(checks).length;
}
