# Troubleshooting Guide

## Build Failures

### TypeScript Errors

**Error: `Cannot find module` or `Cannot resolve`**

```bash
# Symptoms
- Build fails with module resolution errors
- Import statements show errors

# Solutions
1. Check tsconfig.json paths
   cat tsconfig.json

2. Verify imports use correct relative paths
   - Use `../components/` not `/components/`
   - Check case sensitivity (Linux vs Windows)

3. Reinstall dependencies
   rm -rf node_modules/
   npm ci

4. Check for circular dependencies
   npx madge --circular src/
```

**Error: `Type error: Type 'X' is not assignable to type 'Y'`**

```bash
# Solutions
1. Run typecheck to see full error
   npm run typecheck

2. Check interface definitions
   grep -r "interface.*Y" src/

3. Update type annotations
   # Add explicit type to variable
   const x: Type = value;
```

### Astro Build Errors

**Error: `Cannot find module 'astro:content'`**

```bash
# Solutions
1. Regenerate types
   npm run dev
   # Wait for "[content]" to appear
   Ctrl+C
   npm run build

2. Check content config
   cat src/content/config.ts

3. Verify content directory structure
   ls -la src/content/docs/
```

**Error: `getStaticPaths()` required for dynamic routes**

```bash
# Solutions
1. Add getStaticPaths to dynamic pages
   # For [slug].astro
   export async function getStaticPaths() {
     const pages = await getCollection('docs');
     return pages.map(page => ({
       params: { slug: page.slug },
       props: { page },
     }));
   }

2. Or use server-side rendering
   # In astro.config.mjs
   export default defineConfig({
     output: 'server',
   });
```

### Memory Issues

**Error: `JavaScript heap out of memory`**

```bash
# Solutions
1. Increase Node memory
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build

2. On Windows
   set NODE_OPTIONS=--max-old-space-size=4096
   npm run build

3. Check for memory leaks in tests
   npm run test -- --run
```

## Deployment Issues

### GitHub Pages 404

**Symptom: Site shows 404 after deployment**

```bash
# Solutions
1. Check base URL in astro.config.mjs
   # Should match repo name if not custom domain
   base: '/repo-name',

2. Verify GitHub Pages settings
   - Settings > Pages > Source: Deploy from branch
   - Branch: main /root or /docs

3. Check for _redirects file
   cat public/_redirects

4. Wait 5-10 minutes for CDN cache
```

### Assets Not Loading

**Symptom: CSS/JS returns 404**

```bash
# Solutions
1. Check base URL configuration
   cat astro.config.mjs | grep base

2. Verify asset paths in HTML
   curl -s https://your-site.github.io | grep stylesheet

3. Check dist output
   ls -la dist/_astro/
```

### Workflow Failures

**Error: `actions/checkout` fails**

```bash
# Solutions
1. Check repository permissions
   - Settings > Actions > General
   - Workflow permissions: Read and write

2. Verify branch exists
   git branch -a

3. Check for syntax errors in workflow
   cat .github/workflows/deploy-pages.yml
```

## Content Issues

### Markdown Not Rendering

**Symptom: Raw markdown shows on page**

```bash
# Solutions
1. Check file extension
   # Should be .md or .mdx
   ls src/content/docs/

2. Verify frontmatter format
   ---
   title: "Page Title"
   description: "Description"
   ---

3. Check for YAML syntax errors
   # Use yamllint if available
   yamllint src/content/docs/
```

### Code Blocks Not Styled

**Symptom: Code shows without syntax highlighting**

```bash
# Solutions
1. Check expressive-code config
   # In astro.config.mjs
   import starlight from '@astrojs/starlight';

2. Verify CSS is loaded
   # Check for expressive-code CSS in dist/
   ls dist/_astro/ | grep css

3. Clear browser cache
   Ctrl+Shift+R
```

### Navigation Missing Pages

**Symptom: Pages exist but not in sidebar**

```bash
# Solutions
1. Check sidebar config in astro.config.mjs
   cat astro.config.mjs | grep -A 20 sidebar

2. Verify autogenerate config
   {
     label: 'Algorithms',
     autogenerate: { directory: 'algorithms' }
   }

3. Check page frontmatter
   # Should not have 'draft: true'
   grep "draft:" src/content/docs/**/*.md
```

## Test Failures

### Vitest Failures

**Error: `Cannot find module` in tests**

```bash
# Solutions
1. Check vitest.config.ts
   cat vitest.config.ts

2. Verify test setup
   ls tests/setup/

3. Run single test for debugging
   npm run test -- tests/unit/components/Button.spec.ts
```

### Playwright Failures

**Error: `browserType.launch` fails**

```bash
# Solutions
1. Install Playwright browsers
   npx playwright install

2. Check for display issues (Linux)
   export DISPLAY=:99
   xvfb-run npm run test:e2e

3. Run in headed mode to debug
   npx playwright test --headed
```

**Error: `expect(page).toHaveURL` times out**

```bash
# Solutions
1. Check selector exists
   await expect(page.locator('text=Loading')).not.toBeVisible();

2. Increase timeout
   await expect(page).toHaveURL(/algorithms/, { timeout: 10000 });

3. Check for JavaScript errors
   page.on('console', msg => console.log(msg.text()));
```

### Accessibility Failures

**Error: `aria-*` attribute issues**

```bash
# Solutions
1. Run axe-core directly
   npm run test:a11y

2. Check for missing labels
   # Use browser devtools accessibility panel

3. Verify color contrast
   # Use Lighthouse accessibility audit
```

## Link Issues

### Internal Links Broken

**Error: Link checker reports 404s**

```bash
# Solutions
1. Run link check
   npm run linkcheck

2. Check for relative path issues
   # In Markdown, use relative paths
   [Link](../other-file/)
   # Not absolute paths
   [Link](/other-file/)

3. Verify file exists
   ls src/content/docs/path/to/file.md
```

### External Links Broken

**Error: External links return 404**

```bash
# Solutions
1. Check if link is truly broken
   curl -I https://example.com/broken-link

2. Update or remove link
   # Or mark as archived
   [Link](https://example.com) (archived)

3. Add to link checker exceptions if temporary
   # In scripts/link-check.mjs
```

## Performance Issues

### Slow Build Times

**Symptom: Build takes > 5 minutes**

```bash
# Solutions
1. Check for large assets
   find src/assets -size +1M

2. Optimize images
   # Use sharp or other optimizer
   npx sharp -i src/assets/large.png -o src/assets/large.webp

3. Exclude unnecessary files from build
   # In astro.config.mjs
   vite: {
     build: {
       rollupOptions: {
         external: ['some-large-dep']
       }
     }
   }
```

### Large Bundle Size

**Symptom: dist/ folder > 50MB**

```bash
# Solutions
1. Analyze bundle
   npm run build
   ls -lhS dist/_astro/

2. Check for duplicate dependencies
   npm ls --depth=0

3. Use dynamic imports
   const largeLib = await import('large-library');
```

## Environment Issues

### Node Version Issues

**Error: `engines` conflict**

```bash
# Solutions
1. Check Node version
   node --version  # Should be 20+

2. Use nvm to switch
   nvm use 20

3. Update package.json engines
   "engines": {
     "node": ">=20.0.0"
   }
```

### npm Issues

**Error: `npm ERR! code ERESOLVE`**

```bash
# Solutions
1. Clear npm cache
   npm cache clean --force

2. Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install

3. Use --force if necessary
   npm install --force
```

## Recovery Procedures

### Complete Reset

If nothing else works:

```bash
# 1. Clean everything
rm -rf node_modules/ dist/ .astro/

# 2. Clear caches
npm cache clean --force

# 3. Reinstall
npm ci

# 4. Rebuild
npm run build

# 5. Test
npm run check
```

### Debug Mode

Enable verbose logging:

```bash
# Astro verbose
DEBUG=* npm run dev

# Node verbose
NODE_DEBUG=module npm run build

# Vitest verbose
npm run test -- --reporter=verbose
```

## Getting Help

If issues persist:

1. Check [Astro documentation](https://docs.astro.build)
2. Check [Starlight documentation](https://starlight.astro.build)
3. Search GitHub Issues
4. Ask in Discord/Forums
5. Create minimal reproduction
