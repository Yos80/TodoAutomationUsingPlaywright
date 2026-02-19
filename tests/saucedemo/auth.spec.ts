// spec: specs/saucedemo-plan.md

import { test, expect } from '@playwright/test';
import { SaucePage } from './pages/SaucePage';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    const sauce = new SaucePage(page);
    await sauce.navigate();
  });

  test('1.1 successful login redirects to inventory', async ({ page }) => {
    const sauce = new SaucePage(page);

    // Fill credentials and submit
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Should land on inventory page
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('1.2 locked out user sees error message', async ({ page }) => {
    // Fill locked out credentials and submit
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Should show locked out error
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Sorry, this user has been locked out.'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('1.3 empty credentials shows username required error', async ({ page }) => {
    // Submit with no credentials
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('1.4 logout returns to login page', async ({ page }) => {
    const sauce = new SaucePage(page);

    // Login first
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);

    // Logout via hamburger menu
    await sauce.logout();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
