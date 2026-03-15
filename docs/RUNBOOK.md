# Operations Runbook

## Overview

This runbook provides procedures for common operational tasks and incident response.

## Incident Severity Levels

### P1 - Critical
- Site completely unavailable
- Data loss or security breach
- Response: Immediate (15 min)

### P2 - High
- Major functionality broken
- Significant performance degradation
- Response: Within 1 hour

### P3 - Medium
- Minor functionality issues
- Non-critical bugs
- Response: Within 4 hours

### P4 - Low
- Cosmetic issues
- Feature requests
- Response: Next business day

## Common Issues

### Site Down (P1)

**Symptoms:**
- 502/503 errors
- Timeout errors
- Blank page

**Diagnostic Steps:**
1. Check GitHub Pages status: https://www.githubstatus.com/
2. Verify DNS settings
3. Check recent deployments
4. Review error logs in Sentry (if configured)

**Resolution:**
```bash
# If deployment issue, rollback
git log --oneline -5
git revert HEAD
git push origin main
```

### Performance Degradation (P2)

**Symptoms:**
- Page load > 5 seconds
- High Time to Interactive (TTI)
- Layout shifts (CLS > 0.25)

**Diagnostic Steps:**
1. Run Lighthouse audit
2. Check bundle sizes
3. Review recent changes
4. Check CDN status

**Resolution:**
```bash
# Analyze bundle
npm run build
# Look for large chunks in dist/

# Check for unoptimized images
ls -lh src/assets/
```

### 404 Errors on Routes (P2)

**Symptoms:**
- Direct navigation to `/algorithms/` fails
- Refresh on sub-page shows 404
- Links work but URL entry doesn't

**Diagnostic Steps:**
1. Verify `astro.config.mjs` base setting
2. Check `_redirects` file exists
3. Test with `npm run preview`

**Resolution:**
```bash
# Check base configuration
cat astro.config.mjs | grep base

# Verify 404.html exists
ls -la dist/404.html
```

### Build Failures (P2)

**Symptoms:**
- GitHub Actions failing
- Local build fails
- TypeScript errors

**Diagnostic Steps:**
```bash
# Check TypeScript
npm run typecheck

# Check linting
npm run lint

# Check links
npm run linkcheck
```

**Resolution:**
```bash
# Fix lint issues
npm run lint -- --fix

# Update dependencies
npm update

# Clean build
rm -rf dist/ node_modules/
npm ci
npm run build
```

### Security Incident (P1)

**Symptoms:**
- Suspicious traffic
- Reported vulnerability
- Unauthorized changes

**Immediate Actions:**
1. Assess scope of incident
2. Rotate secrets if compromised
3. Document findings
4. Notify stakeholders

**Resolution:**
```bash
# Run security audit
npm audit

# Update dependencies
npm audit fix

# Review access logs
# Check GitHub security tab
```

## Performance Troubleshooting

### High LCP (Largest Contentful Paint)

**Causes:**
- Large hero images
- Unoptimized assets
- Render-blocking resources

**Fixes:**
1. Optimize images (WebP format)
2. Lazy load below-fold images
3. Preload critical resources
4. Use font-display: swap

### High CLS (Cumulative Layout Shift)

**Causes:**
- Images without dimensions
- Late-loading fonts
- Dynamic content injection

**Fixes:**
1. Add width/height to images
2. Preload fonts
3. Reserve space for dynamic content
4. Avoid inserting content above existing content

### High TTFB (Time to First Byte)

**Causes:**
- Slow hosting (GitHub Pages is usually fast)
- Large HTML files
- CDN issues

**Fixes:**
1. Enable GitHub Pages CDN
2. Minimize HTML size
3. Check for server-side redirects

## Content Issues

### Broken Internal Links

**Detection:**
```bash
npm run linkcheck
```

**Fix:**
1. Update links in Markdown files
2. Check for moved content
3. Add redirects if URLs changed

### Missing Content

**Symptoms:**
- 404 on expected pages
- Incomplete navigation

**Fix:**
1. Check `src/content/docs/` structure
2. Verify frontmatter has `title` and `description`
3. Rebuild and redeploy

## Monitoring and Alerting

### Sentry Alerts

**Setup:**
- Configure in Sentry dashboard
- Set alert rules for:
  - Error rate > 1%
  - New issues introduced
  - Performance degradation

**Response:**
1. Check Sentry issue details
2. Identify affected users
3. Prioritize based on impact
4. Deploy fix

### Uptime Monitoring

**Setup:**
- Configure UptimeRobot or Checkly
- Monitor every 5 minutes
- Alert on 2 consecutive failures

**Response:**
1. Verify actual outage
2. Check GitHub Pages status
3. Follow Site Down procedure

## Rollback Procedures

### Standard Rollback

```bash
# Find last known good commit
git log --oneline -10

# Revert latest commit
git revert HEAD

# Push to trigger redeploy
git push origin main
```

### Emergency Rollback

```bash
# Reset to specific commit
git reset --hard <commit-hash>

# Force push (use with caution)
git push origin main --force
```

## Post-Incident Review

After resolving any P1 or P2 incident:

1. Document timeline
2. Identify root cause
3. Implement preventive measures
4. Update runbook if needed
5. Schedule post-mortem meeting

## Escalation Contacts

| Role | Contact | Slack |
|------|---------|-------|
| Primary On-Call | @maintainer | #ops |
| Engineering Manager | @manager | #engineering |
| DevOps | @devops | #infrastructure |
| Security | @security | #security |

## Useful Commands

```bash
# Quick health check
curl -sSf https://your-site.github.io/health.json

# Check response time
curl -o /dev/null -s -w "%{time_total}\n" https://your-site.github.io

# Verify SSL
echo | openssl s_client -servername your-site.github.io -connect your-site.github.io:443 2>/dev/null | openssl x509 -noout -dates

# Check DNS
dig your-site.github.io
```
