import { describe, it, expect } from "vitest";
import { detectTheme, applyTheme } from "../../../src/lib/theme-detector";

describe("theme-detector", () => {
  it("detects system preference for dark mode", () => {
    const mockMatchMedia = (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    const theme = detectTheme(mockMatchMedia as any);
    expect(theme).toBe("dark");
  });

  it("detects system preference for light mode", () => {
    const mockMatchMedia = (query: string) => ({
      matches: query === "(prefers-color-scheme: light)",
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    const theme = detectTheme(mockMatchMedia as any);
    expect(theme).toBe("light");
  });

  it("respects user override from localStorage", () => {
    const mockMatchMedia = (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    const mockStorage: Record<string, string> = { "site-theme": "light" };
    const mockGetItem = (key: string) => mockStorage[key] || null;

    const theme = detectTheme(mockMatchMedia as any, mockGetItem);
    expect(theme).toBe("light");
  });
});
