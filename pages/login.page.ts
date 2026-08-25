import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginForm = page.locator('form[action="/login"]');
    this.emailInput = this.loginForm.getByPlaceholder('Email Address');
    this.passwordInput = this.loginForm.getByPlaceholder('Password');
    this.loginButton = this.loginForm.getByRole('button', { name: 'Login', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://automationexercise.com/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
