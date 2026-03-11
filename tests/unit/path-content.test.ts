import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";

describe("learning path content", () => {
  it("includes required foundation lessons", () => {
    const foundationLessons = [
      "src/content/docs/paths/foundation/variables.mdx",
      "src/content/docs/paths/foundation/control-flow.mdx",
      "src/content/docs/paths/foundation/data-structures.mdx",
      "src/content/docs/paths/foundation/functions-basics.mdx",
      "src/content/docs/paths/foundation/classes-objects.mdx",
    ];

    for (const filePath of foundationLessons) {
      expect(existsSync(filePath), `${filePath} should exist`).toBe(true);
    }
  });

  it("keeps foundation lesson section structure", () => {
    const requiredSections = [
      "## 场景与问题",
      "## Python 回顾",
      "## TypeScript 等价写法",
      "## 差异与常见陷阱",
      "## 优势对比",
      "## 练习",
      "## 面试追问",
    ];

    const foundationLessons = [
      "src/content/docs/paths/foundation/variables.mdx",
      "src/content/docs/paths/foundation/control-flow.mdx",
      "src/content/docs/paths/foundation/data-structures.mdx",
      "src/content/docs/paths/foundation/functions-basics.mdx",
      "src/content/docs/paths/foundation/classes-objects.mdx",
    ];

    for (const filePath of foundationLessons) {
      const content = readFileSync(filePath, "utf8");
      for (const section of requiredSections) {
        expect(content.includes(section), `${filePath} missing section: ${section}`).toBe(true);
      }
    }
  });

  it("includes required advanced lessons", () => {
    const advancedLessons = [
      "src/content/docs/paths/advanced/generics.mdx",
      "src/content/docs/paths/advanced/type-guards.mdx",
      "src/content/docs/paths/advanced/decorators.mdx",
      "src/content/docs/paths/advanced/design-patterns.mdx",
    ];

    for (const filePath of advancedLessons) {
      expect(existsSync(filePath), `${filePath} should exist`).toBe(true);
      const content = readFileSync(filePath, "utf8");
      expect(content.includes("## 场景与问题"), `${filePath} missing context section`).toBe(true);
      expect(content.includes("## 面试追问"), `${filePath} missing interview section`).toBe(true);
    }
  });
});
