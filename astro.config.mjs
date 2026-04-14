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
          tag: "style",
          content: `
            html { background-color: #f5f1e8; }
            [data-theme="light"] header, [data-theme="light"] .header { background-color: #ede8df !important; }
            [data-theme="dark"] html, [data-theme="dark"] body { background-color: #0f172a !important; }
            [data-theme="high-contrast"] html, [data-theme="high-contrast"] body { background-color: #000000 !important; }
            [data-theme="sepia"] html, [data-theme="sepia"] body { background-color: #f4ecd8 !important; }
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
                var theme = localStorage.getItem('site-theme');
                if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  theme = 'dark';
                }
                if (theme) {
                  document.documentElement.setAttribute('data-theme', theme);
                }
              } catch(e) {}
            })();
          `,
        },
      ],
      customCss: [
        "./src/styles/tokens.css",
        "./src/styles/accessibility.css",
        "./src/styles/custom-layout.css",
        "./src/styles/responsive.css",
        "./src/styles/components.css",
      ],
      disable404Route: true,
      components: {
        Banner: "./src/components/Banner.astro",
        Pagination: "./src/components/Pagination.astro",
        ThemeSelect: "./src/components/ThemeToggle.astro",
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
