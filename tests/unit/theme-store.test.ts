import { describe, it, expect } from "vitest";
import { readTheme, writeTheme } from "../../src/lib/theme-store";

describe("theme-store", () => {
  it("falls back to light when localStorage is unavailable", () => {
    expect(
      readTheme(() => {
        throw new Error("blocked");
      })
    ).toBe("light");
  });

  it("stores explicit user preference", () => {
    const memory = new Map<string, string>();
    writeTheme("dark", (k, v) => memory.set(k, v));
    expect(memory.get("site-theme")).toBe("dark");
  });
});