// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  timeout: 180_000,
  expect: {
    timeout: 15_000,
  },
  reporter: 'list',
  use: {
    baseURL: 'https://localhost',
    ignoreHTTPSErrors: true,
    navigationTimeout: 60_000,
    actionTimeout: 30_000,
    trace: 'on-first-retry',
  },

  // Chromium only keeps make test reliable with the local self-signed cert.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
