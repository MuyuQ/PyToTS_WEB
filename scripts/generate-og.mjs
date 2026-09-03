/**
 * 生成社交分享 OG 图（1200×630）：深色底 + 双语对照版式。
 * 产物提交到 public/og.png；改动文案或配色后重新运行本脚本。
 * 注意：依赖本机字体（Segoe UI / Microsoft YaHei / Consolas），CI Linux
 * 缺中文字体时渲染会回退、产物不一致——OG 图以仓库内提交版本为准，
 * 不要在 CI 里重新生成后直接覆盖提交。
 */
import sharp from "sharp";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#12141c"/>
      <stop offset="1" stop-color="#1a1f38"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="4" fill="#4051b5"/>

  <text x="90" y="150" font-family="'Segoe UI', 'Microsoft YaHei', sans-serif" font-size="30" font-weight="600" letter-spacing="6" fill="#8ba2f0">PYTHON → TYPESCRIPT</text>
  <text x="90" y="255" font-family="'Segoe UI', 'Microsoft YaHei', sans-serif" font-size="66" font-weight="700" fill="#ffffff">写给 Python 开发者的</text>
  <text x="90" y="345" font-family="'Segoe UI', 'Microsoft YaHei', sans-serif" font-size="66" font-weight="700" fill="#ffffff">TypeScript 学习路径</text>
  <text x="90" y="415" font-family="'Segoe UI', 'Microsoft YaHei', sans-serif" font-size="28" fill="rgba(224,226,230,0.62)">同一个概念，两种语言，差异一眼可见。</text>

  <g font-family="Consolas, 'Courier New', monospace" font-size="22">
    <rect x="90" y="470" width="480" height="90" rx="10" fill="#0c0e12" stroke="rgba(224,226,230,0.14)"/>
    <circle cx="118" cy="498" r="6" fill="#4b8bbe"/>
    <text x="136" y="506" fill="#e0e2e6">def greet(name: str) -&gt; str:</text>
    <text x="110" y="540" fill="rgba(224,226,230,0.55)">return f"Hello, {name}"</text>

    <rect x="630" y="470" width="480" height="90" rx="10" fill="#0c0e12" stroke="rgba(224,226,230,0.14)"/>
    <circle cx="658" cy="498" r="6" fill="#3178c6"/>
    <text x="676" y="506" fill="#e0e2e6">function greet(name: string) {</text>
    <text x="650" y="540" fill="rgba(224,226,230,0.55)">return \`Hello, \${name}\`;</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("public/og.png written");
