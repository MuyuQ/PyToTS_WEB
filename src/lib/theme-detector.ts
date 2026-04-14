export type Theme = "light" | "dark" | "high-contrast" | "sepia";

export function detectTheme(
  matchMedia: typeof window.matchMedia = window.matchMedia,
  getItem: (key: string) => string | null = (key) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  }
): Theme {
  // Check user override first
  const userTheme = getItem("site-theme");
  if (userTheme && ["light", "dark", "high-contrast", "sepia"].includes(userTheme)) {
    return userTheme as Theme;
  }

  // Fall back to system preference
  if (matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function initThemeDetector(): void {
  if (typeof window === "undefined") return;

  const theme = detectTheme();
  applyTheme(theme);

  // Listen for system preference changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    // Only auto-switch if user hasn't set a preference
    const userTheme = localStorage.getItem("site-theme");
    if (!userTheme) {
      const newTheme = mediaQuery.matches ? "dark" : "light";
      applyTheme(newTheme);
    }
  };

  mediaQuery.addEventListener("change", handleChange);

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    mediaQuery.removeEventListener("change", handleChange);
  });
}
