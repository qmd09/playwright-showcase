import { test, expect } from '../../src/fixtures/auth.fixture';

// Run npx playwright test --update-snapshots to regenerate baselines
test.describe('Visual — Inventory Page', () => {
  test('should match inventory page screenshot baseline', async ({
    inventoryPage,
    authenticatedPage,
  }) => {
    await inventoryPage.goto();
    await expect(authenticatedPage).toHaveScreenshot('inventory-page.png', { fullPage: true });
  });

  test('should match inventory page after sorting', async ({
    inventoryPage,
    authenticatedPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.sortBy('za');
    await expect(authenticatedPage).toHaveScreenshot('inventory-page-sorted-za.png', {
      fullPage: true,
    });
  });
});
