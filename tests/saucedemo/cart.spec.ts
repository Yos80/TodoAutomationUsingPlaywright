// spec: specs/saucedemo-plan.md

import { test, expect } from '@playwright/test';
import { SaucePage } from './pages/SaucePage';

test.describe('Shopping Cart', () => {
  let sauce: SaucePage;

  test.beforeEach(async ({ page }) => {
    sauce = new SaucePage(page);
    await sauce.login();
    await expect(page).toHaveURL(/inventory/);
  });

  test('3.1 adding an item shows badge and changes button to Remove', async ({ page }) => {
    // Add Sauce Labs Backpack to cart
    await sauce.addToCart('sauce-labs-backpack');

    // Cart badge should show 1
    await expect(sauce.cartBadge).toHaveText('1');

    // Button should change to Remove
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  });

  test('3.2 adding multiple items shows correct count in cart', async ({ page }) => {
    // Add two items
    await sauce.addToCart('sauce-labs-backpack');
    await sauce.addToCart('sauce-labs-bike-light');

    // Badge should show 2
    await expect(sauce.cartBadge).toHaveText('2');

    // Navigate to cart and verify both items are there
    await sauce.goToCart();
    await expect(sauce.cartItems).toHaveCount(2);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
  });

  test('3.3 removing an item from cart empties the cart', async ({ page }) => {
    // Seed: add item then go to cart
    await sauce.addToCart('sauce-labs-backpack');
    await sauce.goToCart();

    // Remove the item
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // Cart should be empty
    await expect(sauce.cartItems).toHaveCount(0);
    await expect(sauce.cartBadge).not.toBeVisible();
  });

  test('3.4 continue shopping returns to products page', async ({ page }) => {
    // Seed: add item then go to cart
    await sauce.addToCart('sauce-labs-backpack');
    await sauce.goToCart();

    // Click Continue Shopping
    await page.locator('[data-test="continue-shopping"]').click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });
});
