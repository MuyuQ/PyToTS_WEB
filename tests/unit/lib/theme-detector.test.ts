import { describe, it, expect } from "vitest";
import { detectTheme } from "../../../src/lib/theme-detector";

type MockMatchMedia = (query: string) => {
  matches: boolean;
  addEventListener: () => void;
  removeEventListener: () => void;
};

describe("theme-detector", () => {
  it("detects system preference for dark mode", () => {
    const mockMatchMedia: MockMatchMedia = (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    const theme = detectTheme(mockMatchMedia as typeof window.matchMedia);
    expect(theme).toBe("dark");
  });

  it("detects system preference for light mode", () => {
    const mockMatchMedia: MockMatchMedia = () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    const theme = detectTheme(mockMatchMedia as typeof window.matchMedia);
    expect(theme).toBe("light");
  });

  it("respects user override from localStorage", () => {
    const mockMatchMedia: MockMatchMedia = (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    const mockStorage: Record<string, string> = { "site-theme": "light" };
    const mockGetItem = (key: string) => mockStorage[key] || null;

    const theme = detectTheme(mockMatchMedia as typeof window.matchMedia, mockGetItem);
    expect(theme).toBe("light");
  });
});
