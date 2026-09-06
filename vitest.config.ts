import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**/*.spec.ts"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      // 只统计可单测的源码（lib 模块与数据契约）；dist 产物、配置文件、
      // .astro 组件不在单测射程内，算进来只会稀释数字。
      // learning-routes / neighbours 依赖 astro:content 虚拟模块，jsdom 单测
      // 无法加载，由构建 + sidebar-order e2e + linkcheck 间接覆盖。
      include: ["src/lib/**", "src/data/**"],
      exclude: ["**/*.d.ts", "src/lib/learning-routes.ts", "src/lib/neighbours.ts"],
      // 阈值按实测值留 3~4 点余量（实测：行 96.7 / 函数 90.2 / 分支 82.9 / 语句 96.7）
      thresholds: {
        lines: 92,
        functions: 85,
        branches: 80,
        statements: 92,
      },
    },
  },
});
