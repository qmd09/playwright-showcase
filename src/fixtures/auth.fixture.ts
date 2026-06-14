import { test as base, Page } from '@playwright/test';
import { AUTH_STATE_PATH } from '../helpers/testData';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { NavBar } from '../components/NavBar';
import { CartIcon } from '../components/CartIcon';

interface AuthenticatedFixtures {
  authenticatedPage: Page;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  navBar: NavBar;
  cartIcon: CartIcon;
}

// Run npx playwright test --update-snapshots to regenerate baselines
export const test = base.extend<AuthenticatedFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: AUTH_STATE_PATH,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  inventoryPage: async ({ authenticatedPage }, use) => {
    await use(new InventoryPage(authenticatedPage));
  },

  cartPage: async ({ authenticatedPage }, use) => {
    await use(new CartPage(authenticatedPage));
  },

  checkoutPage: async ({ authenticatedPage }, use) => {
    await use(new CheckoutPage(authenticatedPage));
  },

  navBar: async ({ authenticatedPage }, use) => {
    await use(new NavBar(authenticatedPage));
  },

  cartIcon: async ({ authenticatedPage }, use) => {
    await use(new CartIcon(authenticatedPage));
  },
});

export { expect } from '@playwright/test';
