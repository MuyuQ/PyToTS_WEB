# Troubleshooting Guide

## Build Failures

### TypeScript Errors

**Error: `Cannot find module 'virtual:starlight/components/ThemeSelect'`**

This project does not override `ThemeSelect` in `astro.config.mjs`, so this error indicates an environment-specific issue. Check that `astro.config.mjs` does not reference `ThemeSelect` in the `components` block.

```bash
Get-Content astro.config.mjs | Select-String -Pattern "ThemeSelect"
```

**General TypeScript errors:**

```bash
npm run typecheck
```

### Astro Build Errors

**Error: `Cannot find module 'astro:content'`**

```bash
npm run dev
# Wait for "[content]" to appear, then Ctrl+C
npm run build
```

**Memory Issues on Windows:**

```bash
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## Deployment Issues

### GitHub Pages 404

Check `base` config in `astro.config.mjs` — should be `/PyToTS_WEB/`:

```bash
Get-Content astro.config.mjs | Select-String "base"
```

### Assets Not Loading

```bash
# Verify asset paths
curl -s https://muyuq.github.io/PyToTS_WEB/ | Select-String "stylesheet"

# Check dist output
ls dist/_astro/
```

## Content Issues

### Navigation Missing Pages

Check sidebar config in `astro.config.mjs`:

```bash
Get-Content astro.config.mjs | Select-String -Pattern "(autogenerate|label)"
```

Verify frontmatter does not have `draft: true`:

```bash
Select-String -Pattern "draft:" src/content/docs/*/*.mdx
```

## Test Failures

### Vitest Failures

```bash
npm run test -- --run
```

### Playwright Failures

```bash
npx playwright install
npx playwright test --headed
```

### Accessibility Failures

```bash
npm run test:a11y
```

## Link Issues

```bash
npm run linkcheck
```

## Environment Issues

### Node Version

```bash
node --version  # Should be 20+
```

### npm Issues

```bash
npm cache clean --force
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
```

## Complete Reset

```bash
Remove-Item -Recurse -Force node_modules, dist, .astro -ErrorAction SilentlyContinue
npm cache clean --force
npm ci
npm run build
npm run check
```

## Getting Help

- [Astro documentation](https://docs.astro.build)
- [Starlight documentation](https://starlight.astro.build)
- Check `.github/workflows/` for CI configuration
