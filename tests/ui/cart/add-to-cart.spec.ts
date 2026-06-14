import { test, expect } from '../../../src/fixtures/auth.fixture';
import { PRODUCTS } from '../../../src/helpers/testData';

test.describe('Add to Cart', () => {
  test.beforeEach(async ({ inventoryPage, navBar }) => {
    await inventoryPage.goto();
    await navBar.resetAppState();
  });

  test('should add single item to cart', async ({ inventoryPage, cartIcon }) => {
    await inventoryPage.addProductToCart(PRODUCTS[0]);
    expect(await cartIcon.getCount()).toBe(1);
  });

  test('should add multiple items to cart', async ({ inventoryPage, cartIcon }) => {
    await inventoryPage.addProductToCart(PRODUCTS[0]);
    await inventoryPage.addProductToCart(PRODUCTS[1]);
    await inventoryPage.addProductToCart(PRODUCTS[2]);
    expect(await cartIcon.getCount()).toBe(3);
  });

  test('should update cart badge count correctly', async ({ inventoryPage, cartIcon }) => {
    expect(await cartIcon.getCount()).toBe(0);
    await inventoryPage.addProductToCart(PRODUCTS[0]);
    expect(await cartIcon.getCount()).toBe(1);
    await inventoryPage.addProductToCart(PRODUCTS[1]);
    expect(await cartIcon.getCount()).toBe(2);
  });

  test('should persist cart items after navigation', async ({
    inventoryPage,
    cartIcon,
    navBar,
  }) => {
    await inventoryPage.addProductToCart(PRODUCTS[0]);
    await navBar.goToAllItems();
    expect(await cartIcon.getCount()).toBe(1);
  });
});
