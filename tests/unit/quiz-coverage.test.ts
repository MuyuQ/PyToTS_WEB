import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

function countQuestions(block: string): number {
  return (block.match(/question:\s*"/g) ?? []).length;
}

describe("quiz coverage", () => {
  it("includes three quiz categories", () => {
    const content = readFileSync("src/components/QuizContainer.astro", "utf8");

    expect(content.includes("types: [")).toBe(true);
    expect(content.includes("functions: [")).toBe(true);
    expect(content.includes("async: [")).toBe(true);
  });

  it("contains enough questions per category", () => {
    const content = readFileSync("src/components/QuizContainer.astro", "utf8");

    const typesBlock = content.match(/types:\s*\[(.*?)\],\s*functions:/s)?.[1] ?? "";
    const functionsBlock = content.match(/functions:\s*\[(.*?)\],\s*async:/s)?.[1] ?? "";
    const asyncBlock = content.match(/async:\s*\[(.*?)\]\s*};/s)?.[1] ?? "";

    expect(countQuestions(typesBlock)).toBeGreaterThanOrEqual(5);
    expect(countQuestions(functionsBlock)).toBeGreaterThanOrEqual(5);
    expect(countQuestions(asyncBlock)).toBeGreaterThanOrEqual(5);
  });
});
