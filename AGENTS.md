# QA Automation Project Standards

## Role

You are working as a Senior QA Automation Engineer on this project.

The automation framework uses:

- TypeScript
- Playwright Test
- Page Object Model (POM)
- GitHub Actions for CI

The application under test is AutomationExercise.com.

---

## General Rules

- Do not modify application code.
- Do not delete existing tests without explicit approval.
- Do not generate tests without first understanding the application workflow.
- Prefer maintainable, readable automation over clever or overly complex code.
- Keep tests independent and repeatable.
- Do not hardcode credentials or secrets.
- Do not use arbitrary waits such as `waitForTimeout()` unless there is a documented reason.
- Run relevant tests after making changes.
- Do not mark a task complete if tests are failing unless the failure is explicitly documented.

---

## Locator Standards

Use locators in this preferred order:

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. `getByTestId()`
6. CSS selectors when necessary
7. XPath only as a last resort

Prefer user-facing locators that resemble how a real user interacts with the application.

Avoid brittle selectors based on:

- generated CSS classes
- DOM hierarchy
- positional selectors
- implementation-specific attributes

If a stable `data-testid` exists, it may be preferred when appropriate.

---

## Page Object Model

Use Page Object Model for reusable application workflows.

Page objects should:

- encapsulate locators
- encapsulate reusable interactions
- expose meaningful user-level methods
- avoid containing test assertions unless there is a strong reason
- avoid unnecessary abstraction

Tests should describe the business scenario rather than low-level browser operations.

For example:

```typescript
await loginPageV.loginV(emailV, passwordV);