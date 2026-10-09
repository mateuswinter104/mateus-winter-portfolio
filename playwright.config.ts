import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "reduced-motion", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" } },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `${BASE_URL}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    stdout: "pipe",
  },
});
