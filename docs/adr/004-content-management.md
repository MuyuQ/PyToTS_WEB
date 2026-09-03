# ADR-004: Content Management Approach

**Status:** Accepted

**Date:** 2024-03-10

**Deciders:** @maintainer

---

## Context

We needed to decide how to manage content for the learning site. The content includes:
- Markdown lessons
- Code examples (Python and TypeScript)
- Algorithm explanations
- Navigation structure

## Decision

We will use **Git-based Markdown content** with frontmatter for metadata.

Content structure:
- Markdown files in `src/content/docs/`
- TypeScript schema validation with Zod
- Astro Content Collections for type safety
- Git for version control

## Consequences

### Positive

- Full version control with Git
- Code review process for content changes
- Type safety for content schema
- Local development with live reload
- No external dependencies (database, CMS)
- Fast builds (static generation)
- Easy to backup and migrate
- Markdown is ubiquitous and easy to edit

### Negative

- Non-technical contributors need to learn Git
- No WYSIWYG editor
- Content changes require deployment
- No real-time collaboration

### Neutral

- Content and code in same repository
- Requires Node.js environment for preview

## Content Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const docsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  }),
});
```

## Alternatives Considered

### Alternative 1: Headless CMS (Contentful, Sanity)

Cloud-based content management system.

**Why rejected:**
- Adds complexity and cost
- Requires network for content updates
- Vendor lock-in
- Overkill for our content volume

**When to reconsider:**
- Many non-technical contributors
- Need content scheduling
- Need complex content relationships

### Alternative 2: Notion

Notion as a CMS with API integration.

**Why rejected:**
- Rate limits on API
- Not designed for documentation
- Requires custom sync solution

**When to reconsider:**
- Team already uses Notion heavily
- Need collaborative editing

### Alternative 3: GitBook

Hosted documentation platform with Git sync.

**Why rejected:**
- Limited customization
- Paid for advanced features
- Proprietary platform

**When to reconsider:**
- Need collaborative editing
- Don't want to maintain infrastructure

### Alternative 4: Wiki (GitHub Wiki)

GitHub's built-in wiki feature.

**Why rejected:**
- Limited structure/navigation
- No custom components
- Hard to customize appearance

## Content Guidelines

See [CONTRIBUTING.md](../CONTRIBUTING.md) for content authoring guidelines.

## References

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Zod Documentation](https://zod.dev)
