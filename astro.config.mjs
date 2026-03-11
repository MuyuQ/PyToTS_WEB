import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://typescript-python-web.github.io",
  integrations: [
    starlight({
      title: "Python to TypeScript",
      customCss: ["./src/styles/tokens.css", "./src/styles/accessibility.css"],
      disable404Route: true,
      sidebar: [
        {
          label: "学习路径",
          autogenerate: { directory: "paths" },
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
