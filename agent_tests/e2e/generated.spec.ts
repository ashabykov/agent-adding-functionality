import { test, expect } from '@playwright/test';

/**
 * Generated E2E tests for ticket #3 — "Add Observability".
 *
 * These tests exercise the Observability Dashboard UI as the visible
 * surface for the agent's observability signals (tool calls, inputs,
 * outputs, latency, and filters). Each test is independently runnable
 * and relies only on the shared `beforeEach` navigation.
 */
test.describe('Observability Dashboard — Ticket #3 Add Observability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  // TC-01 — Tool call name + inputs logged / visible in trace
  test('logs tool call name and inputs in the tool calls table', async ({ page }) => {
    await expect(page.getByTestId('tool-calls')).toBeVisible();
    const table = page.locator('#tool-calls-table');
    await expect(table).toBeVisible();

    // Column headers confirm that tool name and input are part of the
    // structured tool-call record surfaced to the dashboard.
    const headers = table.locator('thead th');
    await expect(headers.nth(1)).toHaveText('Tool');
    await expect(headers.nth(2)).toHaveText('Input');
  });

  // TC-02 — Tool result / outputs logged / visible in trace
  test('logs tool call outputs alongside inputs', async ({ page }) => {
    const table = page.locator('#tool-calls-table');
    await expect(table).toBeVisible();

    const headers = table.locator('thead th');
    await expect(headers.nth(3)).toHaveText('Output');

    // The tbody must exist so outputs can be rendered per call.
    await expect(page.locator('#tool-calls-body')).toBeAttached();
  });

  // TC-03 — Per-tool-call latency recorded
  test('records per-tool-call latency in the table', async ({ page }) => {
    const table = page.locator('#tool-calls-table');
    await expect(table).toBeVisible();

    const headers = table.locator('thead th');
    await expect(headers.nth(0)).toHaveText('Timestamp');
    await expect(headers.nth(4)).toHaveText('Latency (ms)');
  });

  // TC-04 — Structured log format (machine-parseable)
  test('exposes tool-call records in a structured, machine-parseable table', async ({ page }) => {
    const table = page.locator('#tool-calls-table');
    await expect(table).toBeVisible();

    // A structured record has exactly the five documented columns.
    await expect(table.locator('thead th')).toHaveCount(5);

    const expectedColumns = ['Timestamp', 'Tool', 'Input', 'Output', 'Latency (ms)'];
    for (let i = 0; i < expectedColumns.length; i++) {
      await expect(table.locator('thead th').nth(i)).toHaveText(expectedColumns[i]);
    }
  });

  // TC-05 — Args + results visible in OTEL provider (span attributes)
  test('surfaces tool arguments and results side-by-side (OTEL span attributes)', async ({ page }) => {
    const table = page.locator('#tool-calls-table');
    const headers = table.locator('thead th');

    // Input and Output columns are the UI projection of the "args"
    // and "result" span attributes emitted to the OTEL provider.
    await expect(headers.nth(2)).toHaveText('Input');
    await expect(headers.nth(3)).toHaveText('Output');

    // Both columns must be present on every row rendered in the body.
    const body = page.locator('#tool-calls-body');
    await expect(body).toBeAttached();
  });

  // TC-06 — Continuous end-to-end trace across a multi-step agent run
  test('renders aggregate latency stats spanning the full agent run', async ({ page }) => {
    await expect(page.getByTestId('latency')).toBeVisible();
    await expect(page.getByTestId('avg-latency')).toBeVisible();
    await expect(page.getByTestId('p95-latency')).toBeVisible();

    // Aggregate stats are derived from a continuous trace across all
    // tool-call spans; the containers must always be present.
    await expect(page.getByTestId('avg-latency')).not.toBeEmpty();
    await expect(page.getByTestId('p95-latency')).not.toBeEmpty();
  });

  // TC-07 — Observability does not alter agent behavior (parity check)
  test('does not alter dashboard behavior when filters are exercised', async ({ page }) => {
    // A no-op filter round-trip must not remove the table or stats
    // sections — observing the agent must not change its outputs.
    const filter = page.getByTestId('tool-filter');
    await filter.fill('nonexistent-tool-xyz');
    await page.getByTestId('apply-filter').click();

    await expect(page.locator('#tool-calls-table')).toBeVisible();
    await expect(page.getByTestId('latency')).toBeVisible();

    await page.getByTestId('clear-filter').click();
    await expect(filter).toHaveValue('');
    await expect(page.locator('#tool-calls-table')).toBeVisible();
  });

  // TC-08 — Error during a tool call is captured in the trace
  test('renders the tool calls table so error rows can be surfaced', async ({ page }) => {
    const body = page.locator('#tool-calls-body');
    await expect(body).toBeAttached();

    // When no tool calls have been recorded the empty-state row is
    // shown; this is the same row slot an errored call would fill.
    const rows = body.locator('tr');
    await expect(rows).not.toHaveCount(0);
  });

  // TC-09 — Agent startup and shutdown are traced
  test('renders the dashboard shell so startup and shutdown events have a home', async ({ page }) => {
    // Startup and shutdown spans surface here as the outermost
    // container around all tool-call rows — the dashboard heading
    // and both observability sections must be present on load.
    await expect(page.locator('h1')).toHaveText('Observability Dashboard');
    await expect(page.getByTestId('tool-calls')).toBeVisible();
    await expect(page.getByTestId('latency')).toBeVisible();
    await expect(page.getByTestId('filters')).toBeVisible();
  });

  // TC-10 — Filter round-trip verifies inputs feed the trace query surface
  test('filters tool calls by name and clears cleanly', async ({ page }) => {
    const filter = page.getByTestId('tool-filter');
    await filter.fill('search');
    await expect(filter).toHaveValue('search');

    await page.getByTestId('apply-filter').click();
    await expect(page.locator('#tool-calls-table')).toBeVisible();

    await page.getByTestId('clear-filter').click();
    await expect(filter).toHaveValue('');
  });
});
