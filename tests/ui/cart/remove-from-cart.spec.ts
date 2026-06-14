import { test, expect } from '../../../src/fixtures/auth.fixture';
import { PRODUCTS } from '../../../src/helpers/testData';

test.describe('Remove from Cart', () => {
  test.beforeEach(async ({ inventoryPage, navBar }) => {
    await inventoryPage.goto();
    await navBar.resetAppState();
    await inventoryPage.addProductToCart(PRODUCTS[0]);
    await inventoryPage.addProductToCart(PRODUCTS[1]);
  });

  test('should remove item from cart page', async ({ cartPage, cartIcon }) => {
    await cartPage.goto();
    await cartPage.removeItem(PRODUCTS[0]);
    const items = await cartPage.getCartItems();
    expect(items.some((i) => i.name === PRODUCTS[0])).toBe(false);
    expect(await cartIcon.getCount()).toBe(1);
  });

  test('should remove item from inventory page', async ({ inventoryPage, cartIcon }) => {
    await inventoryPage.removeProductFromCart(PRODUCTS[0]);
    expect(await cartIcon.getCount()).toBe(1);
  });

  test('should update cart badge after removal', async ({ cartPage, cartIcon }) => {
    await cartPage.goto();
    await cartPage.removeItem(PRODUCTS[0]);
    expect(await cartIcon.getCount()).toBe(1);
    await cartPage.removeItem(PRODUCTS[1]);
    expect(await cartIcon.isVisible()).toBe(false);
  });
});
