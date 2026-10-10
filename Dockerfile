# Keep this version aligned with Playwright in package-lock.json.
FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /app

# Install locked project dependencies before copying frequently changing tests.
COPY package.json package-lock.json ./
RUN npm ci

COPY playwright.config.ts ./
COPY fixtures/ ./fixtures/
COPY pages/ ./pages/
COPY tests/ ./tests/

# Prevent the HTML report server from keeping a failed run alive.
ENV PLAYWRIGHT_HTML_OPEN=never

# Guest smoke check; callers can replace this command to select other tests.
CMD ["npx", "playwright", "test", "tests/automationexercise-approved-workflows.spec.ts", "--project=chromium", "--workers=1", "--retries=0", "--grep=TC-SEARCH-001"]
