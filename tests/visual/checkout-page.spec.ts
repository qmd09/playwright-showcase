import { test, expect } from '../../src/fixtures/auth.fixture';
import { PRODUCTS } from '../../src/helpers/testData';

// Run npx playwright test --update-snapshots to regenerate baselines
test.describe('Visual — Checkout Page', () => {
  test('should match checkout step one screenshot baseline', async ({
    inventoryPage,
    cartPage,
    authenticatedPage,
    navBar,
  }) => {
    await inventoryPage.goto();
    await navBar.resetAppState();
    await inventoryPage.addProductToCart(PRODUCTS[0]);
    await navBar.goToCart();
    await cartPage.proceedToCheckout();
    await expect(authenticatedPage).toHaveScreenshot('checkout-step-one.png', { fullPage: true });
  });
});
