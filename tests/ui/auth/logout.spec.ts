import { test, expect } from '../../../src/fixtures/auth.fixture';
import { UI_BASE_URL } from '../../../src/helpers/testData';

test.describe('Logout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('should logout successfully', async ({ navBar, authenticatedPage }) => {
    await navBar.logout();
    expect(authenticatedPage.url()).toBe(`${UI_BASE_URL}/`);
  });

  test('should redirect to login page after logout', async ({ navBar, authenticatedPage }) => {
    await navBar.logout();
    await expect(authenticatedPage.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('should not be able to access inventory after logout', async ({
    navBar,
    authenticatedPage,
  }) => {
    await navBar.logout();
    await authenticatedPage.goto(`${UI_BASE_URL}/inventory.html`);
    expect(authenticatedPage.url()).not.toContain('/inventory.html');
    await expect(authenticatedPage.locator('[data-test="login-button"]')).toBeVisible();
  });
});
