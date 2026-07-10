import { test, expect } from '@playwright/test';

// Smoke test — verifies the app is served and the page loads.
// This is NOT the generated spec; the agent will write generated.spec.ts.
test('app loads and shows the dashboard heading', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('h1')).toHaveText('Observability Dashboard');
});
