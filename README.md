# Playwright Learning Project

A hands-on project for learning [Playwright](https://playwright.dev/) test automation using the [TodoMVC](https://demo.playwright.dev/todomvc) demo app.

---

## What's covered

| Concept | Where |
|---|---|
| Basic locators (`getByPlaceholder`, `getByRole`, `getByTestId`, `getByLabel`) | `tests/todo-flat.spec.ts` |
| Assertions (`toBeVisible`, `toContainText`, `toHaveCount`, `toHaveClass`) | both spec files |
| Page Object Model (POM) | `tests/pages/TodoPage.ts` + `tests/locators.spec.ts` |
| `test.describe` groups and `beforeEach` hooks | `tests/locators.spec.ts` |
| Hover interactions and dynamic UI | both spec files |

---

## Project structure

```
playwright-learning/
├── tests/
│   ├── todo-flat.spec.ts      # Core flows written inline (no POM)
│   ├── locators.spec.ts       # Same flows + more, using the POM
│   └── pages/
│       └── TodoPage.ts        # Page Object Model for TodoMVC
├── playwright.config.ts       # Playwright configuration
└── package.json
```

### Two spec files — why?

`todo-flat.spec.ts` and `locators.spec.ts` test the same app on purpose.

- **Flat style** (`todo-flat.spec.ts`) — every step written directly in the test. Quick to write, but selectors are repeated and harder to maintain.
- **POM style** (`locators.spec.ts`) — interactions go through `TodoPage`, a shared class. Tests stay short and readable; selector changes only need updating in one place.

---

## Getting started

**Install dependencies**

```bash
npm install
npx playwright install
```

**Run all tests**

```bash
npx playwright test
```

**Run a single spec file**

```bash
npx playwright test tests/locators.spec.ts
```

**Run in headed mode** (see the browser)

```bash
npx playwright test --headed
```

**Open the HTML report** after a run

```bash
npx playwright show-report
```

---

## Key Playwright concepts used

### Locators

Playwright recommends user-facing locators that mirror how a real user finds elements:

```ts
page.getByPlaceholder('What needs to be done?')  // by input placeholder
page.getByRole('button', { name: 'Delete' })      // by ARIA role + name
page.getByTestId('todo-item')                     // by data-testid attribute
page.getByLabel('Toggle Todo')                    // by associated label
```

### Assertions

All assertions are auto-retried until they pass or time out:

```ts
await expect(locator).toBeVisible();
await expect(locator).toContainText('1 item left');
await expect(locator).toHaveCount(3);
await expect(locator).toHaveClass(/completed/);
```

### Page Object Model

```ts
// Instead of repeating this everywhere:
await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
await page.getByPlaceholder('What needs to be done?').press('Enter');

// You write this:
await todoPage.addTodo('Buy milk');
```

---

## Resources

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [TodoMVC Demo App](https://demo.playwright.dev/todomvc)
