import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://muyuq.github.io",
  base: "/PyToTS_WEB/",
  integrations: [
    starlight({
      title: "PyToTS",
      description:
        "面向 Python 开发者的 TypeScript 学习平台：双语对照课程、36 道算法题解与交互测验。",
      defaultLocale: "root",
      locales: {
        root: {
          label: "简体中文",
          lang: "zh-CN",
        },
      },
      social: {
        github: "https://github.com/MuyuQ/PyToTS_WEB",
      },
      head: [
        {
          tag: "meta",
          attrs: { property: "og:image", content: "https://muyuq.github.io/PyToTS_WEB/og.png" },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:width", content: "1200" },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:height", content: "630" },
        },
        {
          tag: "meta",
          attrs: { name: "twitter:card", content: "summary_large_image" },
        },
        {
          tag: "link",
          attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: "true",
          },
        },
        {
          // Google Fonts 在大陆网络不可靠，阻塞式加载会拖死首屏。
          // 先按 print 媒体加载（不阻塞渲染），加载完再切回 all。
          // 字体只覆盖拉丁字形，中文字形始终由系统字体栈兜底，晚到不白屏。
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap",
            media: "print",
            onload: "this.media='all'",
          },
        },
        {
          // 主题底色提前落地，避免首帧白闪。必须内联（首帧前执行）。
          // DARK/LIGHT 是 tokens.css 的 --surface-page 字面值快照——tokens.css
          // 改底色时这里必须同步（404 页走构建期抽取，没有这个维护点）。
          tag: "script",
          attrs: { "is:inline": true },
          content: `
            (function () {
              var DARK = '#08090b';
              var LIGHT = '#fdfdfe';
              function apply() {
                try {
                  var theme = localStorage.getItem('starlight-theme');
                  if (!theme || theme === 'auto') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  var color = theme === 'dark' ? DARK : LIGHT;
                  document.documentElement.style.backgroundColor = color;
                } catch (e) {}
              }
              apply();
              document.addEventListener('astro:page-load', apply);
            })();
          `,
        },
      ],
      customCss: [
        "./src/styles/tokens.css",
        "./src/styles/base.css",
        "./src/styles/layout.css",
        "./src/styles/components.css",
        "./src/styles/code.css",
        "./src/styles/tabs-custom.css",
        "./src/styles/home.css",
      ],
      disable404Route: true,
      components: {
        Banner: "./src/components/Banner.astro",
        Pagination: "./src/components/Pagination.astro",
        Header: "./src/components/Header.astro",
        PageTitle: "./src/components/overrides/PageTitle.astro",
      },
      /* 侧边栏按「用户任务」而不是「内容类型」分组：
         课程（按顺序学）→ 实战（练）→ 参考（查）→ 我的（进度）→ 关于
         每个 autogenerate 组的目录均含 index.mdx，点击组名即进入该组入口页。 */
      sidebar: [
        {
          label: "课程",
          items: [
            { label: "全部路径", link: "/paths/" },
            {
              label: "准备",
              collapsed: true,
              autogenerate: { directory: "paths/preparation" },
            },
            {
              label: "基础",
              collapsed: true,
              autogenerate: { directory: "paths/foundation" },
            },
            {
              label: "迁移",
              collapsed: true,
              autogenerate: { directory: "paths/migration" },
            },
            {
              label: "进阶",
              collapsed: true,
              autogenerate: { directory: "paths/advanced" },
            },
          ],
        },
        {
          label: "实战",
          items: [
            {
              label: "算法题库",
              collapsed: true,
              autogenerate: { directory: "algorithms" },
            },
            { label: "编程测验", link: "/practice/quiz/" },
            { label: "练习与自测", link: "/practice/" },
          ],
        },
        {
          label: "参考",
          items: [
            {
              label: "对照手册",
              autogenerate: { directory: "handbook" },
            },
            { label: "标签索引", link: "/tags/" },
            { label: "难度索引", link: "/difficulty/" },
          ],
        },
        {
          label: "我的",
          items: [{ label: "进度与收藏", link: "/bookmarks/" }],
        },
        {
          label: "关于",
          items: [
            { label: "关于与贡献", link: "/about/" },
            {
              label: "English（未完成）",
              collapsed: true,
              autogenerate: { directory: "en" },
            },
          ],
        },
      ],
    }),
  ],
});
