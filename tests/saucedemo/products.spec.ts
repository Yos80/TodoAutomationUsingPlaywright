// spec: specs/saucedemo-plan.md

import { test, expect } from '@playwright/test';
import { SaucePage } from './pages/SaucePage';

test.describe('Product Catalog', () => {
  let sauce: SaucePage;

  test.beforeEach(async ({ page }) => {
    sauce = new SaucePage(page);
    await sauce.login();
    await expect(page).toHaveURL(/inventory/);
  });

  test('2.1 all 6 products are displayed', async ({ page }) => {
    // Each product should have name, price, and add-to-cart button
    await expect(sauce.inventoryItems).toHaveCount(6);
    await expect(page.locator('.inventory_item_name').first()).toBeVisible();
    await expect(page.locator('.inventory_item_price').first()).toBeVisible();
    await expect(page.locator('[data-test^="add-to-cart"]').first()).toBeVisible();
  });

  test('2.2 sort by price low to high shows cheapest item first', async ({ page }) => {
    // Sort by price ascending
    await sauce.sortBy('lohi');

    // Sauce Labs Onesie is $7.99 — cheapest
    await expect(sauce.firstItemName).toHaveText('Sauce Labs Onesie');
    await expect(page.locator('.inventory_item_price').first()).toHaveText('$7.99');
  });

  test('2.3 sort by name Z to A reverses alphabetical order', async ({ page }) => {
    // Sort Z to A
    await sauce.sortBy('za');

    // "Test.allTheThings() T-Shirt (Red)" starts with T — last alphabetically becomes first
    await expect(sauce.firstItemName).toHaveText('Test.allTheThings() T-Shirt (Red)');
  });

  test('2.4 clicking product name opens detail page', async ({ page }) => {
    // Click on Sauce Labs Backpack
    await page.getByText('Sauce Labs Backpack').first().click();

    // Detail page shows product info
    await expect(page).toHaveURL(/inventory-item/);
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_details_price')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
  });
});
