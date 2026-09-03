import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    // baseURL 直接含子路径（末尾斜杠不可省略，否则相对路径解析会丢掉子路径）：
    // 用例里写相对路径即可，无需到处硬编码 /PyToTS_WEB
    baseURL: "http://127.0.0.1:4321/PyToTS_WEB/",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4321",
    // 站点部署在子路径下，就绪探测必须指向 base 路径（根路径返回 404）
    url: "http://127.0.0.1:4321/PyToTS_WEB/",
    reuseExistingServer: !process.env.CI,
  },
});
