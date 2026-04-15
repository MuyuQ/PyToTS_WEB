import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://muyuq.github.io",
  base: "/PyToTS_WEB/",
  integrations: [
    starlight({
      title: "Python to TypeScript",
      head: [
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
      ],
      disable404Route: true,
      components: {
        Banner: "./src/components/Banner.astro",
        Pagination: "./src/components/Pagination.astro",
        Header: "./src/components/Header.astro",
      },
      sidebar: [
        {
          label: "学习路径",
          items: [
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
          autogenerate: { directory: "algorithms" },
        },
        {
          label: "练习与测验",
          autogenerate: { directory: "practice" },
        },
        {
          label: "分类索引",
          items: [
            { label: "Tags", link: "/tags/" },
            { label: "Difficulty", link: "/difficulty/" },
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
