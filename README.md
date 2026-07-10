In this task, you'll extend a Claude Code agent by adding a custom subagent that generates Playwright tests.

You'll also create a memory file that prevents duplicate test cases across sessions.

👩‍💻 Workflow at a glance
1. Set up your environment
2. Create the subagent
3. Create the memory file
4. Run the agent
5. Test the review loop and publish gate
6. Run the tests
7. Submit your task

Let's go!

## 1. Set up your environment

Once you log in to your GitHub account, the repository for this task will be added automatically.

1. Confirm that `agent-adding-functionality` appears in your GitHub account.
2. Clone the repo and open it in your editor.
3. Install dependencies:
    
    ```
    npm install
    npx playwright install chromium
    ```
    
4. Verify that the skills work:
    
    ```
    python3 skills/get_ticket/get_ticket.py "#3"
    python3 skills/post_comment/post_comment.py "#3" "hello"
    ```
    

### Repository layout

```
agent-subagent-playwright-practice/
├── .claude/
│   └── agents/
│       └── e2e_test_generator.md.template   ← copy → e2e_test_generator.md and fill in
├── app/
│   └── index.html                           ← Observability Dashboard (app under test)
├── data/
│   └── tickets/
│       └── 3.json                           ← golden ticket
├── memory/
│   └── test_cases.md.template               ← copy → test_cases.md and fill in
├── skills/
│   ├── get_ticket/get_ticket.py
│   └── post_comment/post_comment.py
├── agent_tests/
│   └── e2e/                                 ← generated spec goes here
├── CLAUDE.md                                ← orchestrator agent (already complete)
├── playwright.config.ts
└── package.json
```

## 2. Create the subagent

Copy the template and fill in every `[TODO]`:

```
cp .claude/agents/e2e_test_generator.md.template \
   .claude/agents/e2e_test_generator.md
```

### Requirements

| **Section** | **What to write** |
| --- | --- |
| Your role | One-sentence identity |
| Purpose | What file it writes and where |
| What to generate | Test count, structure, and selectors |
| Output format | TypeScript example |
| Guardrails | No-duplicate rule and file path rule |

## 3. Create the memory file

Copy the template:

```
cp memory/test_cases.md.template memory/test_cases.md
```

Fill in the `[TODO]` rule: the agent must never generate a test whose ID already appears in the table.

## 4. Run the agent

Start Claude Code in this directory:

```
claude
```

Send the ticket ID from the [GitHub issues repo](https://github.com/nebius-academy-templates/issue-examples/issues) to trigger the workflow:

```
Run the agent and get ticket #3
```

Confirm that the agent:

- Fetches ticket `#3`
- Checks memory for existing test IDs
- Invokes the `e2e_test_generator` subagent
- Writes `agent_tests/e2e/generated.spec.ts` with ≥ 5 tests
- Updates `memory/test_cases.md`
- Presents the summary and waits — without calling `post_comment`

## 5. Test the review loop and publish gate

Request a change, for example:

```
Add a test for when the filter input is cleared.
```

Confirm that the agent updates the spec without publishing.

Then say:

```
publish
```
Confirm that it posts a summary comment via `post_comment`. 


## 6. Run the tests

Run:

```
npx playwright test
```

All tests must pass. The app is served automatically by `playwright.config.ts`.

...you read the README! Extremely rare. We salute you.🥂

## 7. Submit your task

Before submitting, review the checklist.

### ✅ Submission checklist

- [ ]  Subagent and memory functionality have been added
- [ ]  `.claude/agents/e2e_test_generator.md` exists and all `[TODO]` sections are filled in
- [ ]  `agent_tests/e2e/generated.spec.ts` exists and contains at least 5 `test()` cases
- [ ]  `memory/test_cases.md` exists and includes a "no duplicate test cases" rule
- [ ]  `npx playwright test` exits green
- [ ]  Changes are committed and pushed to `main`

1. Commit your changes.
2. Push to GitHub.
3. Return to the lesson and click "Submit."
