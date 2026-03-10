# Python to TypeScript Learning Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and ship a static, modern Astro + Starlight learning site that teaches TypeScript to Python users with side-by-side language comparisons and an algorithm track.

**Architecture:** Use a content-first static architecture (Markdown/MDX + typed frontmatter schema + reusable comparison components). Keep runtime logic minimal (theme + local progress only), push validation to build/test time, and deploy via GitHub Actions to GitHub Pages.

**Tech Stack:** Astro, Starlight, TypeScript, Vitest, Playwright, ESLint, Prettier, GitHub Actions, GitHub Pages.

---

Use these skills while executing:

- `@test-driven-development`
- `@verification-before-completion`
- `@systematic-debugging` (only if tests fail unexpectedly)

Execution rules:

1. DRY and YAGNI only.
2. One functional slice per commit.
3. Do not start next task until current task tests pass.
4. Always run at least one single-test command before full test suite.

### Task 1: Bootstrap Astro + Starlight Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/content/docs/index.mdx`
- Create: `src/styles/tokens.css`

**Step 1: Write the failing test**

Run: `npm run build`

Expected: FAIL with `Missing script: "build"`

**Step 2: Run test to verify it fails**

Run: `npm run build`

Expected: same failure as Step 1.

**Step 3: Write minimal implementation**

```json
{
  "name": "typescript-python-web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/starlight": "^0.30.0",
    "astro": "^5.0.0"
  }
}
```

```js
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://<github-username>.github.io",
  integrations: [
    starlight({
      title: "Python to TypeScript",
      customCss: ["./src/styles/tokens.css"],
    }),
  ],
});
```

**Step 4: Run test to verify it passes**

Run: `npm install && npm run build`

Expected: PASS with generated `dist/` output.

**Step 5: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/content/docs/index.mdx src/styles/tokens.css
git commit -m "chore: bootstrap astro starlight project"
```

### Task 2: Add Lint, Format, Typecheck, and Test Tooling

**Files:**
- Modify: `package.json`
- Create: `eslint.config.mjs`
- Create: `.prettierrc.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/sanity.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";

describe("sanity", () => {
  it("runs test runner", () => {
    expect(1 + 1).toBe(2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/sanity.test.ts`

Expected: FAIL with `Missing script: "test"`.

**Step 3: Write minimal implementation**

Add scripts:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "format": "prettier --check .",
    "typecheck": "astro check",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "check": "npm run lint && npm run typecheck && npm run test && npm run build"
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/sanity.test.ts`

Expected: PASS (1 test passed).

**Step 5: Commit**

```bash
git add package.json eslint.config.mjs .prettierrc.json vitest.config.ts playwright.config.ts tests/unit/sanity.test.ts
git commit -m "chore: add lint typecheck and test tooling"
```

### Task 3: Enforce Frontmatter Schema for Lessons and Algorithms

**Files:**
- Create: `src/lib/frontmatter-schema.ts`
- Create: `src/content.config.ts`
- Create: `tests/unit/frontmatter-schema.test.ts`

**Step 1: Write the failing test**

```ts
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
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/frontmatter-schema.test.ts -t "rejects missing difficulty"`

Expected: FAIL with module-not-found for `frontmatter-schema`.

**Step 3: Write minimal implementation**

```ts
import { z } from "astro:content";

export const lessonSchema = z.object({
  title: z.string(),
  level: z.enum(["foundation", "migration", "advanced"]),
  topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  prerequisites: z.array(z.string()).default([]),
  python_tags: z.array(z.string()).default([]),
  ts_tags: z.array(z.string()).default([]),
});
```

```ts
import { defineCollection } from "astro:content";
import { lessonSchema } from "./lib/frontmatter-schema";

const docs = defineCollection({
  type: "content",
  schema: lessonSchema,
});

export const collections = { docs };
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/frontmatter-schema.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/frontmatter-schema.ts src/content.config.ts tests/unit/frontmatter-schema.test.ts
git commit -m "feat(content): enforce frontmatter schema"
```

### Task 4: Build Information Architecture and Navigation Shell

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/content/docs/paths/index.mdx`
- Create: `src/content/docs/handbook/index.mdx`
- Create: `src/content/docs/algorithms/index.mdx`
- Create: `src/content/docs/practice/index.mdx`
- Create: `src/content/docs/about/index.mdx`
- Test: `tests/e2e/navigation.spec.ts`

**Step 1: Write the failing test**

```ts
import { test, expect } from "@playwright/test";

test("top nav routes are reachable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Learning Paths" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Algorithms" })).toBeVisible();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/navigation.spec.ts`

Expected: FAIL because links/pages are not yet configured.

**Step 3: Write minimal implementation**

Add Starlight sidebar and nav config to `astro.config.mjs` and create index pages for each section.

**Step 4: Run test to verify it passes**

Run: `npm run build && npm run test:e2e -- tests/e2e/navigation.spec.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add astro.config.mjs src/content/docs/paths/index.mdx src/content/docs/handbook/index.mdx src/content/docs/algorithms/index.mdx src/content/docs/practice/index.mdx src/content/docs/about/index.mdx tests/e2e/navigation.spec.ts
git commit -m "feat(site): add mvp navigation structure"
```

### Task 5: Implement Theme Tokens and Theme Persistence

**Files:**
- Modify: `src/styles/tokens.css`
- Create: `src/lib/theme-store.ts`
- Create: `src/components/ThemeToggle.astro`
- Test: `tests/unit/theme-store.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { readTheme, writeTheme } from "../../src/lib/theme-store";

describe("theme-store", () => {
  it("falls back to light when localStorage is unavailable", () => {
    expect(readTheme(() => {
      throw new Error("blocked");
    })).toBe("light");
  });

  it("stores explicit user preference", () => {
    const memory = new Map<string, string>();
    writeTheme("dark", (k, v) => memory.set(k, v));
    expect(memory.get("site-theme")).toBe("dark");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/theme-store.test.ts`

Expected: FAIL with missing `theme-store` module.

**Step 3: Write minimal implementation**

```ts
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
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/theme-store.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/styles/tokens.css src/lib/theme-store.ts src/components/ThemeToggle.astro tests/unit/theme-store.test.ts
git commit -m "feat(theme): add light-dark tokens and persistence"
```

### Task 6: Implement `DualCodeBlock` for Python ↔ TypeScript Comparison

**Files:**
- Create: `src/lib/code-example.ts`
- Create: `src/components/DualCodeBlock.astro`
- Test: `tests/unit/code-example.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { normalizeDualCodeInput } from "../../src/lib/code-example";

describe("normalizeDualCodeInput", () => {
  it("requires both python and typescript blocks", () => {
    expect(() =>
      normalizeDualCodeInput({
        python: "print('ok')",
        typescript: "",
      }),
    ).toThrow(/typescript/i);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/code-example.test.ts -t "requires both python and typescript blocks"`

Expected: FAIL due to missing module.

**Step 3: Write minimal implementation**

```ts
export function normalizeDualCodeInput(input: { python: string; typescript: string }) {
  if (!input.python.trim()) throw new Error("python block is required");
  if (!input.typescript.trim()) throw new Error("typescript block is required");
  return input;
}
```

Use this helper in `DualCodeBlock.astro` props validation before rendering.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/code-example.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/code-example.ts src/components/DualCodeBlock.astro tests/unit/code-example.test.ts
git commit -m "feat(components): add bilingual dual code block"
```

### Task 7: Implement `DiffInsight` and `PathNavigator` Components

**Files:**
- Create: `src/lib/path-map.ts`
- Create: `src/components/DiffInsight.astro`
- Create: `src/components/PathNavigator.astro`
- Test: `tests/unit/path-map.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { getNextPathStep } from "../../src/lib/path-map";

describe("getNextPathStep", () => {
  it("returns next lesson slug in same track", () => {
    expect(getNextPathStep("migration", "functions")).toBe("migration/async");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/path-map.test.ts`

Expected: FAIL with missing module.

**Step 3: Write minimal implementation**

```ts
const PATHS: Record<string, string[]> = {
  migration: ["types", "functions", "async", "modules"],
};

export function getNextPathStep(track: string, current: string): string | null {
  const steps = PATHS[track] ?? [];
  const index = steps.indexOf(current);
  if (index === -1 || index === steps.length - 1) return null;
  return `${track}/${steps[index + 1]}`;
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/path-map.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/path-map.ts src/components/DiffInsight.astro src/components/PathNavigator.astro tests/unit/path-map.test.ts
git commit -m "feat(components): add diff insight and path navigator"
```

### Task 8: Add Lesson Template and Core Migration Lessons

**Files:**
- Create: `src/layouts/LessonLayout.astro`
- Create: `src/content/docs/paths/migration/types.mdx`
- Create: `src/content/docs/paths/migration/functions.mdx`
- Create: `src/content/docs/paths/migration/async.mdx`
- Create: `src/content/docs/paths/migration/modules.mdx`
- Test: `tests/unit/lesson-structure.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("lesson structure", () => {
  it("contains both Python and TypeScript sections", () => {
    const content = readFileSync("src/content/docs/paths/migration/functions.mdx", "utf8");
    expect(content).toMatch(/## Python/);
    expect(content).toMatch(/## TypeScript/);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/lesson-structure.test.ts`

Expected: FAIL because lesson files do not exist yet.

**Step 3: Write minimal implementation**

Create each migration lesson with the required 7-section structure and include `DualCodeBlock` usage.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/lesson-structure.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/layouts/LessonLayout.astro src/content/docs/paths/migration/types.mdx src/content/docs/paths/migration/functions.mdx src/content/docs/paths/migration/async.mdx src/content/docs/paths/migration/modules.mdx tests/unit/lesson-structure.test.ts
git commit -m "feat(content): add core migration lessons"
```

### Task 9: Add Algorithm Template and First Problem Set

**Files:**
- Create: `src/layouts/AlgorithmLayout.astro`
- Create: `src/content/docs/algorithms/two-sum.mdx`
- Create: `src/content/docs/algorithms/binary-search.mdx`
- Create: `src/content/docs/algorithms/merge-intervals.mdx`
- Create: `src/content/docs/algorithms/linked-list-cycle.mdx`
- Test: `tests/unit/algorithm-structure.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("algorithm docs", () => {
  it("includes complexity and bilingual implementations", () => {
    const content = readFileSync("src/content/docs/algorithms/two-sum.mdx", "utf8");
    expect(content).toMatch(/## Complexity/);
    expect(content).toMatch(/## Python Implementation/);
    expect(content).toMatch(/## TypeScript Implementation/);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/algorithm-structure.test.ts`

Expected: FAIL because files do not exist.

**Step 3: Write minimal implementation**

Create `AlgorithmLayout.astro` and seed the first four algorithm pages with required 8-section template.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/algorithm-structure.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/layouts/AlgorithmLayout.astro src/content/docs/algorithms/two-sum.mdx src/content/docs/algorithms/binary-search.mdx src/content/docs/algorithms/merge-intervals.mdx src/content/docs/algorithms/linked-list-cycle.mdx tests/unit/algorithm-structure.test.ts
git commit -m "feat(algo): add initial bilingual algorithm set"
```

### Task 10: Add Static Search and Taxonomy Pages

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/content/docs/tags/index.mdx`
- Create: `src/content/docs/difficulty/index.mdx`
- Test: `tests/e2e/search-and-filter.spec.ts`

**Step 1: Write the failing test**

```ts
import { test, expect } from "@playwright/test";

test("search and taxonomy pages load", async ({ page }) => {
  await page.goto("/tags/");
  await expect(page.getByRole("heading", { name: /tags/i })).toBeVisible();
  await page.goto("/difficulty/");
  await expect(page.getByRole("heading", { name: /difficulty/i })).toBeVisible();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/search-and-filter.spec.ts`

Expected: FAIL due to missing pages.

**Step 3: Write minimal implementation**

Configure Starlight search and create taxonomy index pages that link to docs by tag/difficulty.

**Step 4: Run test to verify it passes**

Run: `npm run build && npm run test:e2e -- tests/e2e/search-and-filter.spec.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add astro.config.mjs src/content/docs/tags/index.mdx src/content/docs/difficulty/index.mdx tests/e2e/search-and-filter.spec.ts
git commit -m "feat(site): add search and taxonomy index pages"
```

### Task 11: Add CI + GitHub Pages Deployment Workflows

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `README.md`

**Step 1: Write the failing test**

Run: `npm run check`

Expected: FAIL at least once before workflows and docs are aligned.

**Step 2: Run test to verify it fails**

Run: `npm run check`

Expected: confirms current failure reason.

**Step 3: Write minimal implementation**

Add:

- CI workflow for `lint`, `typecheck`, `test`, `build`
- Pages deployment workflow on `main`
- README with local commands and release pipeline

**Step 4: Run test to verify it passes**

Run: `npm run check`

Expected: PASS locally.

**Step 5: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/deploy-pages.yml README.md
git commit -m "ci: add validation and github pages deployment"
```

### Task 12: Add Final Quality Checklist and Contribution Rules

**Files:**
- Create: `CONTRIBUTING.md`
- Modify: `README.md`
- Modify: `docs/plans/2026-03-11-python-to-typescript-learning-site-design.md`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("contribution guardrails", () => {
  it("documents commit-per-slice rule", () => {
    const content = readFileSync("CONTRIBUTING.md", "utf8");
    expect(content).toMatch(/commit immediately after each completed slice/i);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/contribution-rules.test.ts`

Expected: FAIL because file/test does not exist.

**Step 3: Write minimal implementation**

Create `tests/unit/contribution-rules.test.ts` and `CONTRIBUTING.md` with:

- branch + PR flow
- required checks
- mandatory frequent local commit rule
- content template standards

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/contribution-rules.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add CONTRIBUTING.md README.md docs/plans/2026-03-11-python-to-typescript-learning-site-design.md tests/unit/contribution-rules.test.ts
git commit -m "docs: add contribution and quality checklist"
```

## Verification Sequence (Run before each merge)

1. `npm run test -- tests/unit/<single-test-file>.test.ts`
2. `npm run test:e2e -- tests/e2e/<single-spec>.spec.ts`
3. `npm run lint`
4. `npm run typecheck`
5. `npm run test`
6. `npm run build`
7. `npm run check`

## Definition of Done for MVP

- All required docs sections exist and pass schema checks.
- Core migration lessons are live and navigable.
- Algorithm pages include bilingual code + complexity + interview variants.
- Light/dark mode works and persists safely.
- CI is green and Pages deploy is reproducible.
- Commit history is atomic and follows commit-per-slice rule.
