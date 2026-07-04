# Operations Runbook

## Overview

This runbook provides procedures for common operational tasks for [PyToTS](https://muyuq.github.io/PyToTS_WEB/), the Python to TypeScript learning site built with Astro + Starlight.

## Common Issues

### Site Down (P1)

**Symptoms:**
- 502/503 errors
- Timeout errors
- Blank page

**Diagnostic Steps:**
1. Check GitHub Pages status: https://www.githubstatus.com/
2. Check recent deployments in GitHub Actions
3. Verify the site URL: https://muyuq.github.io/PyToTS_WEB/

**Resolution:**
```bash
# Rollback to previous commit
git revert HEAD
git push origin main
```

### Build Failures (P2)

**Symptoms:**
- GitHub Actions failing
- Local build fails
- TypeScript errors

**Diagnostic Steps:**
```bash
npm run typecheck
npm run lint
npm run linkcheck
```

**Resolution:**
```bash
# Fix lint issues
npm run lint -- --fix

# Clean build
Remove-Item -Recurse -Force dist, node_modules -ErrorAction SilentlyContinue
npm ci
npm run build
```

### 404 Errors on Routes (P2)

**Symptoms:**
- Direct navigation to sub-pages fails
- Refresh on sub-page shows 404

**Diagnostic Steps:**
1. Verify `base` config in `astro.config.mjs` (should be `/PyToTS_WEB/`)
2. Test with `npm run preview`

**Resolution:**
```bash
# Check base configuration
Get-Content astro.config.mjs | Select-String "base"
```

### Broken Internal Links (P3)

**Detection:**
```bash
npm run linkcheck
```

**Fix:**
1. Update links in Markdown/MDX files
2. Rebuild and redeploy

## Useful Commands

```bash
# Health check
curl -sSf https://muyuq.github.io/PyToTS_WEB/ > /dev/null && echo "OK" || echo "FAILED"

# Security audit
npm audit

# Full quality check
npm run check
```
