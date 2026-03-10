import { describe, it, expect } from "vitest";
import { lessonSchema } from "../../src/lib/frontmatter-schema";

describe("lessonSchema", () => {
  it("rejects missing difficulty", () => {
    const result = lessonSchema.safeParse({
      title: "Functions in TS",
      level: "migration",
      topic: "functions",
    });
    expect(result.success).toBe(false);
  });
});