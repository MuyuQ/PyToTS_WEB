# Python to TypeScript Learning Site Design

**Date:** 2026-03-11  
**Status:** Approved  
**Owner:** Project Team

## 1) Product Goal

Build a modern learning website for Python users who want to learn TypeScript.

The site must teach TypeScript through direct Python-to-TypeScript comparison, include an algorithm track with both language implementations, and deploy as a static site on GitHub Pages.

## 2) Target Audience and Scope

### Target audience

- Full spectrum of Python users:
  - Beginners who know Python syntax but have little frontend knowledge
  - Intermediate backend engineers transitioning to TypeScript
  - Interview-oriented learners focused on algorithm problem solving

### MVP scope

- Launch course path and algorithm track together (same MVP release)
- Content-first experience with light interactivity
- No backend, no login, no database
- Chinese-first content with English technical terms

## 3) Technical Direction

### Stack

- Framework: Astro + Starlight
- Content: Markdown/MDX
- Deployment: GitHub Pages
- Search: static/local index approach compatible with static hosting

### Why this direction

- Fast to ship for content-heavy products
- Strong docs UX with low maintenance overhead
- Native support for static generation and theme handling
- Good balance between modern UI and implementation complexity

## 4) Information Architecture

Top-level navigation:

1. Home
2. Learning Paths
3. Python ↔ TypeScript Handbook
4. Algorithms
5. Practice & Quiz
6. About & Contributing

### Learning paths

- Foundation path
- Migration path (Python to TypeScript mapping)
- Advanced path (engineering patterns and interview readiness)

## 5) Content Standards

### Lesson page template (required)

Each lesson follows this sequence:

1. Scenario and problem statement
2. Python refresher
3. TypeScript equivalent
4. Differences and common pitfalls
5. Advantage comparison (when to prefer each style)
6. Short exercise
7. Interview follow-up questions

### Algorithm page template (required)

Each algorithm page includes:

1. Problem statement
2. Thought process
3. Complexity analysis
4. Python implementation
5. TypeScript implementation
6. Detailed line-by-line comments
7. Interview variants
8. Common mistakes

### Bilingual code rule

- Keep Python and TypeScript examples structurally aligned:
  - Similar variable naming
  - Similar step order
  - Same algorithmic approach
- Goal: highlight language differences, not solution differences

## 6) Component and Interaction Design

### Core components

- `DualCodeBlock`: side-by-side Python and TypeScript code
- `DiffInsight`: focused language-difference cards
- `AlgoWalkthrough`: step timeline for algorithm reasoning
- `QuizCard`: small knowledge checks
- `PathNavigator`: progression guidance per learner level

### Interaction level for MVP

- Content + runnable example links
- TypeScript: use Playground links/embed strategy where appropriate
- Python: show copyable code + expected output + guided annotations
- No server-side execution in MVP

### Theme and visual requirements

- Modern UI in both light and dark themes
- Theme switcher with `prefers-color-scheme` + manual override
- Mobile-first responsive layout
- Consistent design tokens for color, spacing, typography, and elevation

## 7) Data Model and Build-Time Flow

Use content frontmatter fields (minimum):

- `level`
- `topic`
- `difficulty`
- `prerequisites`
- `python_tags`
- `ts_tags`

Build-time responsibilities:

- Validate frontmatter schema
- Generate navigation, topic listings, and tag pages
- Block build on missing required fields

Runtime responsibilities (light state only):

- Store theme preference
- Store recent learning position
- Store completion markers
- Persist via localStorage with safe fallback handling

## 8) Error Handling and Quality Gates

### Error handling

- Fail build on schema or structure violations
- Provide friendly 404 and empty-state guidance
- Use safe localStorage access with fallback defaults

### Quality gates (Definition of Done)

Every feature slice must pass:

- Lint
- Tests
- Build
- Link check

Additional release checks:

- Light/dark theme verification
- Mobile layout verification
- Accessibility baseline (keyboard, semantics, contrast)
- Basic performance budget checks

## 9) CI/CD and Deployment

- GitHub Actions on pull requests:
  - lint
  - test
  - build
  - link check
- Auto-deploy to GitHub Pages after merge to main branch

## 10) MVP Milestones

- **M0 (Week 1):** Site skeleton, nav, themes, base components, CI/CD, GitHub Pages deploy
- **M1 (Week 2-3):** Core course content for high-value topics (types, functions, async, modules)
- **M2 (Week 4-5):** Algorithms launch batch (20-30 problems with bilingual implementations)
- **M3 (Week 6):** Quiz layer, search polish, mobile/accessibility/performance hardening

## 11) Additional Recommended Content

- Migration cheat sheet (Python syntax to TypeScript mapping)
- Terminology dictionary (CN + EN)
- Mini project rewrite track (rewrite a small Python utility in TypeScript)

## 12) Mandatory Git Workflow Rule (User-added)

This rule is mandatory for all AI execution in this repository:

1. When a functionally complete, independently verifiable slice is done, commit immediately to local git.
2. Keep commits atomic (one intent per commit).
3. Do not bundle unrelated changes into one commit.
4. Before commit, ensure the slice is in a usable state (relevant checks pass).
5. Use clear commit messages (Conventional Commit style preferred).

Examples:

- `feat(course): add async comparison lesson`
- `feat(algo): add two-pointer template with bilingual code`
- `fix(theme): persist user theme with safe localStorage fallback`

## 13) Acceptance Summary

Approved decisions from brainstorming:

- Audience: full-level Python users
- MVP: course path + algorithm track together
- Interactivity: content-first with runnable example strategy
- Hosting: static site on GitHub Pages
- Language: Chinese-first with English technical terms
- Stack: Astro + Starlight
- Process rule: frequent local commits per completed feature slice
