# playwright-showcase

![Playwright Tests](https://github.com/qmd09/playwright-showcase/actions/workflows/playwright.yml/badge.svg)

A portfolio-quality Playwright test automation framework demonstrating professional QA engineering skills across UI, API, and visual regression testing. Built to reflect the patterns and discipline expected in production test suites — not a tutorial project.

## Tech Stack

- [Playwright](https://playwright.dev) with TypeScript
- Node.js 20
- GitHub Actions for CI/CD
- `@axe-core/playwright` for accessibility testing
- Playwright HTML reporter

## Project Structure

```
playwright-showcase/
├── .github/workflows/       # CI/CD pipeline
├── src/
│   ├── pages/               # Page Object Models (BasePage + 5 page classes)
│   ├── components/          # Reusable sub-page components (NavBar, CartIcon)
│   ├── fixtures/            # Custom Playwright fixtures (auth, global setup)
│   ├── helpers/             # testData.ts, apiHelper.ts
│   └── types/               # Shared TypeScript interfaces
└── tests/
    ├── ui/                  # E2E tests against SauceDemo
    │   ├── auth/
    │   ├── inventory/
    │   ├── cart/
    │   └── checkout/
    ├── api/                 # API tests against JSONPlaceholder
    └── visual/              # Visual regression tests
```

## Installation

```bash
git clone https://github.com/qmd09/playwright-showcase.git
cd playwright-showcase
npm ci
npx playwright install
cp .env.example .env
```

## Running Tests

```bash
# All tests
npm test

# By suite
npm run test:ui
npm run test:api
npm run test:visual

# Debug / headed mode
npm run test:headed
npm run test:debug

# CI mode (retries enabled, workers fixed at 4)
npm run ci
```

## Visual Regression

Baselines are generated locally and excluded from version control.

```bash
# Generate or regenerate baselines
npm run test:update-snapshots

# Run visual checks against existing baselines
npm run test:visual
```

## HTML Report

```bash
npm run test:report
```

The report opens in your browser. In CI, it is uploaded as an artifact and retained for 30 days.

> Live report: https://qmd09.github.io/playwright-showcase/

## Architecture Decisions

### Page Object Model

Every page and component has its own class. Test files never contain raw selectors — all locators live in the page object. This makes tests resilient to markup changes: you update the selector in one place and every test that uses that page benefits.

### Custom Auth Fixture

The `auth.fixture.ts` fixture uses Playwright's storage state mechanism to log in once during global setup and reuse the browser session across all authenticated tests. This eliminates redundant login steps, makes test runs faster, and demonstrates fixture composition — a Playwright feature most tutorials skip.

### Playwright over Cypress or Selenium

- **Multi-browser**: Playwright runs Chromium, Firefox, and WebKit in the same run; Cypress only recently added Firefox and has no WebKit.
- **Network-layer API testing**: Playwright's `APIRequestContext` lets API tests run without a browser, in the same framework and reporter.
- **True parallelism**: Playwright workers run tests in parallel across multiple processes; Cypress parallelism requires a paid cloud plan.
- **No dependency on a browser-bundled runtime**: Playwright tests run in Node.js, making them straightforward to integrate with TypeScript tooling.

## CI/CD

The GitHub Actions pipeline (`.github/workflows/playwright.yml`) runs on every push and pull request to `main`, and can be triggered manually via `workflow_dispatch`.

Steps:
1. Check out the repository
2. Set up Node.js 20 with npm cache
3. `npm ci` — deterministic install from lockfile
4. Install Playwright browsers (Chromium, Firefox, WebKit)
5. Run all tests with `CI=true` (enables retries and fixed worker count)
6. Upload the HTML report as an artifact (retained 30 days)
7. Upload failure screenshots on test failure (retained 7 days)
