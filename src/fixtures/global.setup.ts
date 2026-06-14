import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { USERS, UI_BASE_URL, AUTH_STATE_PATH } from '../helpers/testData';

async function globalSetup(_config: FullConfig): Promise<void> {
  const authDir = path.dirname(AUTH_STATE_PATH);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(UI_BASE_URL);
  await page.locator('[data-test="username"]').fill(USERS.standard.username);
  await page.locator('[data-test="password"]').fill(USERS.standard.password);
  await page.locator('[data-test="login-button"]').click();
  await page.waitForURL('**/inventory.html');

  await page.context().storageState({ path: AUTH_STATE_PATH });
  await browser.close();
}

export default globalSetup;
