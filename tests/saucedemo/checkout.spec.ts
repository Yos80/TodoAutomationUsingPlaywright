// spec: specs/saucedemo-plan.md

import { test, expect } from '@playwright/test';
import { SaucePage } from './pages/SaucePage';

test.describe('Checkout', () => {
  let sauce: SaucePage;

  test.beforeEach(async ({ page }) => {
    // Seed: logged in with one item in cart
    sauce = new SaucePage(page);
    await sauce.login();
    await sauce.addToCart('sauce-labs-backpack');
    await sauce.goToCart();
    await expect(page).toHaveURL(/cart/);
  });

  test('4.1 complete checkout happy path shows confirmation', async ({ page }) => {
    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Fill customer info
    await sauce.fillCheckoutInfo('John', 'Doe', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two/);

    // Review order summary and finish
    await expect(page.locator('.summary_total_label')).toBeVisible();
    await page.locator('[data-test="finish"]').click();

    // Confirmation page
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('4.2 missing first name shows validation error', async ({ page }) => {
    // Proceed to checkout info page
    await page.locator('[data-test="checkout"]').click();

    // Leave first name empty
    await sauce.fillCheckoutInfo('', 'Doe', '12345');
    await page.locator('[data-test="continue"]').click();

    // Should show error
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('4.3 cancelling checkout returns to cart with items intact', async ({ page }) => {
    // Proceed to checkout info page
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Cancel
    await page.locator('[data-test="cancel"]').click();

    // Back on cart page with item still present
    await expect(page).toHaveURL(/cart/);
    await expect(sauce.cartItems).toHaveCount(1);
  });
});
