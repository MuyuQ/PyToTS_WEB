# Contributing to Python to TypeScript Learning Site

Thank you for your interest in contributing! This document outlines the process and guidelines for contributing to this project.

## Commit Rules

**Mandatory Rule**: Commit immediately after each completed slice.

When a functionally complete, independently verifiable slice is done:
1. Commit immediately to local git
2. Keep commits atomic (one intent per commit)
3. Do not bundle unrelated changes into one commit
4. Before commit, ensure the slice is in a usable state (relevant checks pass)
5. Use clear commit messages (Conventional Commit style preferred)

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

**Examples:**
- `feat(course): add async comparison lesson`
- `feat(algo): add two-pointer template with bilingual code`
- `fix(theme): persist user theme with safe localStorage fallback`
- `docs(readme): update installation instructions`

## Development Workflow

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/typescript-python-web.git
cd typescript-python-web
npm install
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow the existing code style
- Write tests for new functionality
- Ensure all checks pass: `npm run check`

### 4. Commit Changes

Follow the commit rules above. Commit frequently with atomic changes.

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create a Pull Request on GitHub.

## Content Guidelines

### Lesson Template

Each lesson should include:
1. Scenario and problem statement
2. Python refresher
3. TypeScript equivalent
4. Differences and common pitfalls
5. Advantage comparison
6. Short exercise
7. Interview follow-up questions

### Algorithm Template

Each algorithm page should include:
1. Problem statement
2. Thought process
3. Complexity analysis
4. Python implementation
5. TypeScript implementation
6. Detailed line-by-line comments
7. Interview variants
8. Common mistakes

## Quality Gates

Before submitting a PR, ensure:
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] Commits follow the commit-per-slice rule

## Code Review

All PRs require review before merging. Please be responsive to feedback and make necessary changes promptly.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.