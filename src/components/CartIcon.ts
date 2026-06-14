import { Page, Locator } from '@playwright/test';

export class CartIcon {
  readonly badge: Locator;
  readonly link: Locator;

  constructor(private readonly page: Page) {
    this.badge = page.locator('.shopping_cart_badge');
    this.link = page.locator('.shopping_cart_link');
  }

  async getCount(): Promise<number> {
    const isVisible = await this.badge.isVisible();
    if (!isVisible) return 0;
    const text = await this.badge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async click(): Promise<void> {
    await this.link.click();
  }

  async isVisible(): Promise<boolean> {
    return this.badge.isVisible();
  }
}
