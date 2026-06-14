import { test, expect } from '../../../src/fixtures/auth.fixture';
import { PRODUCTS, CHECKOUT_DATA } from '../../../src/helpers/testData';

test.describe('Checkout Happy Path', () => {
  test('should complete full purchase flow with valid data', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    navBar,
  }) => {
    // Login is handled by the auth fixture — start from inventory
    await inventoryPage.goto();
    await navBar.resetAppState();

    // Add a product
    await inventoryPage.addProductToCart(PRODUCTS[0]);

    // Go to cart
    await navBar.goToCart();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].name).toBe(PRODUCTS[0]);

    // Proceed to checkout
    await cartPage.proceedToCheckout();

    // Fill shipping details
    const { valid } = CHECKOUT_DATA;
    await checkoutPage.fillShippingDetails(valid.firstName, valid.lastName, valid.zip);

    // Complete purchase
    await checkoutPage.completePurchase();

    // Confirm success
    const successMsg = await checkoutPage.getSuccessMessage();
    expect(successMsg).toContain('Thank you for your order');
  });
});
