/**
 * 构建产物级链接检查：
 * 1. 校验 dist 内所有 HTML 引用的内部 href/src 都能在 dist 中解析（含 base 前缀与锚点）
 * 2. 内部绝对路径必须带 base 前缀（防止再次出现子路径部署下全站 404 的回归）
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const BASE = "/PyToTS_WEB";

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith(".html")) files.push(full);
  }
})(DIST);

const toPosix = (p) => p.split(sep).join("/");

function resolveInDist(pathname) {
  const clean = decodeURIComponent(pathname.split("#")[0].split("?")[0]);
  if (clean === "") return { ok: false };
  const candidates = [];
  const p = join(DIST, clean.replace(/^\/+/, ""));
  if (clean.endsWith("/")) {
    candidates.push(join(p, "index.html"));
  } else {
    candidates.push(p, p + ".html", join(p, "index.html"));
  }
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return { ok: true, file: candidate };
  }
  return { ok: false };
}

function hasAnchor(file, anchor) {
  if (!anchor) return true;
  try {
    const html = readFileSync(file, "utf8");
    return html.includes(`id="${anchor}"`);
  } catch {
    return true; // 读取失败时不因锚点报错（已通过文件存在性校验）
  }
}

const ATTR_RE = /\b(href|src)="([^"]*)"/g;

let checked = 0;
const errors = [];

for (const file of files) {
  const rawHtml = readFileSync(file, "utf8");
  // 剥离 script/style 内容，避免把内联 JS 字符串拼接误认为链接
  const html = rawHtml
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const pageUrlDir = "/" + toPosix(relative(DIST, file)).replace(/[^/]+$/, "");
  for (const match of html.matchAll(ATTR_RE)) {
    const [, attr, raw] = match;
    if (!raw || raw.startsWith("#")) continue; // 页内锚点
    if (/^(https?:|mailto:|javascript:|data:|tel:)/.test(raw)) continue;
    checked += 1;

    let pathname;
    if (raw.startsWith("/")) {
      if (!raw.startsWith(BASE + "/") && raw !== BASE) {
        errors.push(`[${toPosix(relative(DIST, file))}] ${attr}="${raw}" 缺少 base 前缀 ${BASE}`);
        continue;
      }
      pathname = raw.slice(BASE.length) || "/";
    } else {
      // 相对链接：按当前页面 URL 目录解析
      const resolved = new URL(raw, `http://x${pageUrlDir}`).pathname;
      pathname = resolved;
    }

    const result = resolveInDist(pathname);
    if (!result.ok) {
      errors.push(`[${toPosix(relative(DIST, file))}] ${attr}="${raw}" 无法在 dist 中解析`);
      continue;
    }
    const anchor = raw.includes("#") ? decodeURIComponent(raw.split("#")[1]) : "";
    if (attr === "href" && anchor && !hasAnchor(result.file, anchor)) {
      errors.push(`[${toPosix(relative(DIST, file))}] ${attr}="${raw}" 锚点 #${anchor} 不存在`);
    }
  }
}

console.log(`checked ${checked} internal refs in ${files.length} html files`);
if (errors.length) {
  console.error(`\n${errors.length} broken link(s):`);
  for (const error of errors) console.error("  " + error);
  process.exit(1);
}
console.log("all internal links OK");
