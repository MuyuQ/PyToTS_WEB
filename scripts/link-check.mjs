import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const DOCS_ROOT = join(process.cwd(), "src", "content", "docs");
const MDX_EXT = ".mdx";

function collectMdxFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...collectMdxFiles(fullPath));
      continue;
    }
    if (entry.endsWith(MDX_EXT)) {
      files.push(fullPath);
    }
  }

  return files;
}

function toPosixPath(filePath) {
  return filePath.split(sep).join("/");
}

function routeFromDocFile(filePath) {
  const rel = toPosixPath(relative(DOCS_ROOT, filePath));
  const withoutExt = rel.slice(0, -MDX_EXT.length);

  if (withoutExt === "index") return "/";
  if (withoutExt.endsWith("/index")) {
    const dir = withoutExt.slice(0, -"/index".length);
    return `/${dir}/`;
  }
  return `/${withoutExt}/`;
}

function normalizeRoute(rawPath) {
  const trimmed = rawPath.split("#")[0].split("?")[0].trim();
  if (!trimmed.startsWith("/")) return null;
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function extractInternalLinks(content) {
  const links = [];
  const regex = /\[[^\]]*\]\(([^)]+)\)/g;
  let match = regex.exec(content);
  while (match) {
    const href = match[1].trim();
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
      match = regex.exec(content);
      continue;
    }
    const normalized = normalizeRoute(href);
    if (normalized) links.push(normalized);
    match = regex.exec(content);
  }
  return links;
}

const mdxFiles = collectMdxFiles(DOCS_ROOT);
const routes = new Set(mdxFiles.map(routeFromDocFile));
const missing = [];

for (const filePath of mdxFiles) {
  const content = readFileSync(filePath, "utf8");
  const links = extractInternalLinks(content);

  for (const link of links) {
    if (!routes.has(link)) {
      missing.push({ file: toPosixPath(relative(process.cwd(), filePath)), link });
    }
  }
}

if (missing.length > 0) {
  for (const issue of missing) {
    console.error(`Broken internal link in ${issue.file}: ${issue.link}`);
  }
  process.exit(1);
}

console.log(`Link check passed for ${mdxFiles.length} docs files.`);
