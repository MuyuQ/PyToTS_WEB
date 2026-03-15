# Python to TypeScript Learning Site

A modern learning website for Python users who want to learn TypeScript.

## Features

- **Direct Comparison**: Python and TypeScript code side by side
- **Algorithm Track**: Practice with bilingual implementations
- **Interview Ready**: Prepare for TypeScript interviews

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
npm run dev
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run unit tests |
| `npm run linkcheck` | Validate internal doc links |
| `npm run check` | Run all checks |

## Project Structure

```
src/
├── components/     # Reusable UI components
├── content/        # Markdown/MDX content
│   └── docs/       # Documentation pages
│       ├── paths/  # Learning paths
│       └── algorithms/ # Algorithm problems
├── layouts/        # Page layouts
├── lib/            # Utility functions
└── styles/         # CSS styles
```

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

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

| Document | Description |
|----------|-------------|
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment steps and rollback procedures |
| [RUNBOOK.md](docs/RUNBOOK.md) | Operations and incident response |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common issues and solutions |
| [monitoring.md](docs/monitoring.md) | Monitoring and alerting setup |
| [adr/](docs/adr/) | Architecture Decision Records |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |

## License

MIT
