import { test, expect } from '../../../src/fixtures/auth.fixture';

test.describe('Product Filter', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('should filter correctly — all items visible by default', async ({ inventoryPage }) => {
    await expect(inventoryPage.productItems).toHaveCount(6);
    const count = await inventoryPage.productItems.count();
    for (let i = 0; i < count; i++) {
      await expect(inventoryPage.productItems.nth(i)).toBeVisible();
    }
  });
});
