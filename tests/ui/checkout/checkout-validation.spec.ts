import { test, expect } from '../../../src/fixtures/auth.fixture';
import { PRODUCTS, CHECKOUT_DATA } from '../../../src/helpers/testData';

test.describe('Checkout Validation', () => {
  test.beforeEach(async ({ inventoryPage, cartPage, navBar }) => {
    await inventoryPage.goto();
    await navBar.resetAppState();
    await inventoryPage.addProductToCart(PRODUCTS[0]);
    await navBar.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('should show error when first name is empty', async ({ checkoutPage }) => {
    const { missingFirstName } = CHECKOUT_DATA;
    await checkoutPage.fillShippingDetails(
      missingFirstName.firstName,
      missingFirstName.lastName,
      missingFirstName.zip,
    );
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('should show error when last name is empty', async ({ checkoutPage }) => {
    const { missingLastName } = CHECKOUT_DATA;
    await checkoutPage.fillShippingDetails(
      missingLastName.firstName,
      missingLastName.lastName,
      missingLastName.zip,
    );
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  test('should show error when zip is empty', async ({ checkoutPage }) => {
    const { missingZip } = CHECKOUT_DATA;
    await checkoutPage.fillShippingDetails(
      missingZip.firstName,
      missingZip.lastName,
      missingZip.zip,
    );
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });
});
