export type Theme = "light" | "dark";

export function readTheme(getItem: (key: string) => string | null): Theme {
  try {
    const value = getItem("site-theme");
    return value === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function writeTheme(theme: Theme, setItem: (k: string, v: string) => void): void {
  setItem("site-theme", theme);
}