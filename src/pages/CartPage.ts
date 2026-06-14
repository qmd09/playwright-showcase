import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
    await this.waitForPageLoad();
  }

  async getCartItems(): Promise<CartItem[]> {
    const items: CartItem[] = [];
    const count = await this.cartItems.count();

    for (let i = 0; i < count; i++) {
      const item = this.cartItems.nth(i);
      const name = (await item.locator('.inventory_item_name').textContent()) ?? '';
      const priceText = (await item.locator('.inventory_item_price').textContent()) ?? '';
      const quantityText = (await item.locator('.cart_quantity').textContent()) ?? '1';
      items.push({
        name,
        price: parseFloat(priceText.replace('$', '')),
        quantity: parseInt(quantityText, 10),
      });
    }

    return items;
  }

  async removeItem(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    await item.locator('button[data-test^="remove"]').click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
