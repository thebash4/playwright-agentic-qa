import { type Locator, type Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.quantityInput = page.getByRole('spinbutton');
    this.addToCartButton = page.getByRole('button', { name: /Add to cart/ });
    this.viewCartLink = page.getByRole('link').filter({ hasText: 'View Cart' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping', exact: true });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async viewCart(): Promise<void> {
    await this.viewCartLink.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
