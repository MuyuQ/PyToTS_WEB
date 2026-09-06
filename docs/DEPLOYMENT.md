# Deployment Guide

## Overview

This guide covers the deployment process for [PyToTS](https://muyuq.github.io/PyToTS_WEB/), the Python to TypeScript Learning Site.

## Prerequisites

- Node.js 20+
- npm
- GitHub repository access

## Deployment Steps

### Automated Deployment (GitHub Actions)

The site automatically deploys when changes are pushed to the `main` branch.

1. Push changes to `main`:

   ```bash
   git push origin main
   ```

2. Monitor deployment:
   - Go to GitHub Actions tab
   - Check "Deploy to GitHub Pages" workflow
   - Wait for green checkmark

3. Verify deployment:
   ```bash
   curl -I https://muyuq.github.io/PyToTS_WEB/
   ```

### Manual Deployment (if needed)

1. Build the project:

   ```bash
   npm ci
   npm run build
   ```

2. Verify build output:
   ```bash
   ls dist/
   npm run preview
   ```

## Pre-deployment Checklist

- [ ] All tests passing (`npm run check`)
- [ ] All links validated (`npm run linkcheck`)

## Post-deployment Verification

1. Check site loads:

   ```bash
   curl -sSf https://muyuq.github.io/PyToTS_WEB/ > /dev/null && echo "OK" || echo "FAILED"
   ```

2. Verify key pages:
   - Homepage: `/PyToTS_WEB/`
   - Algorithms: `/PyToTS_WEB/algorithms/`
   - Learning paths: `/PyToTS_WEB/paths/`

## Configuration

The site is configured as follows:

- **Base URL**: `/PyToTS_WEB/` (set in `astro.config.mjs`)
- **Domain**: `https://muyuq.github.io`
- **Build output**: `dist/` directory

## Troubleshooting

### Build Failures

1. Check build logs in GitHub Actions
2. Run locally: `npm run build`
3. Check for TypeScript errors: `npm run typecheck`

### 404 Errors After Deployment

1. Check `base` configuration in `astro.config.mjs` (should be `/PyToTS_WEB/`)
2. Wait 5-10 minutes for CDN cache
3. Check GitHub Pages settings

## Rollback

```bash
git revert HEAD
git push origin main
```
