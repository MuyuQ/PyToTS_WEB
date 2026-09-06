/**
 * 内容集合 entry.id 的归一化工具。
 *
 * Astro 4 的 entry.id 保留扩展名（如 `paths/migration/types.mdx`），
 * 这条正则曾经复制在 6 个文件里——正则一旦要改，6 处必须同步。
 */

/** entry.id → 路由 slug（index 页归一到其目录，如 paths/foundation/index.mdx → paths/foundation） */
export function docSlug(id: string): string {
  return id.replace(/\.(mdx|md)$/, "").replace(/(^|\/)index$/, "");
}

/** entry.id → 站内路由（不含部署 base，与 Starlight 生成的路由一致） */
export function docRoute(id: string): string {
  const slug = docSlug(id);
  return slug ? `/${slug}/` : "/";
}
