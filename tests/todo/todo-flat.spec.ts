import { test, expect } from '@playwright/test';

/**
 * todo-flat.spec.ts — Flat-style tests (no Page Object Model)
 *
 * These cover the same core scenarios as locators.spec.ts, but every
 * interaction is written inline rather than through a shared class.
 *
 * Purpose: show the contrast between flat tests and the POM approach.
 * Flat tests are quick to write but become harder to maintain as the
 * suite grows — that's why the POM pattern exists.
 */

const BASE = 'https://demo.playwright.dev/todomvc';

// Adding a todo and checking it appears in the list with the correct counter
test('add a todo and verify it appears', async ({ page }) => {
  await page.goto(BASE);
  await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await expect(page.getByText('Buy milk', { exact: true })).toBeVisible();
  await expect(page.getByTestId('todo-count')).toContainText('1 item left');
});

// Checking a todo as complete should update its style and drop the counter to 0
test('check a todo as complete', async ({ page }) => {
  await page.goto(BASE);
  await page.getByPlaceholder('What needs to be done?').fill('Learn Playwright');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByTestId('todo-item').first().getByLabel('Toggle Todo').check();
  await expect(page.getByTestId('todo-item')).toHaveClass(/completed/);
  await expect(page.getByTestId('todo-count')).toContainText('0 items left');
});

// Deleting a todo: hover to reveal the delete button, then click it
test('delete a todo', async ({ page }) => {
  await page.goto(BASE);
  await page.getByPlaceholder('What needs to be done?').fill('Delete me');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  const item = page.getByTestId('todo-item').first();
  await item.hover();
  await item.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Delete me', { exact: true })).not.toBeVisible();
});

// Filtering: add two todos, complete one, then verify only the active one shows
test('filter by active', async ({ page }) => {
  await page.goto(BASE);
  await page.getByPlaceholder('What needs to be done?').fill('Active');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByPlaceholder('What needs to be done?').fill('Done');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByTestId('todo-item').nth(1).getByLabel('Toggle Todo').check();
  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  // Scope inside the todo item to avoid matching the 'Active' filter link too
  await expect(page.getByTestId('todo-item').first()).toContainText('Active');
});
