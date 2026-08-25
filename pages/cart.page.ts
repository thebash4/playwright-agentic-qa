import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly proceedToCheckoutButton: Locator;
  readonly checkoutLoginPrompt: Locator;
  readonly registerLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout', { exact: true });
    this.checkoutLoginPrompt = page.getByText('Register / Login account to proceed on checkout.', { exact: true });
    this.registerLoginLink = page.getByRole('link', { name: 'Register / Login', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://automationexercise.com/view_cart');
  }

  itemRow(productName: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: productName });
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}
