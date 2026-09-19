/**
 * 设计令牌导出：把 src/styles/tokens.css 的 CSS 自定义属性导出为
 * public/design-tokens.json（构建产物，不入库），供其他项目/工具消费。
 *
 * 令牌只服务于本站 CSS 是既有限制（docs/plans/2026-09-04 §5.2 第 12 项）；
 * 这里以"发布一份机器可读快照"的方式落地，而不是抽独立 npm 包——
 * 本项目的令牌量级和复用诉求还撑不起一个包的维护成本。
 *
 * 由 `npm run prebuild` 调用；extractTokens 同时被单元测试直接导入校验。
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const tokensPath = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles/tokens.css");

/**
 * @typedef {Object} TokenLayers
 * @property {Record<string, string>} primitives
 * @property {Record<string, string>} light
 * @property {Record<string, string>} dark
 * @property {Record<string, string>} starlight
 */

/**
 * 从 CSS 文本提取各令牌层的自定义属性。
 * 逐块匹配选择器前缀，块内用一条正则抓全部 `--name: value;`。
 *
 * @param {string} css
 * @returns {TokenLayers}
 */
export function extractTokens(css) {
  function blockProperties(openIndex) {
    const depthStart = css.indexOf("{", openIndex);
    let depth = 1;
    let end = depthStart;
    for (let i = depthStart + 1; i < css.length && depth > 0; i++) {
      if (css[i] === "{") depth++;
      if (css[i] === "}") depth--;
      end = i;
    }
    const body = css.slice(depthStart + 1, end);
    const props = {};
    for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      props[match[1]] = match[2].trim();
    }
    return props;
  }

  // 选择器 → 层：primitives 是第一个 :root；light/dark 按 data-theme 定位
  const layers = { primitives: {}, light: {}, dark: {}, starlight: {} };
  const selectorRe = /(^|\n)\s*([^{}\n@]+)\{/g;
  let match;
  while ((match = selectorRe.exec(css)) !== null) {
    const selector = match[2].trim();
    const props = blockProperties(match.index);
    if (selector === ":root" && Object.keys(layers.primitives).length === 0) {
      // tokens.css 的第一个 :root 块是 primitives（有 not-found 单测守住块顺序）
      layers.primitives = props;
    } else if (
      selector === ":root" ||
      selector === ':root, [data-theme="light"]' ||
      selector === '[data-theme="light"]'
    ) {
      for (const [k, v] of Object.entries(props)) layers.light[k] = v;
    } else if (selector === '[data-theme="dark"]') {
      for (const [k, v] of Object.entries(props)) layers.dark[k] = v;
    }
  }

  // Starlight 桥接：第二个无 data-theme 的 :root 块里 --sl-* 前缀的部分
  const starlightRoot = css.indexOf("--sl-color-bg:");
  if (starlightRoot > 0) {
    const rootBlocks = [...css.matchAll(/(^|\n):root\s*\{/g)].map((m) => m.index);
    const bridgeStart = rootBlocks.find(
      (idx) => idx > 0 && css.indexOf("--sl-color-bg:", idx) < css.indexOf("}", idx)
    );
    if (bridgeStart !== undefined) {
      const props = blockProperties(bridgeStart);
      for (const [k, v] of Object.entries(props)) {
        if (k.startsWith("--sl-")) layers.starlight[k] = v;
      }
    }
  }

  return layers;
}

/**
 * @param {string} css
 * @returns {{ $meta: { description: string, colorSystem: string, layers: Record<string, number> } } & TokenLayers}
 */
export function buildSnapshot(css) {
  const layers = extractTokens(css);
  const count = Object.values(layers).reduce((sum, layer) => sum + Object.keys(layer).length, 0);
  if (count === 0) throw new Error("tokens.css 未解析出任何令牌，导出中止");
  return {
    $meta: {
      description:
        "PyToTS 设计令牌快照，由 scripts/export-tokens.mjs 从 src/styles/tokens.css 生成，请勿手改。",
      colorSystem: "OKLCH",
      layers: Object.fromEntries(
        Object.entries(layers).map(([k, v]) => [k, Object.keys(v).length])
      ),
    },
    ...layers,
  };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const snapshot = buildSnapshot(readFileSync(tokensPath, "utf8"));
  const outPath = resolve(dirname(fileURLToPath(import.meta.url)), "../public/design-tokens.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    `design-tokens.json: ${Object.values(snapshot.$meta.layers).reduce(
      (a, b) => a + b,
      0
    )} 个令牌 → ${outPath}`
  );
}
