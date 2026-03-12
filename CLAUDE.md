# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
npm run dev              # Start Astro dev server (port 4321)

# Building and previewing
npm run build            # Build static site to dist/
npm run preview          # Preview production build locally

# Code quality
npm run lint             # Run ESLint with max-warnings=0
npm run typecheck        # Run Astro TypeScript check
npm run check            # Run lint + typecheck + test + build + linkcheck

# Testing
npm run test             # Run Vitest unit tests (tests/**/*.test.ts)
npm run test:e2e         # Run Playwright e2e tests (tests/e2e/**/*.spec.ts)
                        # Auto-starts preview server on 127.0.0.1:4321

# Content validation
npm run linkcheck        # Validate internal MDX links point to existing routes
```

## Architecture Overview

### Framework Stack

- **Astro 4.x** with **Starlight** - Static site generator with documentation theme
- **TypeScript** - Strict mode enabled via `astro/tsconfigs/strict`
- **Zod** - Schema validation for content frontmatter

### Content System

Content lives in `src/content/docs/` as MDX files with YAML frontmatter. The content schema (`src/content/config.ts`) defines three content types via `kind` field:

- `page` - Basic documentation page
- `lesson` - Learning path content (requires: `level`, `topic`, `difficulty`, `prerequisites`, `python_tags`, `ts_tags`)
- `algorithm` - Algorithm problems (requires: `difficulty`, `tags`; optional: `time_complexity`, `space_complexity`)

Content is organized into sidebar sections via `astro.config.mjs`:
- `paths/foundation/` - Basic TypeScript concepts
- `paths/migration/` - Python-to-TypeScript migration topics
- `paths/advanced/` - Advanced TypeScript features
- `handbook/` - Quick reference materials
- `algorithms/` - Bilingual algorithm implementations
- `practice/` - Quizzes and exercises

### Component Architecture

Components use Astro's scoped styles with CSS custom properties from Starlight's design tokens:

- `DualCodeBlock.astro` - Side-by-side Python/TypeScript code comparison with accessibility labels
- `DiffInsight.astro` - Callout boxes for differences/warnings/tips (types: `info`, `warning`, `tip`, `difference`)
- `PathNavigator.astro` - Previous/next navigation within learning paths
- `QuizContainer.astro` - Interactive quiz component
- `ThemeToggle.astro` - Dark/light mode switch

Layouts wrap content:
- `LessonLayout.astro` - Adds `PathNavigator` at bottom of lesson pages
- `AlgorithmLayout.astro` - Algorithm-specific layout (if different from default)

### Utility Libraries

- `lib/code-example.ts` - Normalizes dual code block input (validates both languages provided)
- `lib/frontmatter-schema.ts` - Zod schemas for lesson and algorithm frontmatter validation
- `lib/path-map.ts` - Defines learning path sequences (used by PathNavigator)
- `lib/theme-store.ts` - Client-side theme persistence

### Testing Strategy

**Unit tests** (Vitest): Located in `tests/unit/`, test utility functions and content validation. Key test files:
- `lesson-structure.test.ts` - Validates lesson frontmatter required fields
- `algorithm-structure.test.ts` - Validates algorithm frontmatter
- `frontmatter-schema.test.ts` - Tests Zod schema validation
- `path-content.test.ts` - Validates learning path integrity
- `code-example.test.ts` - Tests dual code normalization
- `quiz-coverage.test.ts` - Validates quiz completeness

**E2E tests** (Playwright): Located in `tests/e2e/`, test user interactions:
- `navigation.spec.ts` - Site navigation flows
- `search-and-filter.spec.ts` - Content discovery
- `quiz.spec.ts` - Quiz interactions

Playwright config automatically starts `npm run preview` before tests.

### Path Aliases

`@/*` maps to `src/*` for imports:
```typescript
import { lessonSchema } from "@/lib/frontmatter-schema";
```

### CI/CD

GitHub Actions workflows:
- `.github/workflows/ci.yml` - Runs lint, typecheck, test, build, linkcheck on PRs and main branch pushes
- `.github/workflows/deploy-pages.yml` - Builds and deploys to GitHub Pages on main branch pushes

Site deploys to: `https://typescript-python-web.github.io`

### Content Validation

The `linkcheck` script (`scripts/link-check.mjs`) validates that all internal MDX links point to valid routes derived from the file structure. It extracts `[]()` markdown links and validates them against the set of all routes generated from MDX files in `src/content/docs/`.

### Styling

- `src/styles/tokens.css` - CSS custom properties for theming
- `src/styles/accessibility.css` - Accessibility enhancements (focus styles, reduced motion)
- Components use scoped `<style>` blocks with Starlight CSS variables (`--sl-color-*`, `--space-*`, etc.)
