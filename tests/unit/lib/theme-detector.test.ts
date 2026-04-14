import { describe, it, expect } from "vitest";
import { detectTheme } from "../../../src/lib/theme-detector";

function createMockMatchMedia(matches: boolean): typeof window.matchMedia {
  return (() => ({
    matches,
    media: '',
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe("theme-detector", () => {
  it("detects system preference for dark mode", () => {
    const mockMatchMedia = createMockMatchMedia(true);

    const theme = detectTheme(mockMatchMedia);
    expect(theme).toBe("dark");
  });

  it("detects system preference for light mode", () => {
    const mockMatchMedia = createMockMatchMedia(false);

    const theme = detectTheme(mockMatchMedia);
    expect(theme).toBe("light");
  });

  it("respects user override from localStorage", () => {
    const mockMatchMedia = createMockMatchMedia(true);
    const mockStorage: Record<string, string> = { "site-theme": "light" };
    const mockGetItem = (key: string) => mockStorage[key] || null;

    const theme = detectTheme(mockMatchMedia, mockGetItem);
    expect(theme).toBe("light");
  });
});
