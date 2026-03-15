# ADR-002: Testing Strategy

**Status:** Accepted

**Date:** 2024-03-05

**Deciders:** @maintainer

---

## Context

We needed to establish a comprehensive testing strategy for the learning site that ensures:
- Component reliability
- Accessibility compliance
- End-to-end user flows work
- Code quality standards

## Decision

We will use a multi-layered testing approach:
1. **Unit Testing:** Vitest + Testing Library
2. **Accessibility Testing:** vitest-axe + axe-core
3. **End-to-End Testing:** Playwright
4. **Linting:** ESLint with TypeScript support
5. **Type Checking:** TypeScript compiler

## Consequences

### Positive

- **Vitest:** Fast, Vite-native, modern DX
- **Testing Library:** User-centric testing approach
- **Playwright:** Reliable E2E tests, cross-browser support
- **axe-core:** Industry-standard accessibility testing
- TypeScript integration throughout
- Good CI/CD integration

### Negative

- Multiple tools to maintain
- Learning curve for contributors
- Test suite takes time to run

### Neutral

- Requires Node.js 20+ for best compatibility

## Alternatives Considered

### Alternative 1: Jest

Jest for unit testing.

**Why rejected:**
- Slower than Vitest
- More configuration required
- Less native ESM support

### Alternative 2: Cypress

Cypress for E2E testing.

**Why rejected:**
- Playwright has better cross-browser support
- Playwright is faster and more reliable
- Better CI integration with Playwright

### Alternative 3: Pa11y

Pa11y for accessibility testing.

**Why rejected:**
- axe-core is more comprehensive
- Better integration with Testing Library
- More widely adopted

## Tooling Details

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit | Vitest | Component and function testing |
| DOM | Testing Library | User-centric queries |
| A11y | vitest-axe | Automated accessibility checks |
| E2E | Playwright | Full user journey testing |
| Lint | ESLint | Code style and best practices |
| Types | TypeScript | Static type checking |

## References

- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Playwright](https://playwright.dev)
- [axe-core](https://github.com/dequelabs/axe-core)
