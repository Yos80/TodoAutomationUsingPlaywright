// Visual regression tests for SauceDemo
// How baselines work:
//   First run:  no baseline exists → Playwright saves the screenshot as baseline
//   Later runs: Playwright compares the new screenshot to the saved baseline
//   If pixels differ → test fails and shows a diff image in the HTML report
//
// To regenerate baselines (e.g. after intentional UI change):
//   npx playwright test tests/saucedemo/visual.spec.ts --update-snapshots

import { test, expect } from '@playwright/test';
import { SaucePage } from './pages/SaucePage';

// Visual baselines are OS-specific (darwin vs linux) so we skip on CI.
// To run locally: npx playwright test tests/saucedemo/visual.spec.ts
// To regenerate baselines: npx playwright test tests/saucedemo/visual.spec.ts --update-snapshots
test.describe('Visual Regression', () => {
  test.skip(!!process.env.CI, 'Visual baselines are generated on macOS — skipped on CI');
  let sauce: SaucePage;

  test.beforeEach(async ({ page }) => {
    sauce = new SaucePage(page);
    await sauce.login();
    await expect(page).toHaveURL(/inventory/);
  });

  test('product catalog matches baseline', async ({ page }) => {
    // Capture the full product grid and compare to saved baseline
    await expect(page.locator('.inventory_list')).toHaveScreenshot(
      'product-catalog.png'
    );
  });

  test('sorted by price shows correct visual order', async ({ page }) => {
    // Sort by price low to high
    await sauce.sortBy('lohi');

    // Visual snapshot confirms the new order is rendered correctly
    await expect(page.locator('.inventory_list')).toHaveScreenshot(
      'product-catalog-price-asc.png'
    );
  });

  test('login page matches baseline', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // Full page screenshot of the login screen
    await expect(page).toHaveScreenshot('login-page.png');
  });
});
