import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly loginPrompt: Locator;
  readonly registerLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPrompt = page.getByText('Register / Login account to proceed on checkout.', { exact: true });
    this.registerLoginLink = page.getByRole('link', { name: 'Register / Login', exact: true });
  }
}
