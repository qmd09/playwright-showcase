import { test, expect } from '../../../src/fixtures/auth.fixture';
import { PRODUCTS } from '../../../src/helpers/testData';
import { ProductPage } from '../../../src/pages/ProductPage';

test.describe('Product Listing', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('should display all 6 products', async ({ inventoryPage }) => {
    await expect(inventoryPage.productItems).toHaveCount(6);
  });

  test('should display product name, price and image for each product', async ({
    inventoryPage,
  }) => {
    const count = await inventoryPage.productItems.count();
    for (let i = 0; i < count; i++) {
      const item = inventoryPage.productItems.nth(i);
      await expect(item.locator('.inventory_item_name')).toBeVisible();
      await expect(item.locator('.inventory_item_price')).toBeVisible();
      await expect(item.locator('img.inventory_item_img')).toBeVisible();
    }
  });

  test('should navigate to product detail on click', async ({ inventoryPage, authenticatedPage }) => {
    const firstProductName = PRODUCTS[0];
    await inventoryPage.navigateToProduct(firstProductName);

    const productPage = new ProductPage(authenticatedPage);
    const details = await productPage.getProductDetails();

    expect(details.name).toBe(firstProductName);
    expect(authenticatedPage.url()).toContain('/inventory-item.html');
  });
});
