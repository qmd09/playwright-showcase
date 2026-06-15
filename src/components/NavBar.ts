import { Locator, Page } from '@playwright/test';

export class NavBar {
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly allItemsLink: Locator;
  readonly resetAppStateLink: Locator;

  private readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.closeButton = page.locator('#react-burger-cross-btn');
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async goToAllItems(): Promise<void> {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  async closeMenu(): Promise<void> {
    await this.closeButton.click();
    await this.logoutLink.waitFor({ state: 'hidden' });
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppStateLink.click();
    await this.closeMenu();
  }
}
