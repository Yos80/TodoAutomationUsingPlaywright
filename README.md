# Playwright Learning Project

A hands-on project for learning [Playwright](https://playwright.dev/) test automation, covering core concepts (locators, assertions, POM) through to AI-assisted test generation using the Playwright Agents workflow (Planner → Generator → Healer).

---

## Built With

| Technology | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Test automation framework |
| [TypeScript](https://www.typescriptlang.org/) | Language — adds types to JavaScript |
| [Node.js](https://nodejs.org/) | Runtime environment |
| [JSONPlaceholder](https://jsonplaceholder.typicode.com/) | Public fake REST API used for API testing lessons |
| [TodoMVC](https://demo.playwright.dev/todomvc) | Demo app — core Playwright concepts lesson |
| [SauceDemo](https://www.saucedemo.com) | Demo e-commerce app — Playwright Agents lesson |

---

## What's covered

| Concept | Where |
|---|---|
| Basic locators — `getByPlaceholder`, `getByRole`, `getByTestId`, `getByLabel` | `tests/todo/todo-flat.spec.ts` + `tests/todo/todo-fixtures.spec.ts` |
| Assertions (`toBeVisible`, `toContainText`, `toHaveCount`, `toHaveClass`) | both todo spec files |
| Page Object Model (POM) | `tests/todo/pages/TodoPage.ts` + `tests/basics/locators.spec.ts` |
| `test.describe` groups and `beforeEach` hooks | `tests/basics/locators.spec.ts` |
| Hover interactions and dynamic UI | todo spec files |
| API testing with `request` fixture | `tests/todo/todo-api.spec.ts` |
| Playwright Agents — Planner, Generator, Healer | `tests/saucedemo/` + `specs/saucedemo-plan.md` |
| `data-test` attribute selectors | `tests/saucedemo/` |
| Visual regression testing (`toHaveScreenshot`) | `tests/saucedemo/visual.spec.ts` |
| On-failure screenshots | `playwright.config.ts` — `screenshot: 'only-on-failure'` |

---

## Project structure

```
playwright-learning/
├── specs/
│   └── saucedemo-plan.md          # AI-generated test plan (Planner output)
├── tests/
│   ├── basics/
│   │   └── locators.spec.ts       # Core locators + POM style tests
│   ├── todo/
│   │   ├── pages/
│   │   │   └── TodoPage.ts        # Page Object Model for TodoMVC
│   │   ├── todo-flat.spec.ts      # Core flows written inline (no POM)
│   │   ├── todo-fixtures.spec.ts  # Same flows using fixtures
│   │   └── todo-api.spec.ts       # API testing with JSONPlaceholder
│   └── saucedemo/
│       ├── pages/
│       │   └── SaucePage.ts       # Page Object Model for SauceDemo
│       ├── visual.spec.ts-snapshots/  # Baseline PNG files (committed to git)
│       ├── auth.spec.ts           # Login, logout, error cases
│       ├── products.spec.ts       # Catalog, sorting, product detail
│       ├── cart.spec.ts           # Add, remove, continue shopping
│       ├── checkout.spec.ts       # Happy path, validation, cancel
│       └── visual.spec.ts         # Visual regression with toHaveScreenshot
├── playwright.config.ts           # Playwright configuration
└── package.json
```

### Two todo spec files — why?

`todo-flat.spec.ts` and `locators.spec.ts` test the same app on purpose.

- **Flat style** (`todo-flat.spec.ts`) — every step written directly in the test. Quick to write, but selectors are repeated and harder to maintain.
- **POM style** (`locators.spec.ts`) — interactions go through `TodoPage`, a shared class. Tests stay short and readable; selector changes only need updating in one place.

---

## Playwright Agents

The `tests/saucedemo/` lesson demonstrates the Playwright Agents workflow:

1. **Planner** — explores the app in a real browser and produces `specs/saucedemo-plan.md`
2. **Generator** — reads the plan, executes each step live to verify selectors, then writes the `.spec.ts` files
3. **Healer** — runs tests, diagnoses failures, patches broken selectors/assertions, and re-runs until green

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

**Run a specific lesson**

```bash
npx playwright test tests/todo/
npx playwright test tests/saucedemo/
npx playwright test tests/basics/
```

**Run in headed mode** (see the browser)

```bash
npx playwright test --headed
```

**Open the HTML report** after a run

```bash
npx playwright show-report
```

**Run visual regression tests**

```bash
npx playwright test tests/saucedemo/visual.spec.ts
```

**Regenerate visual baselines** (after intentional UI change)

```bash
npx playwright test tests/saucedemo/visual.spec.ts --update-snapshots
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
page.locator('[data-test="login-button"]')        // by data-test attribute
```

### Assertions

All assertions are auto-retried until they pass or time out:

```ts
await expect(locator).toBeVisible();
await expect(locator).toContainText('1 item left');
await expect(locator).toHaveCount(3);
await expect(locator).toHaveClass(/completed/);
await expect(page).toHaveURL(/inventory/);
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
- [Playwright Agents Docs](https://playwright.dev/docs/test-agents)
- [TodoMVC Demo App](https://demo.playwright.dev/todomvc)
- [SauceDemo](https://www.saucedemo.com)

---

## Acknowledgements

Built with assistance from [Claude Code](https://claude.ai/claude-code) (Anthropic) —
an AI coding assistant used to accelerate test development, structure learning lessons,
and review code quality.
