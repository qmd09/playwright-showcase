import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { USERS, AUTH_STATE_PATH } from '../helpers/testData';
import { LoginPage } from '../pages/LoginPage';

async function globalSetup(_config: FullConfig): Promise<void> {
  const authDir = path.dirname(AUTH_STATE_PATH);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: _config.projects[0].use.baseURL });
  const page = await context.newPage();

  // Use the LoginPage POM so selector changes only need updating in one place.
  // Previously this setup duplicated the raw selectors already defined in LoginPage.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);
  await page.waitForURL('**/inventory.html');

  await context.storageState({ path: AUTH_STATE_PATH });
  await browser.close();
}

export default globalSetup;
