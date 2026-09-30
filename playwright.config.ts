import { defineConfig, devices } from "@playwright/test";
const preview = process.env.PREVIEW_URL;
if (preview && !/^https:\/\/[^/]+(?:\/.*)?$/.test(preview)) throw new Error("PREVIEW_URL must be an HTTPS URL.");
export default defineConfig({
  testDir: "./e2e", fullyParallel: true, forbidOnly: !!process.env.CI, retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined, reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: preview || "http://127.0.0.1:3000", trace: "retain-on-failure", screenshot: "only-on-failure", video: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "iphone", use: { ...devices["iPhone 13"], defaultBrowserType: "webkit" } },
    { name: "android", use: { ...devices["Pixel 7"], defaultBrowserType: "chromium" } },
    { name: "tablet", use: { ...devices["iPad (gen 7)"], defaultBrowserType: "webkit" } },
  ],
  webServer: preview ? undefined : {
    command: "npm run start -- --hostname 127.0.0.1", url: "http://127.0.0.1:3000", reuseExistingServer: false,
    timeout: 120000,
  },
});
