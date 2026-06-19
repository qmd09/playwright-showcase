import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async waitForPageLoad(): Promise<void> {
    // Use domcontentloaded rather than networkidle. networkidle waits for 500ms
    // of zero network activity which causes flaky timeouts on pages with polling,
    // WebSockets, or third-party scripts. Subclasses should override goto() to
    // wait for a specific element that signals the page is ready for interaction.
    await this.page.waitForLoadState('domcontentloaded');
  }

  getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  async clickElement(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).fill(value);
  }

  async getText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) ?? '';
  }

  async isVisible(selector: string): Promise<boolean> {
    return this.page.locator(selector).isVisible();
  }

  async waitForElement(selector: string): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible' });
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}
