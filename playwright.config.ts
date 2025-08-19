import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',    // folder where your tests will live
  timeout: 30000,        // test timeout in ms
  expect: {
    timeout: 5000,       // timeout for expect assertions
  },
  retries: 1,            // retry failed tests once
  reporter: 'list',      // test results reporter
  projects: [
    // Define projects to run tests in different browsers
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'WebKit', use: { ...devices['Desktop Safari'] } },
  ],
  use: {
    headless: true,      // run browsers in headless mode
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
});
