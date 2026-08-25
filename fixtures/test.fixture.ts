import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {

    // AutomationExercise displays third-party ads that can
    // interfere with navigation during automated tests.
    await page.route(
      /googleads|googlesyndication|doubleclick|googleadservices/,
      async route => {
        await route.abort();
      }
    );

    await use(page);
  },
});

export { expect };