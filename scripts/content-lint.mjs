/**
 * 内容规范检查（纳入 npm run check）：
 * 1. 标题中不允许出现 emoji（标题体系保持专业、目录可扫视）
 * 2. 不允许根相对内部链接（子路径部署下会 404，必须使用相对链接）
 * 3. frontmatter 必填字段（与 src/content/config.ts 的 lesson/algorithm 约束对齐）
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const DOCS = join(process.cwd(), "src", "content", "docs");
const EMOJI =
  // eslint-disable-next-line no-misleading-character-class -- emoji 匹配需要这些码位范围
  /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{2B00}-\u{2BFF}]/u;

// 与 config.ts superRefine 对齐：kind 决定必填字段
const REQUIRED_BY_KIND = {
  lesson: ["level", "topic", "difficulty", "prerequisites", "python_tags", "ts_tags"],
  algorithm: ["difficulty", "tags"],
};

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end === -1) return {};
  const data = {};
  for (const line of text.slice(3, end).split("\n")) {
    const match = line.match(/^([A-Za-z_][\w-]*)\s*:/);
    if (match) data[match[1]] = true;
  }
  const kindMatch = text.slice(3, end).match(/^kind\s*:\s*['"]?(\w+)/m);
  if (kindMatch) data.kind = kindMatch[1];
  return data;
}

/**
 * 检查单个内容文件的文本，返回问题描述列表（纯函数，可单测）。
 */
export function lintLines(rel, text) {
  const issues = [];
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const loc = `${rel}:${index + 1}`;
    if (/^#{1,6}\s/.test(line) && EMOJI.test(line)) {
      issues.push(`${loc} 标题含 emoji: ${line.trim().slice(0, 60)}`);
    }
    for (const match of line.matchAll(/\]\((\/[^)\s]*)\)/g)) {
      issues.push(`${loc} 根相对链接（请改为相对链接）: ${match[1]}`);
    }
    for (const match of line.matchAll(/<a\s+[^>]*href="(\/[^"]*)"/g)) {
      issues.push(`${loc} 根相对链接（请改为相对链接）: ${match[1]}`);
    }
  });

  const frontmatter = parseFrontmatter(text);
  const required = REQUIRED_BY_KIND[frontmatter.kind] ?? [];
  for (const field of required) {
    if (!frontmatter[field]) {
      issues.push(`${rel}:1 frontmatter 缺少必填字段: ${field}（kind=${frontmatter.kind}）`);
    }
  }
  return issues;
}

const toPosix = (p) => p.split(sep).join("/");

function collectFiles(dir, files) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collectFiles(full, files);
    else if (name.endsWith(".mdx") || name.endsWith(".md")) files.push(full);
  }
  return files;
}

function main() {
  const files = collectFiles(DOCS, []);
  const issues = [];
  for (const file of files) {
    const rel = toPosix(relative(process.cwd(), file));
    issues.push(...lintLines(rel, readFileSync(file, "utf8")));
  }

  if (issues.length) {
    console.error(`content-lint: ${issues.length} 个问题`);
    for (const issue of issues) console.error("  " + issue);
    process.exit(1);
  }
  console.log(`content-lint: ${files.length} 个内容文件全部通过`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
