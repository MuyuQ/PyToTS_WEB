# PyToTS - Python to TypeScript Learning Site

English | [简体中文](./README.md)

A TypeScript learning site for Python developers. Compare Python and TypeScript through structured lessons, algorithm solutions, and interactive quizzes focused on syntax, type systems, and engineering practices.

[Live site](https://muyuq.github.io/PyToTS_WEB/) · [Contributing](./CONTRIBUTING.md) · [Project conventions](./AGENTS.md)

The site content is currently in Simplified Chinese. “Bilingual” refers to code examples in Python and TypeScript, rather than translated editions of the lessons.

## Features and Content

- **Structured curriculum**: 22 lessons across Preparation, Foundation, Migration, and Advanced tracks, with exercises and interview follow-ups.
- **Code comparison**: Short examples use `CodeCompare` for side-by-side display and stack on narrow screens. Complete algorithm implementations use Python / TypeScript tabs.
- **Algorithm practice**: 36 classic problems with brute-force baselines, optimizations, dry runs, complexity analysis, implementations, common mistakes, and interview variants. Filter by difficulty or search titles and tags.
- **Interactive quizzes**: 104 questions in 21 groups covering Foundation, Migration, and Advanced lessons, plus output-prediction questions. Options are shuffled for each attempt, with explanations, score history, and retries.
- **Learning records**: Resume the last lesson or algorithm from the homepage, track completion, bookmark content, and review quiz scores.
- **Reference tools**: A comparison handbook, cheat sheet, tag and difficulty indexes, Pagefind full-text search, light and dark themes, and responsive layouts.

Lesson counts exclude track landing pages. Quiz groups and question counts come from [`src/data/quizzes.ts`](./src/data/quizzes.ts).

The site is fully static and requires no account or backend. Progress, bookmarks, quiz scores, and the last visited learning page stay in the current browser's `localStorage`. They are not uploaded or synced across devices and are lost when site data is cleared. Scrolling to the end of a lesson or algorithm marks it as completed.

## Learning Paths

| Track       | Lessons | Topics in teaching order                                                                                                         |
| ----------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Preparation | 2       | TypeScript introduction, environment setup                                                                                       |
| Foundation  | 5       | Variables, function basics, control flow, data structures, classes and objects                                                   |
| Migration   | 7       | Type system, advanced functions, modules, async, error handling, enums, strings and regex                                        |
| Advanced    | 8       | Generics, type guards, utility types, declarations and configuration, decorators, design patterns, date and time, Node.js basics |

Start with Preparation and follow the tracks in order, or jump to Migration or Advanced if familiar with TypeScript. Use quizzes to check understanding and the algorithm collection for practice.

## Quick Start

### Prerequisites

- Node.js 22.12+ within the 22.x release line, matching CI, or Node.js 24.x.
- npm 9.6.5+. Dependencies are locked in `package-lock.json`.
- Python 3.10+ is required for executable content regression tests. Tests use `python` on Windows and `python3` elsewhere; set `PYTHON` to override the interpreter path.

### Local Development

```bash
git clone https://github.com/MuyuQ/PyToTS_WEB.git
cd PyToTS_WEB
npm ci
npm run dev -- --host 127.0.0.1
```

Open [http://127.0.0.1:4321/PyToTS_WEB/](http://127.0.0.1:4321/PyToTS_WEB/). The `/PyToTS_WEB/` base path applies to local development and previews too. If the development port is occupied, Astro chooses the next available port; use the address printed in the terminal.

### Build and Preview

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

The build writes static output to `dist/`. Use the same URL for the preview. Pagefind generates its search index during the build, so build and preview the site to verify full-text search.

## Commands and Quality Checks

| Command                   | Description                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm run dev`             | Start the Astro development server                                                                             |
| `npm run build`           | Build static pages and the Pagefind search index                                                               |
| `npm run preview`         | Preview existing `dist/` output                                                                                |
| `npm run lint`            | Run ESLint; warnings also fail the check                                                                       |
| `npm run lint:content`    | Check content headings, internal links, metadata, and short code comparison limits                             |
| `npm run format`          | Check Prettier formatting without modifying files                                                              |
| `npm run typecheck`       | Run Astro and TypeScript checks                                                                                |
| `npm run test`            | Run Vitest, including unit, component, and built-page accessibility tests                                      |
| `npm run test:coverage`   | Run Vitest with coverage thresholds; write reports to `coverage/`                                              |
| `npm run test:components` | Run component tests only                                                                                       |
| `npm run test:a11y`       | Check accessibility of actual pages in `dist/`                                                                 |
| `npm run test:e2e`        | Run Playwright tests across Chromium, Firefox, and WebKit by default                                           |
| `npm run linkcheck`       | Validate internal links, asset references, and cross-page anchors in `dist/`                                   |
| `npm run check`           | Run the full quality pipeline and build in sequence                                                            |
| `npm run lighthouse`      | Audit the build preview with Lighthouse; the current configuration uploads reports to temporary public storage |

The `check` pipeline is defined in [`package.json`](./package.json):

```text
lint → lint:content → format → typecheck → build → test:coverage → linkcheck
```

`test`, `test:coverage`, `test:a11y`, `linkcheck`, E2E, and Lighthouse require fresh `dist/` output. Run `npm run build` before invoking them separately. `check` does not include E2E or Lighthouse.

### Browser Tests

Run Chromium tests to match CI:

```bash
npm run build
npx playwright install chromium
npm run test:e2e -- --project=chromium
```

For all configured browsers, run `npx playwright install` followed by `npm run test:e2e`. Linux CI uses `npx playwright install --with-deps chromium` to install the browser and system dependencies.

Playwright starts the preview server automatically on port 4321. It can reuse an existing local server, so ensure that server serves this project's latest build. Tests cover navigation, lesson order, search and filtering, quiz flows, and mobile layouts.

## Project Structure

```text
.
├── src/
│   ├── components/          # Navigation, code comparison, algorithms, quizzes, progress
│   ├── content/docs/        # MDX documentation
│   │   ├── paths/           # preparation / foundation / migration / advanced
│   │   ├── algorithms/      # 36 solutions and an index page
│   │   ├── handbook/        # Comparison handbook and cheat sheet
│   │   ├── practice/        # Self-check lists and interactive quizzes
│   │   ├── tags/            # Tag index
│   │   ├── difficulty/      # Difficulty index
│   │   ├── bookmarks/       # Progress and bookmarks
│   │   └── about/           # About and contributing
│   ├── content.config.ts    # Astro content collection and learning metadata validation
│   ├── data/quizzes.ts      # Quiz question bank
│   ├── lib/                 # Curriculum, routes, progress storage, quiz state and UI
│   ├── pages/404.astro      # Custom 404 page
│   └── styles/              # Design tokens, typography, layout, code and quiz styles
├── tests/
│   ├── unit/               # Library, content contract, and component tests
│   ├── a11y/               # Accessibility tests against actual built pages
│   └── e2e/                # Playwright browser tests
├── scripts/                # Content linting, built-site link checks, OG image generation
├── docs/                   # Deployment, operations, architecture decisions, and plans
├── .github/workflows/      # Pages deployment and independent E2E pipeline
├── astro.config.mjs        # Domain, base path, sidebar, theme, and component overrides
└── package.json            # Scripts and dependencies
```

### Maintenance Entry Points

| Task                           | Files and conventions                                                                                                                                                                     |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add or reorder lessons         | Update [`src/lib/curriculum.ts`](./src/lib/curriculum.ts) and the relevant MDX files; keep `sidebar.order` aligned so sidebar and pagination follow the same teaching order               |
| Add an algorithm               | Create an MDX file in `src/content/docs/algorithms/` following the [algorithm guide](./docs/algorithms-AGENTS.md)                                                                         |
| Edit quiz questions            | Update [`src/data/quizzes.ts`](./src/data/quizzes.ts); reference new quiz groups in `src/content/docs/practice/quiz/index.mdx`                                                            |
| Change quiz behavior or styles | `src/lib/quiz-manager.ts` handles state, `src/lib/quiz-ui.ts` handles interaction, and `src/styles/quiz.css` provides styles; `QuizContainer.astro` provides the template and mount point |
| Change learning records        | `src/lib/progress-store.ts` handles storage, `learning-routes.ts` supplies content routes, and `ContinueCard.astro` with `VisitRecorder.astro` implements resume behavior                 |
| Adjust the theme or navigation | Update `src/styles/tokens.css`, `src/components/`, and `astro.config.mjs`                                                                                                                 |

## Content Guidelines

See [`AGENTS.md`](./AGENTS.md) for project conventions and [`docs/algorithms-AGENTS.md`](./docs/algorithms-AGENTS.md) for the algorithm template.

- Lesson frontmatter includes `title`, `kind`, `level`, `topic`, `difficulty`, `prerequisites`, `python_tags`, `ts_tags`, `description`, and `sidebar.order`.
- Use meaningful Chinese lesson headings for motivation, core concepts, Python review, TypeScript equivalents, differences and pitfalls, exercises, and interview follow-ups. Do not repeat the frontmatter title or add emoji to headings.
- Use relative links within content, such as `../two-sum/` when linking between algorithm pages, to preserve the deployment base path.
- Use `CodeCompare` for directly adjacent short Python / TypeScript examples: at most 20 lines per snippet and 48 characters per line. Stack longer examples as regular code blocks. Use `:::note` / `:::tip` for notes and answer highlights.
- Keep Python before TypeScript and use consistent variable names. Prefer `const` in TypeScript, and use `unknown` or precise types instead of `any`.
- Each quiz question has four options, exactly one correct answer, and an explanation for every option. Prediction questions use `questionType: "prediction"`, `codeSnippets`, and an `expected` field on each option.

Algorithm pages use these nine sections, with runnable implementations and test cases. Keep the Chinese headings in MDX files:

```text
问题描述 → 暴力解与瓶颈 → 思路分析（含干跑表）→ 复杂度分析
→ 双语实现（Python / TypeScript Tabs）→ Python 与 TypeScript 差异点评
→ 常见错误分析 → 面试变体 → 面试追问
```

These cover the problem statement, brute-force bottlenecks, analysis with a dry run, complexity, bilingual implementations, language differences, common mistakes, interview variants, and follow-up questions.

## Tech Stack and Deployment

| Purpose                             | Technology                                                        |
| ----------------------------------- | ----------------------------------------------------------------- |
| Static site and documentation theme | Astro 7, Starlight 0.42                                           |
| Content and interaction             | MDX, TypeScript, Astro components, native browser APIs            |
| Search                              | Pagefind indexes generated during the static build                |
| Testing and quality                 | Vitest 5, Testing Library, axe-core, Playwright, ESLint, Prettier |
| Hosting                             | GitHub Pages and GitHub Actions                                   |

See [`package-lock.json`](./package-lock.json) for exact dependency versions.

- [`static.yml`](./.github/workflows/static.yml): On pushes to `main`, runs `npm ci` and `npm run check`, then deploys `dist/` to GitHub Pages when checks pass.
- [`e2e.yml`](./.github/workflows/e2e.yml): Runs independent Chromium E2E checks for pull requests and pushes to `main`, uploading a test report on failure.

The deployment domain and base path are configured in `astro.config.mjs`. When moving the site, also update addresses or prefixes in `playwright.config.ts`, `scripts/link-check.mjs`, and `lighthouserc.json`.

## Contributing and Further Reading

Issues and pull requests are welcome for lessons, algorithm solutions, and site features. Follow the [contribution guide](./CONTRIBUTING.md), run `npm run check` before submitting, and run relevant E2E tests for interaction changes.

- [Deployment guide](./docs/DEPLOYMENT.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Operations runbook](./docs/RUNBOOK.md)
- [Architecture decisions](./docs/adr/)

## License

The repository does not currently include a `LICENSE` file.
