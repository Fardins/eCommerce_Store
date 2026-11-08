# ecommerce-app

Next.js (App Router) + TypeScript + Tailwind CSS v4, with Better Auth, Drizzle ORM and Neon Postgres wired up. Scaffold only: no features yet.

## Setup

1. `npm install`
2. `cp .env.example .env.local` and fill in `DATABASE_URL` (Neon pooled URL) and `BETTER_AUTH_SECRET` (`npx auth@latest secret`).
3. Generate Better Auth tables into `src/db/schema.ts`: `npm run auth:generate`
4. Create and apply migrations: `npm run db:generate && npm run db:migrate`
5. `npm run dev`

## Layout

| Path | Purpose |
| --- | --- |
| `src/db/index.ts` | Drizzle client (Neon HTTP driver) |
| `src/db/schema.ts` | Drizzle tables (empty for now) |
| `drizzle.config.ts` | drizzle-kit config, reads `.env.local` |
| `src/lib/auth.ts` | Better Auth server instance (Drizzle adapter, `nextCookies`) |
| `src/lib/auth-client.ts` | Better Auth React client |
| `src/app/api/auth/[...all]/route.ts` | Better Auth route handler |

## Scripts

`dev`, `build`, `start`, `lint`, `db:generate`, `db:migrate`, `db:push`, `db:studio`, `auth:generate`
