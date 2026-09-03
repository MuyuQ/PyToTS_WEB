# ADR-001: Static Site Generator Selection

**Status:** Accepted

**Date:** 2024-03-01

**Deciders:** @maintainer

---

## Context

We needed to select a static site generator for the Python to TypeScript Learning Site. The site requires:
- Markdown/MDX content authoring
- Code syntax highlighting
- Navigation/sidebar generation
- Good performance and SEO
- Easy deployment to GitHub Pages

## Decision

We will use **Astro** with the **Starlight** theme as our static site generator.

## Consequences

### Positive

- Excellent performance (0kb JS by default)
- Built-in Markdown/MDX support
- Starlight provides documentation-specific features out of the box
- Automatic sidebar generation from file structure
- Built-in code syntax highlighting with Expressive Code
- Easy deployment to static hosts (GitHub Pages, Netlify, Vercel)
- Islands architecture allows selective hydration for interactive components
- Great developer experience with fast HMR

### Negative

- Smaller ecosystem than Next.js or Gatsby
- React/Preact knowledge required for interactive components
- Limited plugin ecosystem compared to Gatsby

### Neutral

- Content lives in Git (no CMS)
- Requires Node.js build step

## Alternatives Considered

### Alternative 1: Next.js

Next.js with static export and a documentation template.

**Why rejected:**
- Heavier framework with more client-side JavaScript
- More complex configuration for simple documentation
- Overkill for a content-focused site

### Alternative 2: Docusaurus

Facebook's documentation site generator.

**Why rejected:**
- More React-centric (requires React knowledge for customization)
- Larger bundle sizes
- Less flexible routing and content structure

### Alternative 3: GitBook

Hosted documentation platform.

**Why rejected:**
- Proprietary platform with lock-in
- Limited customization options
- Requires paid plan for custom domain
- Not version-controlled with code

### Alternative 4: Jekyll

GitHub's native static site generator.

**Why rejected:**
- Ruby-based (requires separate toolchain)
- Slower build times
- Less modern DX compared to JavaScript-based tools
- Limited TypeScript integration

## References

- [Astro Documentation](https://docs.astro.build)
- [Starlight Documentation](https://starlight.astro.build)
- [Astro vs Next.js Comparison](https://docs.astro.build/en/guides/integrations-guide/react/)
