const PATHS: Record<string, string[]> = {
  migration: ["types", "functions", "async", "modules"],
  foundation: ["basics", "types-intro", "functions", "interfaces"],
  advanced: ["generics", "patterns", "engineering", "interview"],
};

export function getNextPathStep(track: string, current: string): string | null {
  const steps = PATHS[track] ?? [];
  const index = steps.indexOf(current);
  if (index === -1 || index === steps.length - 1) return null;
  return `${track}/${steps[index + 1]}`;
}

export function getPrevPathStep(track: string, current: string): string | null {
  const steps = PATHS[track] ?? [];
  const index = steps.indexOf(current);
  if (index <= 0) return null;
  return `${track}/${steps[index - 1]}`;
}