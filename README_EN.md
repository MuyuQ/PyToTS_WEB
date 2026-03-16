# PyToTS - Python to TypeScript Learning Site

English | [简体中文](./README.md)

A learning platform designed for Python developers transitioning to TypeScript. Master TypeScript through side-by-side code comparison, hands-on practice, and interactive quizzes.

## Features

- **Side-by-Side Comparison**: Python and TypeScript code displayed together for intuitive syntax comparison
- **Structured Learning Paths**: Progressive curriculum from basics to advanced topics
- **Algorithm Practice**: Bilingual implementations of 26 classic LeetCode problems
- **Interactive Quizzes**: 200+ practice questions with instant feedback
- **Interview Ready**: Each lesson includes interview follow-up questions

## Learning Paths

| Path       | Lessons | Topics                                                            |
| ---------- | ------- | ----------------------------------------------------------------- |
| Foundation | 5       | Variables, Control Flow, Data Structures, Functions, Classes      |
| Migration  | 7       | Modules, Error Handling, Enums, Strings, Async, Decorators        |
| Advanced   | 8       | Generics, Type Guards, Utility Types, Declarations, Configuration |

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:4321
```

### Available Commands

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run test`     | Run unit tests           |
| `npm run test:e2e` | Run E2E tests            |
| `npm run lint`     | Run linter               |
| `npm run check`    | Run full quality check   |

## Project Structure

```
src/
├── components/           # UI Components
│   ├── QuizContainer.astro    # Quiz container
│   ├── DualCodeBlock.astro    # Dual code display
│   └── PathNavigator.astro    # Learning path navigation
├── content/docs/         # Documentation (MDX)
│   ├── paths/            # Learning paths
│   │   ├── foundation/   # Foundation lessons
│   │   ├── migration/    # Migration lessons
│   │   └── advanced/     # Advanced lessons
│   ├── algorithms/       # Algorithm solutions
│   ├── handbook/         # Quick reference
│   └── practice/         # Practice quizzes
├── lib/                  # Utilities
├── pages/                # Page routes
└── styles/               # Stylesheets
```

## Tech Stack

- **Framework**: [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/)
- **Language**: TypeScript
- **Testing**: Vitest + Playwright
- **Deployment**: GitHub Pages

## Live Site

Deployed on GitHub Pages:

**https://muyuq.github.io/PyToTS_WEB/**

## Content Guidelines

### Lesson Structure

```
## Scenario & Problem
## Python Review
## TypeScript Equivalent
## Differences & Common Pitfalls
## Practice
## Interview Follow-up
```

### Algorithm Structure

```
## Problem Statement
## Analysis
## Complexity
## Python Implementation
## TypeScript Implementation
## Interview Variants
```

## Contributing

Issues and Pull Requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](./LICENSE)

---

If this project helps you, please consider giving it a Star!
