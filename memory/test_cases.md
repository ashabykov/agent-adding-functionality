---
name: test_cases
description: Tracks generated E2E test case IDs per ticket to prevent duplicates across sessions.
type: project
---

# Generated Test Cases

## Rules

**No duplicate test cases.** The agent must never generate a test whose ID (e.g. `TC-01`) already appears in the table below, and must never regenerate a test case that is semantically equivalent to one already recorded. Before invoking the `e2e_test_generator` subagent, read this file, collect all existing test IDs for the target ticket, and pass them to the subagent as `existing_test_ids`. The subagent must skip any ID already recorded and continue numbering from the next free integer.

## Ticket #3 — Add Observability

| Test ID  | Title                                                                   | Generated at  |
|----------|-------------------------------------------------------------------------|---------------|
| TC-01    | logs tool call name and inputs in the tool calls table                  | 2026-07-10    |
| TC-02    | logs tool call outputs alongside inputs                                 | 2026-07-10    |
| TC-03    | records per-tool-call latency in the table                              | 2026-07-10    |
| TC-04    | exposes tool-call records in a structured, machine-parseable table      | 2026-07-10    |
| TC-05    | surfaces tool arguments and results side-by-side (OTEL span attributes) | 2026-07-10    |
| TC-06    | renders aggregate latency stats spanning the full agent run             | 2026-07-10    |
| TC-07    | does not alter dashboard behavior when filters are exercised            | 2026-07-10    |
| TC-08    | renders the tool calls table so error rows can be surfaced              | 2026-07-10    |
| TC-09    | renders the dashboard shell so startup and shutdown events have a home  | 2026-07-10    |
| TC-10    | filters tool calls by name and clears cleanly                           | 2026-07-10    |
