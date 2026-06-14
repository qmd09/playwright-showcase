import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

// Run npx playwright test --update-snapshots to regenerate baselines
test.describe('Visual — Login Page', () => {
  test('should match login page screenshot baseline', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveScreenshot('login-page.png', { fullPage: true });
  });
});
