import { type Locator, type Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search Product');
    this.searchButton = page.getByRole('button', { name: '', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://automationexercise.com/products');
  }

  productCard(productName: string): Locator {
    return this.page.locator('.product-image-wrapper').filter({ hasText: productName }).first();
  }

  async searchFor(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async openProduct(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('link', { name: /View Product/ }).click();
  }
}
