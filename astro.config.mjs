import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://typescript-python-web.github.io",
  integrations: [
    starlight({
      title: "Python to TypeScript",
      customCss: [
        "./src/styles/tokens.css",
        "./src/styles/accessibility.css",
        "./src/styles/custom-layout.css",
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
