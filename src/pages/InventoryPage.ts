import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { SortOption } from '../types';

export class InventoryPage extends BasePage {
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
    await this.waitForPageLoad();
  }

  async getProductNames(): Promise<string[]> {
    return this.productItems.locator('.inventory_item_name').allTextContents();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.productItems.filter({ hasText: productName });
    await product.locator('button[data-test^="add-to-cart"]').click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const product = this.productItems.filter({ hasText: productName });
    await product.locator('button[data-test^="remove"]').click();
  }

  async getCartCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async navigateToProduct(productName: string): Promise<void> {
    await this.productItems.filter({ hasText: productName }).locator('.inventory_item_name').click();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.productItems.locator('.inventory_item_price').allTextContents();
    return priceTexts.map((p) => parseFloat(p.replace('$', '')));
  }
}
