import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { USERS } from '../../../src/helpers/testData';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    expect(await loginPage.isLoggedIn()).toBe(true);
  });

  test('should show error with invalid username', async ({ page }) => {
    await loginPage.login('invalid_user', USERS.standard.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('should show error with invalid password', async () => {
    await loginPage.login(USERS.standard.username, 'wrong_password');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('should show error with empty credentials', async () => {
    await loginPage.login('', '');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  const validUsers = [
    USERS.standard,
    USERS.problem,
    USERS.performance,
  ] as const;

  for (const user of validUsers) {
    test(`should login with user: ${user.username}`, async () => {
      await loginPage.login(user.username, user.password);
      expect(await loginPage.isLoggedIn()).toBe(true);
    });
  }
});
