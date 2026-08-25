# Automation Exercise — Major Customer Workflows QA Test Plan

## Scope, evidence, and execution rules

This plan covers authentication, product browsing/search/details, cart, checkout/order, and account management for `https://automationexercise.com`. Each case begins in a new browser context with an empty cart and no session unless stated otherwise.

- **Observed**: a screen, control, or transition actually seen during guest exploration; it does not prove the case’s expected result.
- **Proposed validation**: behavior to test that was not verified during exploration.
- **Assumption**: an approved dependency on disposable data or a test environment.
- **Priority**: P0 = revenue/security-blocking; P1 = core journey; P2 = important supporting behavior.

Use unique disposable emails and synthetic profile/payment data. Never store credentials or personal/payment data in source control.

## Authentication

### TC-AUTH-001

- **Title:** Register a new customer with valid required information
- **Priority:** P0
- **Category:** Authentication / Registration
- **Preconditions:** New logged-out context; unique disposable email available.
- **Test Data:** Synthetic name, address, mobile number, password, date of birth, supported country.
- **Steps:** 1. Select **Signup / Login**. 2. Submit name and unique email in **New User Signup!**. 3. Complete required account/address data. 4. Select **Create Account** and continue.
- **Expected Result:** **Proposed validation:** exactly one account is created, confirmation is shown, and the continued session identifies the logged-in customer.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 acquisition path; generated data keeps it repeatable.
- **Evidence / assumption:** Signup entry and account-information form were **observed**; successful registration is unverified.

### TC-AUTH-002

- **Title:** Reject registration with an existing email
- **Priority:** P1
- **Category:** Authentication / Registration validation
- **Preconditions:** New logged-out context; known disposable account exists.
- **Test Data:** Existing disposable email and valid display name.
- **Steps:** Submit the existing email in **New User Signup!**.
- **Expected Result:** **Proposed validation:** an existing-email error is shown; no account/session is created.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Protects account uniqueness with isolated seeded data.
- **Evidence / assumption:** Signup form was **observed**; duplicate-email behavior is unverified.

### TC-AUTH-003

- **Title:** Validate initial signup identity fields
- **Priority:** P1
- **Category:** Authentication / Registration validation
- **Preconditions:** New logged-out context.
- **Test Data:** Blank values and malformed email values.
- **Steps:** Submit the initial signup form with blank fields; repeat with malformed email; correct values and retry.
- **Expected Result:** **Proposed validation:** invalid input is identified, the flow does not advance, and a corrected retry is possible.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Separates entry-form validation from the profile form for diagnosis.
- **Evidence / assumption:** Form was **observed**; validation messages are unverified.

### TC-AUTH-004

- **Title:** Validate required account-information fields
- **Priority:** P1
- **Category:** Authentication / Registration validation
- **Preconditions:** Account-information form reached using a unique email.
- **Test Data:** Valid synthetic baseline profile; one required value omitted per run.
- **Steps:** From the baseline, omit each required profile/address value in turn and select **Create Account**.
- **Expected Result:** **Proposed validation:** submission is blocked, the missing field is identified, and no partial account is created.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** High-value data-integrity coverage; parameterized automation isolates failures.
- **Evidence / assumption:** Account-information form was **observed**; enforcement is unverified.

### TC-AUTH-005

- **Title:** Log in with valid credentials
- **Priority:** P0
- **Category:** Authentication / Login
- **Preconditions:** New logged-out context; approved disposable account exists.
- **Test Data:** Secure disposable-account email and password.
- **Steps:** Submit valid credentials from **Signup / Login**; visit Products and Cart.
- **Expected Result:** **Proposed validation:** only the intended account is authenticated and its session persists across those pages.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 access path and prerequisite for protected workflows.
- **Evidence / assumption:** Login form was **observed**; successful authentication is unverified.

### TC-AUTH-006

- **Title:** Log out and revoke authenticated access
- **Priority:** P0
- **Category:** Authentication / Session management
- **Preconditions:** Authenticated disposable account.
- **Test Data:** Secure disposable credentials.
- **Steps:** Select **Logout**; use browser Back and attempt a prior checkout URL.
- **Expected Result:** **Proposed validation:** authenticated navigation/data are unavailable after logout.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Independent session-security coverage.
- **Evidence / assumption:** Logout result was not verified during exploration.

### TC-AUTH-007

- **Title:** Reject invalid login credentials
- **Priority:** P0
- **Category:** Authentication / Login validation
- **Preconditions:** New logged-out context.
- **Test Data:** Unregistered email; existing email with incorrect password.
- **Steps:** Submit each invalid combination separately.
- **Expected Result:** **Proposed validation:** a clear error is shown, no session is created, and retry is possible.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 account-access protection; variants share one external outcome.
- **Evidence / assumption:** Login form was **observed**; error behavior is unverified.

## Product browsing and search

### TC-BROWSE-001

- **Title:** Browse the catalogue from global navigation
- **Priority:** P1
- **Category:** Product browsing
- **Preconditions:** New guest context.
- **Test Data:** None.
- **Steps:** Select **Products**; inspect a product card; open **View Product**; return to the catalogue.
- **Expected Result:** **Proposed validation:** usable cards are shown and the opened detail matches the selected product.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Core discovery route and purchase prerequisite.
- **Evidence / assumption:** Products navigation, cards, and a detail transition were **observed**.

### TC-BROWSE-002

- **Title:** Browse by category and subcategory
- **Priority:** P1
- **Category:** Product browsing / Taxonomy
- **Preconditions:** New guest context.
- **Test Data:** One visible subcategory each from Women, Men, and Kids.
- **Steps:** Expand each category; select its subcategory; verify the result view; select another category.
- **Expected Result:** **Proposed validation:** each result has correct category context and does not retain stale results.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** High merchandising value using visible user controls.
- **Evidence / assumption:** Category navigation was **observed**; all category mappings are unverified.

### TC-BROWSE-003

- **Title:** Browse listings by brand
- **Priority:** P2
- **Category:** Product browsing / Brand
- **Preconditions:** New guest context on Products.
- **Test Data:** Two visible brands, for example Polo and H&M.
- **Steps:** Select the first brand; inspect label/results; select the second.
- **Expected Result:** **Proposed validation:** brand route/heading and product results change to the selected brand.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Focused brand-filter regression without duplicating category coverage.
- **Evidence / assumption:** Brand navigation was **observed**; result correctness is unverified.

### TC-SEARCH-001

- **Title:** Search for an exact known product
- **Priority:** P1
- **Category:** Product search
- **Preconditions:** New guest context on Products.
- **Test Data:** `Blue Top`.
- **Steps:** Search for `Blue Top`; inspect the result card; open its detail.
- **Expected Result:** **Proposed validation:** **Searched Products** shows the matching product with consistent name/price and matching detail.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Direct product discovery supports conversion.
- **Evidence / assumption:** The `Blue Top` search and detail transition were **observed**.

### TC-SEARCH-002

- **Title:** Show a clear no-match search state
- **Priority:** P2
- **Category:** Product search / Empty state
- **Preconditions:** New guest context on Products.
- **Test Data:** Unique no-match term, such as `zz-no-product-20260824`.
- **Steps:** Search for the no-match term; then search for `Blue Top`.
- **Expected Result:** **Proposed validation:** no stale products remain for the no-match query and a later valid search recovers.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Separates empty-state behavior from successful search.
- **Evidence / assumption:** No-match behavior is unverified.

## Product details

### TC-DETAIL-001

- **Title:** Display complete, consistent product information
- **Priority:** P1
- **Category:** Product details
- **Preconditions:** New guest context.
- **Test Data:** Blue Top or another stable visible product.
- **Steps:** Open detail from Products; compare name/price with its card; inspect category, availability, condition, brand, image, quantity, and add-to-cart control.
- **Expected Result:** **Proposed validation:** required metadata is present and catalogue name/price match detail.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Protects informed purchase decisions.
- **Evidence / assumption:** Detail attributes were **observed**; full consistency was not asserted.

### TC-DETAIL-002

- **Title:** Add a product with default quantity
- **Priority:** P0
- **Category:** Product details / Cart addition
- **Preconditions:** New guest context with empty cart.
- **Test Data:** One stable visible product.
- **Steps:** Open detail; keep displayed default quantity; select **Add to cart**; select **View Cart**.
- **Expected Result:** **Proposed validation:** confirmation appears and Cart has the selected product, quantity 1, and correct line total.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 add-to-cart conversion path.
- **Evidence / assumption:** Added confirmation and View Cart path were **observed**; arithmetic is unverified.

### TC-DETAIL-003

- **Title:** Add a product with changed valid quantity
- **Priority:** P1
- **Category:** Product details / Quantity
- **Preconditions:** New guest context with empty cart.
- **Test Data:** One stable product; integer quantity greater than 1.
- **Steps:** Enter the quantity on detail; add product; open Cart.
- **Expected Result:** **Proposed validation:** Cart reflects selected quantity and price × quantity total.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Separating quantity editing from default addition clarifies failures.
- **Evidence / assumption:** Quantity input was **observed**; changed-quantity behavior is unverified.

### TC-DETAIL-004

- **Title:** Prevent invalid quantity from corrupting Cart
- **Priority:** P2
- **Category:** Product details / Input validation
- **Preconditions:** New guest context with empty cart.
- **Test Data:** Zero, negative, decimal, nonnumeric, and whitespace values where permitted.
- **Steps:** Enter each value separately and add to cart; recover with a valid quantity.
- **Expected Result:** **Proposed validation:** invalid input cannot create an incorrect cart line; valid recovery has correct arithmetic.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Protects order-value integrity.
- **Evidence / assumption:** Input constraints are unverified.

## Shopping cart

### TC-CART-001

- **Title:** Add multiple distinct products and calculate totals
- **Priority:** P0
- **Category:** Shopping cart
- **Preconditions:** New guest context with empty cart.
- **Test Data:** Two distinct visible products.
- **Steps:** Add first product from detail; continue shopping; add second; open Cart.
- **Expected Result:** **Proposed validation:** both lines are correct and each line total equals price × quantity.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 multi-item order integrity.
- **Evidence / assumption:** Cart/add-to-cart flow was **observed**; multi-item totals are unverified.

### TC-CART-002

- **Title:** Remove one selected cart item
- **Priority:** P1
- **Category:** Shopping cart / Item management
- **Preconditions:** New guest context with two distinct cart items.
- **Test Data:** Two visible products.
- **Steps:** Remove one line; verify the other; refresh Cart.
- **Expected Result:** **Proposed validation:** only selected item is removed and remaining item persists unchanged.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Core order-correction behavior.
- **Evidence / assumption:** Removal persistence is unverified.

### TC-CART-003

- **Title:** Maintain a stable empty cart after final-item removal
- **Priority:** P1
- **Category:** Shopping cart / Empty state
- **Preconditions:** New guest context with one cart item.
- **Test Data:** One visible product.
- **Steps:** Remove final item; refresh Cart; navigate away and return.
- **Expected Result:** **Proposed validation:** empty state remains clear/stable and checkout is unavailable for no items.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Split from one-item removal because empty-state gating is distinct.
- **Evidence / assumption:** Empty-cart behavior is unverified.

### TC-CART-004

- **Title:** Preserve a guest cart while browsing and gate checkout
- **Priority:** P0
- **Category:** Shopping cart / Guest checkout
- **Preconditions:** New guest context with one cart item.
- **Test Data:** One visible product.
- **Steps:** Browse Home, Products, category/brand result, and product detail; return to Cart; select **Proceed To Checkout**.
- **Expected Result:** **Proposed validation:** cart persists and checkout requires Register/Login without losing cart content.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 persistence and authentication handoff.
- **Evidence / assumption:** Cart, checkout action, and guest Register/Login prompt were **observed**; persistence is unverified.

## Checkout and order flow

### TC-CHECKOUT-001

- **Title:** Prevent guest checkout bypass
- **Priority:** P0
- **Category:** Checkout / Access control
- **Preconditions:** New guest context with at least one cart item.
- **Test Data:** One visible product.
- **Steps:** Select **Proceed To Checkout**; inspect the prompt; return to Cart and reopen it.
- **Expected Result:** **Proposed validation:** guest cannot access address/payment checkout; routes are correct and cart is retained.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 authorization boundary.
- **Evidence / assumption:** Guest prompt was **observed**; full routing/persistence is unverified.

### TC-CHECKOUT-002

- **Title:** Render the authenticated customer’s address at checkout
- **Priority:** P0
- **Category:** Checkout / Address review
- **Preconditions:** Disposable authenticated account with complete synthetic address and cart item(s).
- **Test Data:** Distinct known address fields; one visible product.
- **Steps:** Proceed from Cart to checkout; compare delivery and billing values with account data.
- **Expected Result:** **Proposed validation:** complete correct address is rendered and no other customer data is shown.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 fulfillment and privacy protection.
- **Evidence / assumption:** Registration address form and guest gate were **observed**; authenticated rendering is unverified.

### TC-CHECKOUT-003

- **Title:** Preserve cart products, quantities, and totals at checkout
- **Priority:** P0
- **Category:** Checkout / Order review
- **Preconditions:** Authenticated disposable account with one or more cart items.
- **Test Data:** Products with known price/quantity.
- **Steps:** Reach checkout; compare every line and total with Cart.
- **Expected Result:** **Proposed validation:** checkout does not change selected products, quantities, or prices.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 order/revenue integrity independent of address mapping.
- **Evidence / assumption:** Authenticated order review is unverified.

### TC-CHECKOUT-004

- **Title:** Move a reviewed order to Payment without confirming it
- **Priority:** P0
- **Category:** Checkout / Order progression
- **Preconditions:** Authenticated disposable account with cart; checkout review reached.
- **Test Data:** Optional synthetic order comment.
- **Steps:** Enter comment; select **Place Order**; stop at Payment.
- **Expected Result:** **Proposed validation:** Payment opens and no order is confirmed before payment confirmation.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Separating transition identifies premature-order defects.
- **Evidence / assumption:** Payment form was **observed**; authenticated progression to it is unverified.

### TC-CHECKOUT-005

- **Title:** Validate incomplete or malformed payment data
- **Priority:** P0
- **Category:** Checkout / Payment validation
- **Preconditions:** Authenticated disposable account on Payment; no submitted order.
- **Test Data:** Blank, invalid card/CVC/month/year, and valid-format synthetic values.
- **Steps:** Attempt confirmation for each invalid data set; enter valid-format data and stop before final confirmation.
- **Expected Result:** **Proposed validation:** invalid input is blocked, payment data is not leaked, and order/cart data remains intact.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** P0 payment-form risk without creating an order.
- **Evidence / assumption:** Payment fields were **observed**; validation is unverified.

### TC-CHECKOUT-006

- **Title:** Place one successful order in an approved test environment
- **Priority:** P0
- **Category:** Checkout / Order confirmation
- **Preconditions:** Disposable authenticated account, known cart item, and explicit approval to create a test order.
- **Test Data:** Synthetic cardholder name, card number, CVC, month, and year.
- **Steps:** Reach Payment; submit synthetic values once; verify confirmation; inspect Cart.
- **Expected Result:** **Proposed validation:** one confirmation appears, card data is not echoed, refresh/retry does not duplicate order, and post-order Cart matches documented behavior.
- **Automation Recommendation:** Conditional — automate only in an approved disposable test environment
- **Automation Rationale:** Highest conversion value but creates persistent data.
- **Evidence / assumption:** Payment form was **observed**; submission, confirmation, and post-order state are unverified.

## Account management

### TC-ACCOUNT-001

- **Title:** Delete a disposable customer account and revoke access
- **Priority:** P1
- **Category:** Account management / Deletion
- **Preconditions:** Authenticated account created solely for this test; no retained data required.
- **Test Data:** Secure disposable credentials.
- **Steps:** Select **Delete Account**; continue from confirmation; attempt login using deleted credentials.
- **Expected Result:** **Proposed validation:** deletion ends session and deleted credentials cannot restore access.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Account-lifecycle/privacy coverage with per-run data.
- **Evidence / assumption:** Deletion completion is unverified.

### TC-ACCOUNT-002

- **Title:** Persist account address data across authenticated checkout sessions
- **Priority:** P1
- **Category:** Account management / Data persistence
- **Preconditions:** Disposable account with distinct synthetic address; one cart item.
- **Test Data:** Known name, address, country, state, city, postal code, and phone.
- **Steps:** Verify address at checkout; log out; log in; reach checkout again; compare address.
- **Expected Result:** **Proposed validation:** account data persists and no other customer data is displayed.
- **Automation Recommendation:** Recommended
- **Automation Rationale:** Covers durable fulfillment data beyond one checkout view.
- **Evidence / assumption:** Authenticated persistence is unverified.

## Exploration limitations

- The live site was explored as a guest and through the registration form only. No account was created, no review was submitted, and no payment/order was confirmed. Authenticated confirmation screens and final post-order behavior therefore remain proposed validations requiring disposable test data.
- The original planner-specific setup/save tools were unavailable in the agent’s tool registry. Exploration used the available browser-control workflow; this does not change the evidence boundary above.
- The plan intentionally excludes application code, API testing, contact form, subscription, and third-party tutorial links because they are outside the requested customer workflows.
