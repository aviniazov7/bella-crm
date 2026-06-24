# Contributing to Bella CRM

Thanks for your interest in improving Bella CRM! 🌸

## Getting set up

```bash
npm install
cp .env.example .env   # fill in Firebase values (or leave placeholders for offline work)
npm run dev
```

## Workflow

1. Create a branch from `main`: `git checkout -b feat/short-description`.
2. Make your change, keeping it focused and small.
3. Run the full local gate before pushing:

   ```bash
   npm run lint
   npm run format:check
   npm test
   npm run build
   ```

4. Open a pull request against `main`. CI (lint, format, tests, build, E2E) must pass.

## Conventions

- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- **Components** are function components; UI primitives live in `src/components/ui` and are exported from its `index.js` barrel.
- **Data access** goes through a service in `src/services` (never call Firebase directly from a component); pages consume services via the `useCollection` hook.
- **Styling** uses Tailwind utility classes and the brand palette (`ink`, `rose`, `gold`). The app is RTL and mobile-first.
- **Formatting** is enforced by Prettier; **linting** by ESLint. Don't hand-format — run `npm run format`.

## Tests

- Add **unit** tests for new service/store/util/hook logic (`src/tests/unit`).
- Add **integration** tests for new page flows (`src/tests/integration`).
- Add **E2E** coverage for new user-facing journeys (`src/tests/e2e`).
- Keep overall coverage above **80%**.

## Reporting issues

Open a GitHub issue with steps to reproduce, expected vs. actual behaviour, and screenshots where relevant.
