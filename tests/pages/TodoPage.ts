import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the TodoMVC app.
 *
 * Encapsulates all locators and actions for the todo page so that
 * test files stay readable and changes to the UI only need to be
 * updated here — not in every test.
 *
 * App URL: https://demo.playwright.dev/todomvc
 */
export class TodoPage {
  readonly page: Page;

  // ─── Locators ───────────────────────────────────────────────────────────────
  readonly input: Locator;           // Main text input for new todos
  readonly items: Locator;           // All todo list items
  readonly counter: Locator;         // "X items left" counter in the footer
  readonly footer: Locator;          // Footer bar (hidden when list is empty)
  readonly toggleAll: Locator;       // Checkbox that marks all todos complete
  readonly clearCompletedBtn: Locator; // Button to remove all completed todos

  constructor(page: Page) {
    this.page = page;
    this.input             = page.getByPlaceholder('What needs to be done?');
    this.items             = page.getByTestId('todo-item');
    this.counter           = page.getByTestId('todo-count');
    this.footer            = page.locator('.footer');
    this.toggleAll         = page.getByLabel('Mark all as complete');
    this.clearCompletedBtn = page.getByRole('button', { name: 'Clear completed' });
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /** Navigate to the TodoMVC demo page. */
  async navigate() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  /** Type a todo text and press Enter to add it to the list. */
  async addTodo(text: string) {
    await this.input.fill(text);
    await this.input.press('Enter');
  }

  /** Check the toggle on the todo at the given 0-based index. */
  async checkTodo(index: number) {
    await this.items.nth(index).getByLabel('Toggle Todo').check();
  }

  /** Uncheck the toggle on the todo at the given 0-based index. */
  async uncheckTodo(index: number) {
    await this.items.nth(index).getByLabel('Toggle Todo').uncheck();
  }

  /** Hover the todo at the given index and click its delete button. */
  async deleteTodo(index: number) {
    const item = this.items.nth(index);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  /**
   * Double-click a todo to enter edit mode, replace its text, and confirm
   * the change by pressing Enter.
   */
  async editTodo(index: number, newText: string) {
    await this.items.nth(index).getByTestId('todo-title').dblclick();
    await this.page.getByLabel('Edit').fill(newText);
    await this.page.getByLabel('Edit').press('Enter');
  }

  /**
   * Double-click a todo to enter edit mode, type something, then press
   * Escape to discard the change and keep the original text.
   */
  async cancelEdit(index: number, newText: string) {
    await this.items.nth(index).getByTestId('todo-title').dblclick();
    await this.page.getByLabel('Edit').fill(newText);
    await this.page.getByLabel('Edit').press('Escape');
  }

  /** Click one of the three filter links: All, Active, or Completed. */
  async filterBy(filter: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name: filter }).click();
  }

  /** Click the "Clear completed" button to remove all done todos. */
  async clearCompleted() {
    await this.clearCompletedBtn.click();
  }
}
