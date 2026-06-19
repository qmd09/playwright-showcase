# playwright-showcase

A portfolio-quality Playwright test automation framework in TypeScript. Demonstrates professional QA engineering patterns: Page Object Model, component objects, fixture-based auth, API testing with schema validation, visual regression, and cross-browser execution. Tests target SauceDemo (UI) and JSONPlaceholder (API) as public demo services.

## Tech stack

| Tool | Version |
|---|---|
| Playwright | ^1.49.0 |
| TypeScript | ^5.6.0 |
| ESLint | ^9.0.0 (flat config) |
| Prettier | ^3.3.0 |
| Node | 20 (CI) |

No test runner other than Playwright. No application code — this is tests only.

## Project structure

```
src/
  pages/            # Page Object Model classes — one per SauceDemo page
    BasePage.ts     # Abstract base: waitForPageLoad(), waitForElement()
    LoginPage.ts    # data-test selectors; login(), isLoggedIn()
    InventoryPage.ts
    CartPage.ts
    CheckoutPage.ts
    ProductPage.ts
  components/       # Reusable UI component objects
    NavBar.ts       # Hamburger menu, logout, resetAppState()
    CartIcon.ts     # Cart badge count
  fixtures/
    global.setup.ts  # Runs once: logs in via LoginPage POM, saves .auth/user.json
    auth.fixture.ts  # Extends base test with authenticatedPage, inventoryPage,
                     # cartPage, checkoutPage, navBar, cartIcon fixtures
  helpers/
    testData.ts     # USERS, CHECKOUT_DATA, UI_BASE_URL, API_BASE_URL — single source of truth
    apiHelper.ts    # Thin wrapper: get/post/put/delete + assertStatus/assertSchema/getJson
  types/
    index.ts        # Shared interfaces: Product, User, CheckoutDetails, ApiPost, ApiUser, etc.
tests/
  ui/
    auth/           # login.spec.ts, logout.spec.ts
    cart/           # add-to-cart.spec.ts, remove-from-cart.spec.ts
    checkout/       # checkout-happy-path.spec.ts, checkout-validation.spec.ts
    inventory/      # product-listing.spec.ts, product-sort.spec.ts, product-filter.spec.ts
  api/              # posts.spec.ts, todos.spec.ts, users.spec.ts
  visual/           # login-page.spec.ts, inventory-page.spec.ts, checkout-page.spec.ts
.github/workflows/playwright.yml  # CI: Chromium + Firefox + WebKit on ubuntu-latest
```

## Local development setup

```bash
npm install
npx playwright install chromium firefox webkit  # install browsers
cp .env.example .env                            # SauceDemo creds are already public defaults
npm test                                        # run all tests headlessly
```

Auth state is generated automatically by global setup on first run and cached to `.auth/user.json`. The `.auth/` directory is git-ignored.

Visual snapshot baselines are generated locally on first run and stored in `tests/visual/snapshots/`. They are git-ignored — regenerate with:
```bash
npm run test:update-snapshots
```

## Environment variables

From `.env.example`:
```
BASE_URL           # SauceDemo base URL. Default: https://www.saucedemo.com
API_BASE_URL       # JSONPlaceholder base URL. Note: currently hardcoded in testData.ts
                   # — this env var is not read at runtime. See known gotchas.
STANDARD_USER      # SauceDemo username. Default: standard_user (public credential)
STANDARD_PASSWORD  # SauceDemo password. Default: secret_sauce (public credential)
AUTH_STATE_PATH    # Path to saved auth state JSON. Default: .auth/user.json
```

## Coding conventions

**Page Object Model:** Every page gets a class in `src/pages/` extending `BasePage`. Locators are defined as `readonly` class properties in the constructor, not inline in methods. Interaction methods return `Promise<void>`; query methods return the relevant value. Pages never contain assertions — assertions live in test specs.

```typescript
// Correct: locators as class properties
this.loginButton = page.locator('[data-test="login-button"]');

// Wrong: inline selectors in methods
await page.locator('[data-test="login-button"]').click();
```

**Selector priority:** `data-test` attributes first. CSS classes second (only for elements SauceDemo does not expose via `data-test`). Never use XPath or text-based selectors.

**Fixtures over beforeEach:** Test files use the custom fixture from `auth.fixture.ts` rather than manually instantiating page objects in `beforeEach`. Import `test` and `expect` from the fixture file, not from `@playwright/test` directly:
```typescript
import { test, expect } from '../../src/fixtures/auth.fixture';
```

**Test isolation:** Every cart test calls `navBar.resetAppState()` in `beforeEach` to clear cart state via SauceDemo's built-in reset function. Do not rely on test execution order.

**API testing pattern:** Use `ApiHelper` for all API tests. Always call `assertStatus` before reading the body. Use `assertSchema` with a type guard for schema validation:
```typescript
const isApiPost = (x: unknown): x is ApiPost =>
  typeof x === 'object' && x !== null && 'id' in x && 'title' in x;

const posts = await api.getJson<ApiPost[]>(response);
await api.assertSchema(posts[0], isApiPost);
```

**Soft assertions for data loops:** When validating a schema across multiple items in a loop, use `expect.soft()` so all failures are collected rather than stopping at the first:
```typescript
for (const user of users) {
  expect.soft(user.name).toBeDefined();
}
expect(test.info().errors).toHaveLength(0);
```

**Wait strategy:** Wait for specific elements, not network state. `waitForPageLoad()` in `BasePage` uses `domcontentloaded`. Page-specific `goto()` methods override with an element wait:
```typescript
async goto(): Promise<void> {
  await this.page.goto('/');
  await this.usernameInput.waitFor({ state: 'visible' });  // confirms form is ready
}
```
Never use `page.waitForTimeout()` or `waitForLoadState('networkidle')`.

## Key architectural decisions

**Global auth setup saves Chromium state, reused across all browsers.** The saved `.auth/user.json` contains cookies set by Chromium's login. This works for SauceDemo because it uses cookie-based sessions, which browsers handle identically. Do not apply this pattern to apps using browser-specific storage mechanisms.

**5 browser projects run every UI spec.** `playwright.config.ts` defines Chromium, Firefox, WebKit, Pixel 5, and iPhone 12. Every test in `tests/ui/` runs 5 times. This is intentional for cross-browser coverage. If a test is browser-specific, use `test.skip` with a condition.

**Visual tests are excluded from CI.** `.github/workflows/playwright.yml` runs `tests/ui tests/api` only. Visual tests require locally-generated baselines and are run manually with `npm run test:visual`.

**`testData.ts` is the single source of truth.** All credentials, base URLs, checkout form data, and expected values live there. Never hardcode test data inline in spec files.

## Common tasks

**Add a new UI test:**
1. If testing a new page, create a page object in `src/pages/` extending `BasePage`
2. Add the page as a fixture in `src/fixtures/auth.fixture.ts` if it needs auth
3. Create the spec file under the appropriate `tests/ui/` subdirectory
4. Import `test` and `expect` from `auth.fixture.ts`
5. Use `beforeEach` with `navBar.resetAppState()` if the test modifies cart state

**Add a new API test:**
1. Add any new response interfaces to `src/types/index.ts`
2. Create the spec under `tests/api/`
3. Import `test, expect` from `@playwright/test` (API tests don't need auth fixture)
4. Use `request` fixture directly or instantiate `ApiHelper`

**Run a single test file:**
```bash
npx playwright test tests/ui/auth/login.spec.ts
```

**Run tests on one browser only:**
```bash
npx playwright test --project=chromium
```

**Debug a failing test:**
```bash
npm run test:debug            # opens Playwright Inspector
npm run test:headed           # runs in visible browser window
npm run test:report           # opens last HTML report
```

**Update visual baselines:**
```bash
npm run test:update-snapshots
```
Commit the updated files in `tests/visual/snapshots/`.

**CI:**
Push to `main` or open a PR against `main` to trigger the GitHub Actions workflow. The workflow runs `tests/ui` and `tests/api` across Chromium, Firefox, and WebKit. HTML report and failure screenshots are uploaded as artifacts.

## Things to avoid / known gotchas

- **Never use `waitForLoadState('networkidle')`** — it is the primary cause of flaky Playwright tests. Use specific element waits. `BasePage.waitForPageLoad()` now uses `domcontentloaded` as a fallback baseline only.
- **Never use `page.waitForTimeout()`** — fixed sleeps make tests slow and fragile. Always wait for a condition.
- **`API_BASE_URL` in `.env` has no effect.** The base URL is hardcoded in `src/helpers/testData.ts`. To point API tests at a different host, edit `testData.ts` directly.
- **TypeScript path aliases (`@pages/*`, `@helpers/*`, etc.) are defined in `tsconfig.json` but not used.** All imports use relative paths. Do not start using aliases unless you configure them in `playwright.config.ts` as well (Playwright does not pick up tsconfig aliases automatically).
- **`@axe-core/playwright` is installed but unused.** No accessibility tests currently exist. Either use it or remove it from `package.json` to avoid confusion.
- **Visual snapshot filenames include the browser name.** `login-page-chromium.png` and `login-page-webkit.png` are separate files. Managing cross-browser baselines means storing one snapshot per browser per test.
- **The `eslint` lint script uses `--ext .ts`** which is deprecated in ESLint v9 (flat config). Use `npx eslint .` directly instead of `npm run lint`.
