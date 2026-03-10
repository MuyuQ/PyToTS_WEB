import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://typescript-python-web.github.io",
  integrations: [
    starlight({
      title: "Python to TypeScript",
      customCss: ["./src/styles/tokens.css"],
    }),
  ],
});