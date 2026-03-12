# Monitoring and Alerting Configuration

## Overview

This document describes the monitoring and alerting setup for the Python to TypeScript Learning Site.

## Sentry Error Tracking

### Installation

```bash
npm install @sentry/browser @sentry/integrations
```

### Configuration

Create `src/lib/sentry.ts`:

```typescript
import * as Sentry from "@sentry/browser";

export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: "YOUR_SENTRY_DSN_HERE",
      integrations: [Sentry.BrowserTracing()],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.VITE_ENVIRONMENT || "production",
    });
  }
}
```

### Initialize in Layout

In `src/layouts/MainLayout.astro` or entry point:

```typescript
import { initSentry } from "../lib/sentry";

initSentry();
```

### Error Boundary Component

Create `src/components/ErrorBoundary.tsx`:

```tsx
import * as Sentry from "@sentry/browser";
import type { Component, JSX } from "solid-js";

interface Props {
  children: JSX.Element;
  fallback?: JSX.Element;
}

export const ErrorBoundary: Component<Props> = (props) => {
  try {
    return props.children;
  } catch (error) {
    Sentry.captureException(error);
    return (
      props.fallback || (
        <div class="error-fallback">
          <h2>Something went wrong</h2>
          <p>We have been notified and are working on it.</p>
        </div>
      )
    );
  }
};
```

## Uptime Monitoring

### UptimeRobot Configuration

```yaml
# UptimeRobot Setup
Monitors:
  - Name: "Python TS Learning Site"
    URL: "https://your-site.github.io"
    Type: HTTP(s)
    Interval: 5 minutes
    Alert Contacts:
      - Email: admin@example.com
      - Webhook: https://hooks.slack.com/...

  Advanced Settings:
    - Keyword Check: "Python to TypeScript"
    - Response Time Threshold: 3000ms
    - SSL Expiry Alert: 14 days before
```

### Checkly Configuration

Create `checkly.config.ts`:

```typescript
import { defineConfig } from "checkly";

export default defineConfig({
  projectName: "python-ts-learning-site",
  logicalId: "python-ts-site",
  checks: {
    locations: ["us-east-1", "eu-west-1", "ap-southeast-1"],
    runtimeId: "2024.02",
    checkMatch: "**/__checks__/**/*.check.ts",
    playwrightConfig: {
      use: {
        baseURL: process.env.ENVIRONMENT_URL || "https://your-site.github.io",
      },
    },
  },
});
```

Create `__checks__/homepage.check.ts`:

```typescript
import { test, expect } from "@playwright/test";

test("homepage loads successfully", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toBeVisible();
});

test("algorithm page loads", async ({ page }) => {
  const response = await page.goto("/algorithms/");
  expect(response?.status()).toBe(200);
});

test("learning paths load", async ({ page }) => {
  const response = await page.goto("/paths/");
  expect(response?.status()).toBe(200);
});
```

## Performance Monitoring

### Core Web Vitals Thresholds

```yaml
Performance:
  LCP (Largest Contentful Paint):
    Good: < 2.5s
    Needs Improvement: 2.5s - 4.0s
    Poor: > 4.0s
    Alert Threshold: > 3.0s

  FID (First Input Delay):
    Good: < 100ms
    Needs Improvement: 100ms - 300ms
    Poor: > 300ms
    Alert Threshold: > 150ms

  CLS (Cumulative Layout Shift):
    Good: < 0.1
    Needs Improvement: 0.1 - 0.25
    Poor: > 0.25
    Alert Threshold: > 0.15

  TTFB (Time to First Byte):
    Good: < 600ms
    Alert Threshold: > 800ms
```

### Lighthouse CI Integration

Already configured in `lighthouserc.json`:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

## Alerting Channels

### Email Alerts

Configure in monitoring tools:
- UptimeRobot: admin@example.com
- Sentry: team@example.com
- Checkly: devops@example.com

### Slack Integration

```bash
# UptimeRobot Slack webhook
https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Sentry Slack integration
Configure in Sentry dashboard: Settings > Integrations > Slack

# Checkly Slack webhook
Configure in Checkly dashboard: Alert Settings > Slack
```

### PagerDuty/OpsGenie (Optional)

```yaml
Escalation Policy:
  Level 1:
    - Primary on-call engineer
    - Response time: 15 minutes

  Level 2:
    - Engineering manager
    - Response time: 30 minutes

  Severity Levels:
    - P1: Site down or completely unusable
    - P2: Major functionality affected
    - P3: Minor issues or degraded performance
    - P4: Low priority issues
```

## Health Checks

### Custom Health Endpoint

Create `public/health.json`:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z",
  "checks": {
    "build": "pass",
    "content": "pass",
    "cdn": "pass"
  }
}
```

### Build Status Badge

Add to README.md:

```markdown
[![Deploy Status](https://github.com/user/repo/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/user/repo/actions)
[![Lighthouse CI](https://github.com/user/repo/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/user/repo/actions)
```

## Runbook Links

- [Deployment Runbook](./DEPLOYMENT.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Incident Response](./RUNBOOK.md)
