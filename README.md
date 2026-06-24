# 💅 Bella CRM

> מערכת ניהול (CRM) למכון יופי — לקוחות, יומן תורים, תשלומים, תזכורות וגלריית תמונות "לפני/אחרי".
> A mobile-first CRM for a beauty studio, built with React + Firebase.

![CI](https://github.com/aviniazov7/bella-crm/actions/workflows/ci.yml/badge.svg)

---

## ✨ Features

- **Dashboard** — live stats: total clients, today's appointments, monthly revenue, and today's schedule.
- **Clients** — searchable table with full create / edit / delete, plus a rich client profile page.
- **Client profile** — contact details, appointment history, payment history and a before/after gallery.
- **Calendar** — `react-big-calendar` with month / week / day / agenda views; click a slot to book.
- **Payments** — ledger with status filtering and an automatic revenue summary.
- **Photos** — drag-and-drop before/after image uploads to Firebase Storage.
- **Reminders** — schedule client reminders and mark them as sent.
- **Auth** — single-operator email/password sign-in with protected routes.
- **Design** — dark theme (`#0f0f0f`) with rose (`#d4a5a5`) + gold (`#c9a96e`) accents, RTL, fully responsive.

## 🖼 Screenshots

> _Placeholders — replace with real screenshots once deployed._

| Login | Dashboard | Calendar |
| ----- | --------- | -------- |
| ![login](docs/screenshot-login.png) | ![dashboard](docs/screenshot-dashboard.png) | ![calendar](docs/screenshot-calendar.png) |

## 🧱 Tech stack

| Area         | Choice                                          |
| ------------ | ----------------------------------------------- |
| Framework    | React 19 + Vite                                 |
| Routing      | react-router-dom                                |
| Data         | Firebase (Auth, Firestore, Storage)             |
| Server state | @tanstack/react-query                           |
| Client state | Zustand                                         |
| Forms        | react-hook-form                                 |
| Dates        | date-fns                                        |
| Styling      | Tailwind CSS                                     |
| Unit/Integ.  | Vitest + Testing Library                        |
| E2E          | Playwright (desktop 1280px + mobile 375px)      |
| Quality      | ESLint, Prettier, Lighthouse CI, axe-playwright |

## 📁 Folder structure

```
src/
├── agents/          # reserved for automation/agent logic
├── components/
│   ├── ui/          # Button, Input, Select, DatePicker, Modal, Table, Card, Badge, Spinner, Toast…
│   ├── clients/     # ClientForm
│   ├── calendar/    # AppointmentForm
│   ├── payments/    # PaymentForm
│   ├── photos/      # PhotoUpload
│   └── reminders/   # ReminderForm
├── pages/           # Login, Dashboard, Clients, ClientDetail, Calendar, Payments, Photos, Reminders
├── hooks/           # useAuth, useCollection, useToast, useDebounce
├── services/        # firebase.js + auth/clients/appointments/payments/reminders/photos
├── store/           # Zustand stores: auth, toast, ui
├── utils/           # format, validation, constants
└── tests/
    ├── unit/        # services, stores, utils, hooks
    ├── integration/ # page flows with Testing Library
    └── e2e/         # Playwright specs
```

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure Firebase (see below)
cp .env.example .env
#   …then fill in your project values

# 3. Run the dev server
npm run dev      # http://localhost:5173
```

## 🔥 Firebase setup

1. Create a project at <https://console.firebase.google.com>.
2. Enable **Authentication → Email/Password** and create your operator user.
3. Create a **Cloud Firestore** database and a **Storage** bucket.
4. Copy your web-app config into `.env` (all keys are prefixed `VITE_` — see [`.env.example`](.env.example)).
5. Deploy the security rules and indexes shipped in this repo:

   ```bash
   npm i -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

Collections used: `clients`, `appointments`, `payments`, `reminders`, `photos`.
Local emulators are pre-configured — set `VITE_USE_FIREBASE_EMULATORS=true` and run `firebase emulators:start`.

## 🧪 Testing

```bash
npm test                # unit + integration (Vitest)
npm run test:coverage   # with coverage report (target > 80%)
npm run test:e2e        # Playwright E2E (boots the dev server automatically)
npm run test:e2e:report # E2E with HTML report
```

Current coverage: **~93% statements / ~93% branches** across services, stores, utils and hooks.

## 🧹 Quality

```bash
npm run lint            # ESLint
npm run format          # Prettier (write)
npm run format:check    # Prettier (verify)
npm run build           # production build
npm run lhci            # Lighthouse CI (target > 85 per category)
```

## 🔁 CI/CD

- **`.github/workflows/ci.yml`** — on every push/PR: lint → format check → tests + coverage → build, plus a parallel Playwright E2E job. Artifacts (coverage, Playwright report) are uploaded.
- **`.github/workflows/deploy.yml`** — on push to `main`: builds with the `VITE_FIREBASE_*` secrets and deploys to Firebase Hosting (requires `FIREBASE_SERVICE_ACCOUNT` + `FIREBASE_PROJECT_ID` repo secrets).

## 🔐 Environment variables

See [`.env.example`](.env.example). All are required for a real Firebase connection; placeholders let the app build and tests run without credentials.

| Variable                            | Description                  |
| ----------------------------------- | ---------------------------- |
| `VITE_FIREBASE_API_KEY`             | Web API key                  |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Auth domain                  |
| `VITE_FIREBASE_PROJECT_ID`          | Project id                   |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Storage bucket               |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender id          |
| `VITE_FIREBASE_APP_ID`              | App id                       |
| `VITE_FIREBASE_MEASUREMENT_ID`      | Analytics id (optional)      |
| `VITE_USE_FIREBASE_EMULATORS`       | `true` to use local emulators|

## 📄 License

MIT — see [LICENSE](LICENSE).
