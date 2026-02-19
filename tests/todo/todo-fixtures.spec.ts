/**
 * todo-fixtures.spec.ts — Learning: Custom Fixtures
 *
 * ─── WHAT IS A FIXTURE? ──────────────────────────────────────────────────────
 * A fixture is reusable setup (and optional teardown) that Playwright
 * injects into your test automatically — just like `page` or `request`.
 *
 * You've already been using built-in fixtures without thinking about it:
 *
 *   test('example', async ({ page }) => { ... })
 *                              ^^^^
 *                              This is a built-in fixture!
 *
 * Custom fixtures let you define your own. Instead of repeating the same
 * setup code at the top of every test, you move it into a fixture once
 * and Playwright runs it automatically before each test that uses it.
 *
 * ─── THE PROBLEM IN todo-flat.spec.ts ────────────────────────────────────────
 * Every test starts with:
 *   await page.goto(BASE);
 *
 * And most tests also add a todo before doing anything:
 *   await page.getByPlaceholder('What needs to be done?').fill('...');
 *   await page.getByPlaceholder('What needs to be done?').press('Enter');
 *
 * That's repeated setup — the perfect job for fixtures.
 *
 * ─── THE SOLUTION: Two custom fixtures ───────────────────────────────────────
 *   1. `navigatedPage`  — a page already open at the TodoMVC URL
 *   2. `pageWithTodo`   — a page already open WITH one todo pre-added
 *
 * ─── HOW TO CREATE CUSTOM FIXTURES ───────────────────────────────────────────
 * You call `test.extend()` and pass an object where each key is a fixture name
 * and each value is an async function with this signature:
 *
 *   async ({ page }, use) => {
 *     // 1. SETUP — runs before the test
 *     await page.goto('...');
 *
 *     // 2. USE — hands control to the test
 *     await use(page);
 *
 *     // 3. TEARDOWN (optional) — runs after the test
 *     // e.g. clear database, log out, etc.
 *   }
 *
 * The `use()` call is the boundary between setup and teardown.
 * Everything before it runs before the test. Everything after it runs after.
 */

import { test as base, expect, Page } from '@playwright/test';

const BASE = 'https://demo.playwright.dev/todomvc';

// ─── Step 1: Define your fixture types ───────────────────────────────────────
//
// TypeScript needs to know the shape of your custom fixtures.
// We define a type for each one — here both are just a `Page` object.

type MyFixtures = {
  navigatedPage: Page;   // A page already at the TodoMVC URL
  pageWithTodo: Page;    // A page at TodoMVC with one todo pre-added
};

// ─── Step 2: Extend the base `test` with your fixtures ───────────────────────
//
// We import `test as base` so we can extend it.
// The result is a new `test` function that includes our custom fixtures.
// We export nothing — just use this `test` locally in this file.

const test = base.extend<MyFixtures>({

  // Fixture 1: navigatedPage
  // Navigates to the app before the test, nothing more.
  // Tests that need a clean empty page use this.
  navigatedPage: async ({ page }, use) => {
    await page.goto(BASE);   // SETUP: open the app
    await use(page);         // HAND OFF: test runs here
    // No teardown needed — Playwright closes the page automatically
  },

  // Fixture 2: pageWithTodo
  // Navigates to the app AND adds one todo before the test starts.
  // Tests that need an existing todo (to complete, delete, etc.) use this.
  pageWithTodo: async ({ page }, use) => {
    await page.goto(BASE);                                             // open the app
    await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
    await page.getByPlaceholder('What needs to be done?').press('Enter'); // add a todo
    await use(page);                                                   // hand off to test
  },

});

// ─── Tests ───────────────────────────────────────────────────────────────────
//
// Compare these to todo-flat.spec.ts — the logic is identical,
// but the setup is gone from the test body. Much cleaner.

// Uses `navigatedPage` because this test adds the todo itself (that's the point)
test('add a todo and verify it appears', async ({ navigatedPage: page }) => {
  // No goto() needed — navigatedPage already handled it
  await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await expect(page.getByText('Buy milk', { exact: true })).toBeVisible();
  await expect(page.getByTestId('todo-count')).toContainText('1 item left');
});

// Uses `pageWithTodo` — the todo is already there, we just check it
test('check a todo as complete', async ({ pageWithTodo: page }) => {
  // No goto() or fill() needed — pageWithTodo already added "Buy milk"
  await page.getByTestId('todo-item').first().getByLabel('Toggle Todo').check();
  await expect(page.getByTestId('todo-item')).toHaveClass(/completed/);
  await expect(page.getByTestId('todo-count')).toContainText('0 items left');
});

// Uses `pageWithTodo` — hover and delete the pre-added todo
test('delete a todo', async ({ pageWithTodo: page }) => {
  const item = page.getByTestId('todo-item').first();
  await item.hover();
  await item.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Buy milk', { exact: true })).not.toBeVisible();
});

// Uses `navigatedPage` — this test adds its own two specific todos
test('filter by active', async ({ navigatedPage: page }) => {
  await page.getByPlaceholder('What needs to be done?').fill('Active');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByPlaceholder('What needs to be done?').fill('Done');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByTestId('todo-item').nth(1).getByLabel('Toggle Todo').check();
  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  // Scope the text assertion inside the todo item to avoid strict mode violation.
  // getByText('Active') would also match the 'Active' filter link — Playwright
  // refuses to act when a locator resolves to more than one element.
  await expect(page.getByTestId('todo-item').first()).toContainText('Active');
});

/**
 * ─── SUMMARY ─────────────────────────────────────────────────────────────────
 *
 * Fixtures vs beforeEach — what's the difference?
 *
 * beforeEach runs for every test in the file regardless.
 * Fixtures are opt-in — a test only gets the fixture if it asks for it
 * by name in its argument list. You can mix and match per test.
 *
 * Fixtures are also composable — a fixture can depend on another fixture,
 * just like `pageWithTodo` internally uses `page` (a built-in fixture).
 *
 * Rule of thumb:
 *   - beforeEach → same setup for every test in a describe block
 *   - fixture    → reusable setup that different tests can opt into
 */
