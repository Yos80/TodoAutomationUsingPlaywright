import { test, expect } from '@playwright/test';
import { TodoPage } from '../todo/pages/TodoPage';

// ─── UI: Page structure ───────────────────────────────────────────────────────

test.describe('UI — Page structure', () => {
  test('page loads with title and input visible', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await expect(page).toHaveTitle(/TodoMVC/);
    await expect(todoPage.input).toBeVisible();
  });

  test('footer is hidden when no todos exist', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await expect(todoPage.footer).not.toBeVisible();
  });

  test('todo list is empty on load', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await expect(todoPage.items).toHaveCount(0);
  });
});

// ─── Functional: Adding todos ─────────────────────────────────────────────────

test.describe('Functional — Adding todos', () => {
  test('can add a single todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Buy milk');
    await expect(page.getByText('Buy milk', { exact: true })).toBeVisible();
    await expect(todoPage.counter).toContainText('1 item left');
  });

  test('can add multiple todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('First');
    await todoPage.addTodo('Second');
    await todoPage.addTodo('Third');
    await expect(todoPage.items).toHaveCount(3);
    await expect(todoPage.counter).toContainText('3 items left');
  });

  test('pressing enter on empty input does not add a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.input.press('Enter');
    await expect(todoPage.items).toHaveCount(0);
  });
});

// ─── Functional: Completing todos ────────────────────────────────────────────

test.describe('Functional — Completing todos', () => {
  test('checking a todo marks it as complete', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Learn Playwright');
    await todoPage.checkTodo(0);
    await expect(todoPage.items).toHaveClass(/completed/);
    await expect(todoPage.counter).toContainText('0 items left');
  });

  test('unchecking a todo restores it as active', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Learn Playwright');
    await todoPage.checkTodo(0);
    await todoPage.uncheckTodo(0);
    await expect(todoPage.items).not.toHaveClass(/completed/);
    await expect(todoPage.counter).toContainText('1 item left');
  });

  test('toggle-all marks every todo as complete', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('First');
    await todoPage.addTodo('Second');
    await todoPage.toggleAll.check();
    await expect(todoPage.counter).toContainText('0 items left');
  });
});

// ─── Functional: Deleting todos ───────────────────────────────────────────────

test.describe('Functional — Deleting todos', () => {
  test('hovering a todo reveals the delete button', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Delete me');
    const item = todoPage.items.first();
    await item.hover();
    await expect(item.getByRole('button', { name: 'Delete' })).toBeVisible();
  });

  test('clicking delete removes the todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Delete me');
    await todoPage.deleteTodo(0);
    await expect(page.getByText('Delete me', { exact: true })).not.toBeVisible();
  });
});

// ─── Functional: Editing todos ────────────────────────────────────────────────

test.describe('Functional — Editing todos', () => {
  test('double-clicking a todo allows editing', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Old text');
    await todoPage.editTodo(0, 'New text');
    await expect(page.getByText('New text', { exact: true })).toBeVisible();
    await expect(page.getByText('Old text', { exact: true })).not.toBeVisible();
  });

  test('pressing escape while editing cancels the change', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Original');
    await todoPage.cancelEdit(0, 'Changed');
    await expect(page.getByText('Original', { exact: true })).toBeVisible();
  });
});

// ─── Functional: Filtering ────────────────────────────────────────────────────

test.describe('Functional — Filtering', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Active todo');
    await todoPage.addTodo('Completed todo');
    await todoPage.checkTodo(1);
  });

  test('All filter shows every todo', async () => {
    await todoPage.filterBy('All');
    await expect(todoPage.items).toHaveCount(2);
  });

  test('Active filter shows only incomplete todos', async ({ page }) => {
    await todoPage.filterBy('Active');
    await expect(todoPage.items).toHaveCount(1);
    await expect(page.getByText('Active todo', { exact: true })).toBeVisible();
  });

  test('Completed filter shows only completed todos', async ({ page }) => {
    await todoPage.filterBy('Completed');
    await expect(todoPage.items).toHaveCount(1);
    await expect(page.getByText('Completed todo', { exact: true })).toBeVisible();
  });
});

// ─── Functional: Clear completed ─────────────────────────────────────────────

test.describe('Functional — Clear completed', () => {
  test('clear completed removes only done todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Keep me');
    await todoPage.addTodo('Remove me');
    await todoPage.checkTodo(1);
    await todoPage.clearCompleted();
    await expect(todoPage.items).toHaveCount(1);
    await expect(page.getByText('Keep me', { exact: true })).toBeVisible();
    await expect(page.getByText('Remove me', { exact: true })).not.toBeVisible();
  });

  test('clear completed button is not visible when no todos are done', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('Active task');
    await expect(todoPage.clearCompletedBtn).not.toBeVisible();
  });
});

// ─── Functional: Counter ─────────────────────────────────────────────────────

test.describe('Functional — Counter', () => {
  test('shows "1 item left" for a single todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('One thing');
    await expect(todoPage.counter).toContainText('1 item left');
  });

  test('shows "items" plural for more than one todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('One');
    await todoPage.addTodo('Two');
    await expect(todoPage.counter).toContainText('2 items left');
  });

  test('counter only counts active (uncompleted) todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.addTodo('One');
    await todoPage.addTodo('Two');
    await todoPage.checkTodo(0);
    await expect(todoPage.counter).toContainText('1 item left');
  });
});
