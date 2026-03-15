# Deployment Guide

## Overview

This guide covers the deployment process for the Python to TypeScript Learning Site.

## Prerequisites

- Node.js 20+
- npm or yarn
- GitHub repository access
- GitHub Pages enabled

## Environment Variables

### Required Variables

```bash
# .env.production
NODE_ENV=production
PUBLIC_SITE_URL=https://your-site.github.io
```

### Optional Variables

```bash
# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=production

# Analytics (optional)
PUBLIC_ANALYTICS_ID=your_analytics_id
```

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
   curl -I https://your-site.github.io
   ```

### Manual Deployment (if needed)

1. Build the project:
   ```bash
   npm ci
   npm run build
   ```

2. Verify build output:
   ```bash
   ls -la dist/
   npm run preview
   ```

3. Deploy manually (requires gh CLI):
   ```bash
   gh pages publish dist/
   ```

## Pre-deployment Checklist

- [ ] All tests passing (`npm run check`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Lighthouse score >= 90
- [ ] Accessibility checks passing
- [ ] All links validated

## Post-deployment Verification

1. Check site loads:
   ```bash
   curl -sSf https://your-site.github.io > /dev/null && echo "OK" || echo "FAILED"
   ```

2. Verify key pages:
   - Homepage: `/`
   - Algorithms: `/algorithms/`
   - Learning paths: `/paths/`

3. Check performance:
   ```bash
   npm run lighthouse -- --url=https://your-site.github.io
   ```

## Rollback Process

### GitHub Pages Rollback

1. **Revert to previous commit:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Or redeploy specific version:**
   ```bash
   git log --oneline -10
   git checkout <commit-hash>
   git checkout -b hotfix-rollback
   git push origin hotfix-rollback
   # Create PR to main
   ```

3. **Force redeploy (GitHub Actions):**
   - Go to Actions > Deploy to GitHub Pages
   - Click "Run workflow"
   - Select branch and run

### Emergency Rollback

If site is completely broken:

1. Enable GitHub Pages maintenance mode
2. Create `public/maintenance.html`:
   ```html
   <!DOCTYPE html>
   <html>
   <head><title>Maintenance</title></head>
   <body>
     <h1>Under Maintenance</h1>
     <p>We're fixing an issue. Please check back soon.</p>
   </body>
   </html>
   ```
3. Deploy maintenance page
4. Fix issue in background
5. Deploy fix and remove maintenance mode

## Deployment Environments

### Staging (if applicable)

```bash
# Deploy to staging branch
git push origin feature-branch:staging
```

Configure separate workflow for staging deployments.

### Production

The `main` branch deploys to production automatically.

## Troubleshooting Deployment Issues

### Build Failures

1. Check build logs in GitHub Actions
2. Run locally: `npm run build`
3. Check for TypeScript errors: `npm run typecheck`

### 404 Errors After Deployment

1. Check `base` configuration in `astro.config.mjs`
2. Verify `_redirects` or `404.html` exists
3. Check GitHub Pages settings

### Performance Issues

1. Check bundle size: `npm run build` (look for chunk sizes)
2. Enable CDN for assets
3. Optimize images in `src/assets/`

## Security Considerations

- All dependencies scanned with `npm audit`
- Security headers configured (see `config/security-headers.config`)
- HTTPS enforced via GitHub Pages
- No sensitive data in repository

## Contact

For deployment issues, contact:
- Primary: @maintainer
- Secondary: DevOps team
