# FUNDED Timesheet App

Full-stack timesheet application for the FUNDED code challenge: create yearly timesheets by German region, record working hours and days off, see weekends and public holidays, and edit multiple days at once.

## Getting started

```bash
git clone https://github.com/masih-ahmadi/Timesheet
cd Timesheet
docker compose build --no-cache
docker compose up -d
```

Then open:

| URL | What |
|-----|------|
| [https://localhost](https://localhost) | Timesheet PWA |
| [https://localhost/docs](https://localhost/docs) | API docs (Swagger / OpenAPI) |

The app uses a **self-signed HTTPS certificate**. In the browser, accept the warning once (Advanced → Proceed to localhost). HTTP redirects to HTTPS.

Stop the stack:

```bash
docker compose down
```

## Challenge requirements

### User stories

- Create a timesheet and record working hours and days off
- See weekends and public holidays
- Edit multiple days at once
- List all timesheets

### Technical requirements

- Tailwind CSS
- [React Query](https://tanstack.com/query/latest/docs/framework/react/overview) for caching
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for forms and validation

### Optional

- Unit tests
- E2E tests

## What’s implemented

### Backend (`api/`)

- **API Platform / Symfony** with `Year` and `Day` resources
- **`YearPersistProcessor`** — on create, generates every day of the year and attaches region public holidays
- **`DayPersistProcessor`** — updates a single day or a date range (bulk edit)
- German **Region** / **PublicHoliday** / **Off** (`Urlaub`, `Krank`) enums exposed as API resources

### Frontend (`pwa/`)

- Next.js App Router + Tailwind
- Timesheet list, create form, detail view
- **Monthly** and **Yearly** calendar views
- Day editor: hours, vacation/sick, clear, bulk date range
- Stats strip: total hours, worked days, vacation days, sick days
- React Query hooks for fetching/caching and mutations

## Project structure

```
code-challenge-fullstack/
├── api/                 # Symfony + API Platform + FrankenPHP
│   ├── src/Entity/      # Year, Day
│   ├── src/Enum/        # Region, PublicHoliday, Off
│   ├── src/State/       # Persist processors
│   └── tests/           # PHPUnit
├── pwa/                 # Next.js frontend
│   ├── src/app/         # Routes
│   ├── src/api/         # HTTP client + API calls
│   ├── src/hooks/       # React Query hooks
│   ├── src/components/  # calendar/, timesheet/, providers/
│   ├── src/lib/         # Shared helpers (incl. timesheet stats/status)
│   ├── src/schemas/     # Zod schemas
│   └── src/types/       # Domain types
├── e2e/                 # Playwright
├── compose.yaml
└── Makefile
```

### Main routes

| Path | Screen |
|------|--------|
| `/` | List timesheets |
| `/years/new` | Create timesheet (year + region) |
| `/years/[id]` | Calendar + day editor + stats |

## Testing

With containers running:

```bash
make test
```

This runs:

1. **PHPUnit** (API) — holiday/region logic + year/day processors  
2. **Vitest** (PWA) — day status + timesheet stats (`pwa/src/lib/timesheet.test.ts`)  
3. **Playwright** (E2E, Chromium) — homepage + create timesheet → record hours → see on calendar  

Run pieces separately:

```bash
# API unit tests
docker compose exec php composer test

# Frontend unit tests
cd pwa && npx --yes pnpm@9.1.3 test

# E2E only (app must be up on https://localhost)
docker run --network host -w /app -v ./e2e:/app --rm --ipc=host \
  mcr.microsoft.com/playwright:v1.48.2-noble \
  /bin/sh -c 'npm i; npx playwright test --project=chromium;'
```

### Lint / types

```bash
make lint
```

## Tech stack

| Layer | Stack |
|-------|--------|
| API | PHP 8.2, Symfony 6.4, API Platform 4, Doctrine, PostgreSQL, FrankenPHP/Caddy |
| PWA | Next.js 15, React 18, Tailwind, TanStack Query, React Hook Form, Zod |
| Tests | PHPUnit, Vitest, Playwright |
| Ops | Docker Compose |

