import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;

  // ─── Locators ───────────────────────────────────────────────────────────────
  readonly input: Locator;
  readonly items: Locator;
  readonly counter: Locator;
  readonly footer: Locator;
  readonly toggleAll: Locator;
  readonly clearCompletedBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-item');
    this.counter = page.getByTestId('todo-count');
    this.footer = page.locator('.footer');
    this.toggleAll = page.getByLabel('Mark all as complete');
    this.clearCompletedBtn = page.getByRole('button', { name: 'Clear completed' });
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  async navigate() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTodo(text: string) {
    await this.input.fill(text);
    await this.input.press('Enter');
  }

  async checkTodo(index: number) {
    await this.items.nth(index).getByLabel('Toggle Todo').check();
  }

  async uncheckTodo(index: number) {
    await this.items.nth(index).getByLabel('Toggle Todo').uncheck();
  }

  async deleteTodo(index: number) {
    const item = this.items.nth(index);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  async editTodo(index: number, newText: string) {
    await this.items.nth(index).getByTestId('todo-title').dblclick();
    await this.page.getByLabel('Edit').fill(newText);
    await this.page.getByLabel('Edit').press('Enter');
  }

  async cancelEdit(index: number, newText: string) {
    await this.items.nth(index).getByTestId('todo-title').dblclick();
    await this.page.getByLabel('Edit').fill(newText);
    await this.page.getByLabel('Edit').press('Escape');
  }

  async filterBy(filter: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name: filter }).click();
  }

  async clearCompleted() {
    await this.clearCompletedBtn.click();
  }
}
