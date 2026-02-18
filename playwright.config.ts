import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the TodoMVC learning project.
 * Full config reference: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory where test files live
  testDir: './tests',

  // Run all test files in parallel
  fullyParallel: true,

  // Fail the CI build if test.only is accidentally left in source
  forbidOnly: !!process.env.CI,

  // Retry failed tests twice on CI, no retries locally
  retries: process.env.CI ? 2 : 0,

  // Limit parallelism on CI to avoid resource contention
  workers: process.env.CI ? 1 : undefined,

  // Generate an HTML report after each run (open with: npx playwright show-report)
  reporter: 'html',

  use: {
    // Capture a trace on the first retry of a failed test
    // View traces at: https://trace.playwright.dev
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to run tests on additional browsers:
    // { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',   use: { ...devices['Desktop Safari']  } },
  ],
});
