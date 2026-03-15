import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock Astro's view transitions
declare global {
  interface Window {
    astroViewTransitions?: {
      supportsViewTransitions: boolean;
    };
  }
}

// Setup jsdom environment
Object.defineProperty(window, "astroViewTransitions", {
  writable: true,
  value: { supportsViewTransitions: false },
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Suppress console errors during tests
const originalError = console.error;
console.error = (...args: unknown[]) => {
  // Filter out expected errors in test environment
  const message = String(args[0]);
  if (
    message.includes("not implemented in jsdom") ||
    message.includes("Could not parse CSS stylesheet")
  ) {
    return;
  }
  originalError(...args);
};
