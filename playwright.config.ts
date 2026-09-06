import { defineConfig } from "@playwright/test";

/**
 * E2E tests run against the real Next.js dev server (Turbopack HMR parity
 * with what the user sees). Uses system Chrome — no browser download needed.
 * If a dev server is already listening on the port, Playwright reuses it.
 */
const PORT = Number(process.env.E2E_PORT ?? 59901);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    channel: "chrome",
    headless: true,
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
