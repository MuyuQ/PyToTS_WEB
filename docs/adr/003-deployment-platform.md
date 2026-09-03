# ADR-003: Deployment Platform

**Status:** Accepted

**Date:** 2024-03-10

**Deciders:** @maintainer

---

## Context

We needed to select a deployment platform for hosting the Python to TypeScript Learning Site. Requirements:
- Free hosting for open source projects
- Custom domain support
- HTTPS by default
- CI/CD integration
- Good performance globally

## Decision

We will use **GitHub Pages** as our deployment platform, with **GitHub Actions** for CI/CD.

## Consequences

### Positive

- Free for public repositories
- Native Git integration
- Simple GitHub Actions workflow
- HTTPS enabled by default
- Custom domain support
- Jekyll-compatible (but we use Astro)
- Good enough performance for documentation sites
- No separate hosting account needed

### Negative

- Limited server-side functionality (static only)
- No server-side redirects
- Cannot set custom security headers
- Build time limits on GitHub Actions
- No edge functions/workers

### Neutral

- Deployed from `main` branch
- Requires build step (Astro generates static files)

## Alternatives Considered

### Alternative 1: Netlify

Netlify with Git integration.

**Why rejected:**
- GitHub Pages is sufficient for our needs
- Already using GitHub for repository
- No need for additional service
- Netlify has build minute limits on free tier

**When to reconsider:**
- Need server-side redirects
- Need edge functions
- Need custom headers
- Need form handling

### Alternative 2: Vercel

Vercel with Git integration.

**Why rejected:**
- Optimized for Next.js (we use Astro)
- Additional service to manage
- GitHub Pages is simpler for our use case

**When to reconsider:**
- Need server-side rendering
- Need image optimization
- Need analytics

### Alternative 3: Cloudflare Pages

Cloudflare's static site hosting.

**Why rejected:**
- Additional service to manage
- GitHub Pages is sufficient

**When to reconsider:**
- Need custom security headers
- Need edge functions
- Need better global CDN performance

### Alternative 4: AWS S3 + CloudFront

Amazon Web Services static hosting.

**Why rejected:**
- Overkill for a documentation site
- Requires AWS knowledge
- Potential costs
- More complex setup

**When to reconsider:**
- Enterprise requirements
- Need compliance certifications
- Need advanced logging/monitoring

## Migration Path

If we need to migrate from GitHub Pages:

1. **To Netlify:**
   - Import repo to Netlify
   - Update DNS
   - Configure `_redirects` file

2. **To Cloudflare Pages:**
   - Import repo to Cloudflare
   - Update DNS
   - Add `_headers` file for security headers

## References

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
