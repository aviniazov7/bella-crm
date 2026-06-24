# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-06-24

### Added

- Initial release of **Bella CRM**.
- **Authentication**: single-operator email/password sign-in with protected routes.
- **Dashboard**: client count, today's appointments, monthly revenue, and today's schedule.
- **Clients**: searchable CRUD table and a detailed client profile page (history, payments, photos).
- **Calendar**: `react-big-calendar` with month/week/day/agenda views and slot booking.
- **Payments**: ledger with status filtering and revenue summary.
- **Photos**: before/after gallery with drag-and-drop uploads to Firebase Storage.
- **Reminders**: scheduling and mark-as-sent.
- **UI library**: Button, Input, Textarea, Select, DatePicker, Modal, Table, Card, Badge, Spinner,
  Toast, ConfirmDialog, EmptyState, StatCard.
- **Firebase layer**: services for every collection, security rules (Firestore + Storage),
  composite indexes, and emulator support.
- **Testing**: 77 unit/integration tests (Vitest, ~93% coverage) and 22 Playwright E2E checks
  across desktop (1280px) and mobile (375px), including an axe accessibility smoke test.
- **Tooling**: ESLint (flat config), Prettier, Tailwind CSS, Lighthouse CI.
- **CI/CD**: GitHub Actions for lint/test/build + E2E, and a Firebase Hosting deploy workflow.
- **Docs**: README, CONTRIBUTING, `.env.example`.

[1.0.0]: https://github.com/aviniazov7/bella-crm/releases/tag/v1.0.0
