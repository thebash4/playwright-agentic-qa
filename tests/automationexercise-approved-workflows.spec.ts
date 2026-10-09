import { expect, test } from '../fixtures/test.fixture';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { LoginPage } from '../pages/login.page';
import { ProductDetailsPage } from '../pages/product-details.page';
import { ProductsPage } from '../pages/products.page';

const testEmail = process.env.AUTOMATIONEXERCISE_TEST_EMAIL;
const testPassword = process.env.AUTOMATIONEXERCISE_TEST_PASSWORD;

test.describe('Automation Exercise approved customer workflows', () => {


  test('TC-AUTH-005 — Log in with valid credentials', async ({ page }) => {
    test.skip(!testEmail || !testPassword, 'Valid disposable credentials are required.');

    const loginPage = new LoginPage(page);

    // Submit valid credentials from Signup / Login.
    await loginPage.goto();
    await loginPage.login(testEmail!, testPassword!);

    // Visit Products and Cart.
    await expect(page.getByText(/Logged in as/i)).toBeVisible();
    await page.getByRole('link', { name: /Products/ }).click();
    await expect(page).toHaveURL(/\/products$/);
    await page.getByRole('link', { name: /Cart/ }).click();
    await expect(page).toHaveURL(/\/view_cart$/);
    await expect(page.getByText(/Logged in as/i)).toBeVisible();
  });

  test('TC-AUTH-007 — Reject invalid login credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const invalidCredentials = [
      { email: 'unregistered-automation@example.invalid', password: 'invalid-password' },
      { email: testEmail ?? 'existing-account@example.invalid', password: 'incorrect-password' },
    ];

    for (const credentials of invalidCredentials) {
      // Submit each invalid combination separately.
      await loginPage.goto();
      await loginPage.login(credentials.email, credentials.password);
      await expect(page.getByText('Your email or password is incorrect!', { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: /Signup \/ Login/ })).toBeVisible();
    }
  });

  test('TC-SEARCH-001 — Search for an exact known product', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    // Search for Blue Top.
    await productsPage.goto();
    await productsPage.searchFor('Blue Top');

    // Inspect the result card and open its detail.
    await expect(page.getByRole('heading', { name: 'Searched Products', exact: true })).toBeVisible();
    await expect(productsPage.productCard('Blue Top')).toContainText('Rs. 500');
    await productsPage.openProduct('Blue Top');
    await expect(page.getByRole('heading', { name: 'Blue Top', exact: true })).toBeVisible();
    await expect(page.getByText('Rs. 699', { exact: true })).toBeVisible();
  });

  test('TC-DETAIL-002 — Add a product with default quantity', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);

    // Open detail and keep the displayed default quantity.
    await productsPage.goto();
    await productsPage.openProduct('Blue Top');
    await expect(productDetailsPage.quantityInput).toHaveValue('1');

    // Select Add to cart and View Cart.
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.viewCartLink).toBeVisible();
    await productDetailsPage.viewCart();

    // Verify the selected product, quantity, and line total in Cart.
    const blueTopRow = cartPage.itemRow('Blue Top');
    await expect(blueTopRow).toContainText('Rs. 500');
    await expect(blueTopRow.getByRole('button', { name: '1', exact: true })).toBeVisible();
    await expect(blueTopRow).toContainText('Rs. 500');
  });

  test('TC-CART-001 — Add multiple distinct products and calculate totals', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);

    // Add the first product from its detail page.
    await productsPage.goto();
    await productsPage.openProduct('Blue Top');
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.continueShoppingButton).toBeVisible();
    await productDetailsPage.continueShopping();
    // Return to the product catalogue.
    await productsPage.goto();

    // Add the second product from its detail page and open Cart.
    await productsPage.openProduct('Men Tshirt');
  
    // DEBUG: Confirm we actually reached the correct product detail page.
await expect(page).toHaveURL(/product_details/);

await expect(
  page.getByRole('heading', { name: 'Men Tshirt', exact: true })
).toBeVisible();

// Only try Add to Cart after confirming we're on Men Tshirt.
await productDetailsPage.addToCart();

    await expect(productDetailsPage.viewCartLink).toBeVisible();
    await productDetailsPage.viewCart();

    // Verify both cart lines and their price-by-quantity totals.
    const blueTopRow = cartPage.itemRow('Blue Top');
    const menTshirtRow = cartPage.itemRow('Men Tshirt');
    await expect(blueTopRow).toContainText('Rs. 500');
    await expect(blueTopRow.getByRole('button', { name: '1', exact: true })).toBeVisible();
    await expect(menTshirtRow).toContainText('Rs. 400');
    await expect(menTshirtRow.getByRole('button', { name: '1', exact: true })).toBeVisible();
  });

  test('TC-CHECKOUT-001 — Prevent guest checkout bypass', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add one product and open Cart as a guest.
    await productsPage.goto();
    await productsPage.openProduct('Blue Top');
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.viewCartLink).toBeVisible();
    await productDetailsPage.viewCart();

    // Select Proceed To Checkout and inspect the guest prompt.
    await cartPage.proceedToCheckout();
    await expect(checkoutPage.loginPrompt).toBeVisible();
    await expect(checkoutPage.registerLoginLink).toHaveAttribute('href', '/login');

    // Return to Cart and confirm its item is retained.
    await page.getByRole('button', { name: 'Continue On Cart', exact: true }).click();
    await expect(cartPage.itemRow('Blue Top')).toBeVisible();
  });
});
