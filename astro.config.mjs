import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://muyuq.github.io",
  base: "/PyToTS_WEB/",
  integrations: [
    starlight({
      title: "Python to TypeScript",
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
          attrs: {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
          },
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
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap",
          },
        },
        {
          tag: "style",
          content: `
            :root[data-theme="dark"] { background-color: #0c0e12 !important; }
            :root[data-theme="dark"] body { background-color: #0c0e12 !important; }
            :root[data-theme="light"] header, :root[data-theme="light"] .header { background-color: #ffffff !important; }
          `,
        },
        {
          tag: "script",
          attrs: {
            "is:inline": true,
          },
          content: `
            (function() {
              try {
                var theme = localStorage.getItem('starlight-theme');
                if (!theme || theme === 'auto') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                var bgColor = theme === 'dark' ? '#0c0e12' : '#ffffff';
                document.documentElement.style.setProperty('background-color', bgColor, 'important');
                document.body.style.setProperty('background-color', bgColor, 'important');
              } catch(e) {}
            })();
            document.addEventListener('astro:page-load', function() {
              try {
                var theme = localStorage.getItem('starlight-theme');
                if (!theme || theme === 'auto') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                var bgColor = theme === 'dark' ? '#0c0e12' : '#ffffff';
                document.documentElement.style.setProperty('background-color', bgColor, 'important');
                document.body.style.setProperty('background-color', bgColor, 'important');
              } catch(e) {}
            });
          `,
        },
      ],
      customCss: [
        "./src/styles/tokens.css",
        "./src/styles/custom-layout.css",
        "./src/styles/components.css",
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
      sidebar: [
        {
          label: "学习路径",
          items: [
            {
              label: "准备路径",
              collapsed: true,
              autogenerate: { directory: "paths/preparation" },
            },
            {
              label: "基础路径",
              collapsed: true,
              autogenerate: { directory: "paths/foundation" },
            },
            {
              label: "迁移路径",
              collapsed: true,
              autogenerate: { directory: "paths/migration" },
            },
            {
              label: "进阶路径",
              collapsed: true,
              autogenerate: { directory: "paths/advanced" },
            },
          ],
        },
        {
          label: "手册",
          autogenerate: { directory: "handbook" },
        },
        {
          label: "算法",
          collapsed: true,
          autogenerate: { directory: "algorithms" },
        },
        {
          label: "练习与测验",
          items: [
            { label: "练习与自测", link: "/practice/" },
            { label: "编程测验", link: "/practice/quiz/" },
          ],
        },
        {
          label: "分类索引",
          items: [
            { label: "标签索引", link: "/tags/" },
            { label: "难度索引", link: "/difficulty/" },
          ],
        },
        {
          label: "关于与贡献",
          autogenerate: { directory: "about" },
        },
      ],
    }),
  ],
});
