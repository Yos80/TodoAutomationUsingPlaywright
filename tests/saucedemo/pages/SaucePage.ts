import { Page, Locator } from '@playwright/test';

export class SaucePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  async navigate() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username = 'standard_user', password = 'secret_sauce') {
    await this.navigate();
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByText('Logout').click();
  }

  // ── Inventory ────────────────────────────────────────────────────────────────

  async addToCart(itemSlug: string) {
    await this.page.locator(`[data-test="add-to-cart-${itemSlug}"]`).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.page.locator('[data-test="product-sort-container"]').selectOption(option);
  }

  get inventoryItems(): Locator {
    return this.page.locator('.inventory_item');
  }

  get firstItemName(): Locator {
    return this.page.locator('.inventory_item_name').first();
  }

  // ── Cart ─────────────────────────────────────────────────────────────────────

  async goToCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  get cartBadge(): Locator {
    return this.page.locator('.shopping_cart_badge');
  }

  get cartItems(): Locator {
    return this.page.locator('.cart_item');
  }

  // ── Checkout ─────────────────────────────────────────────────────────────────

  async fillCheckoutInfo(firstName: string, lastName: string, zip: string) {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(zip);
  }

  // ── Common locators ───────────────────────────────────────────────────────────

  get errorMessage(): Locator {
    return this.page.locator('[data-test="error"]');
  }
}
