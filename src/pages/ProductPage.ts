import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { Product } from '../types';

export class ProductPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.inventory_details_name');
    this.productPrice = page.locator('.inventory_details_price');
    this.productDescription = page.locator('.inventory_details_desc');
    this.addToCartButton = page.locator('button[data-test^="add-to-cart"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async getProductDetails(): Promise<Pick<Product, 'name' | 'price' | 'description'>> {
    const name = (await this.productName.textContent()) ?? '';
    const priceText = (await this.productPrice.textContent()) ?? '';
    const description = (await this.productDescription.textContent()) ?? '';
    return {
      name,
      price: parseFloat(priceText.replace('$', '')),
      description,
    };
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }
}
