import { test, expect } from '@playwright/test';

// Same tests as locators.spec.ts but WITHOUT Page Object Model.
// Everything is written directly inline — no separate class.

const BASE = 'https://demo.playwright.dev/todomvc';

test('add a todo and verify it appears', async ({ page }) => {
  await page.goto(BASE);
  await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await expect(page.getByText('Buy milk', { exact: true })).toBeVisible();
  await expect(page.getByTestId('todo-count')).toContainText('1 item left');
});

test('check a todo as complete', async ({ page }) => {
  await page.goto(BASE);
  await page.getByPlaceholder('What needs to be done?').fill('Learn Playwright');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByTestId('todo-item').first().getByLabel('Toggle Todo').check();
  await expect(page.getByTestId('todo-item')).toHaveClass(/completed/);
  await expect(page.getByTestId('todo-count')).toContainText('0 items left');
});

test('delete a todo', async ({ page }) => {
  await page.goto(BASE);
  await page.getByPlaceholder('What needs to be done?').fill('Delete me');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  const item = page.getByTestId('todo-item').first();
  await item.hover();
  await item.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Delete me', { exact: true })).not.toBeVisible();
});

test('filter by active', async ({ page }) => {
  await page.goto(BASE);
  await page.getByPlaceholder('What needs to be done?').fill('Active');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByPlaceholder('What needs to be done?').fill('Done');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByTestId('todo-item').nth(1).getByLabel('Toggle Todo').check();
  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await expect(page.getByText('Active', { exact: true })).toBeVisible();
});
