# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

`ecommerce-app` is a storefront: Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS v4, with Better Auth, Drizzle ORM and Neon Postgres. Products, categories and stock come from Postgres. Site copy (brand, hero, nav, footer…) is still static in `src/lib/catalog.ts`. Better Auth tables are not generated yet, and there are no carts/orders.

Next.js 16.4 differs from older versions (see AGENTS.md above): check `node_modules/next/dist/docs/` before using a Next.js API from memory.

## Commands

```bash
npm run dev            # dev server on http://localhost:3000
npm run build          # production build (also type-checks)
npm run lint           # ESLint 9 flat config (next core-web-vitals + typescript)
npx tsc --noEmit       # type-check only

npm run auth:generate  # write Better Auth tables into src/db/schema/auth.ts (reads src/lib/auth.ts); then export it from schema/index.ts
npm run db:seed        # upsert the sample catalog (scripts/seed-data.ts) into the DB; safe to re-run
npm run db:generate    # drizzle-kit: generate SQL migrations into ./drizzle
npm run db:migrate     # apply migrations to Neon
npm run db:push        # push schema directly, no migration files (don't use; see conventions)
npm run db:studio      # Drizzle Studio
```

No test runner is configured yet.

## Environment

Copy `.env.example` to `.env.local`. Required: `DATABASE_URL` (Neon **pooled** URL), `BETTER_AUTH_SECRET` (`npx auth@latest secret`), `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`. `drizzle.config.ts` and `db:seed` load `.env.local` then `.env` (either may be missing; `.env.local` wins, like Next.js). `src/db/index.ts` throws at import time if `DATABASE_URL` is missing, so anything importing `@/db` or `@/lib/auth` (including `/api/auth/*`) fails without it.

## Architecture

- **Database**: `src/db/index.ts` exports a single `db` built with `drizzle-orm/neon-http`. See **Database conventions** below.
- **Auth**: `src/lib/auth.ts` is the server Better Auth instance on the Drizzle adapter (`provider: "pg"`). Sign-in methods (`emailAndPassword`, `socialProviders`, …) are not enabled yet. `nextCookies()` must stay the **last** plugin. After changing auth config or plugins that add tables, re-run `auth:generate`, then `db:generate` and `db:migrate`. All auth HTTP traffic goes through the catch-all `src/app/api/auth/[...all]/route.ts`. Client components use `authClient` from `src/lib/auth-client.ts`.
- **Next config** (`next.config.ts`): `cacheComponents: true` and `partialPrefetching: true` are on, so dynamic data access in server components needs a `<Suspense>` boundary or explicit caching (`"use cache"`). Tailwind v4 runs through a Turbopack CSS loader rule (`@tailwindcss/turbopack`), not PostCSS. There is no `postcss.config` or `tailwind.config`; theme tokens live in `src/app/globals.css` under `@theme inline`.
- **Imports**: the `@/*` path alias maps to `src/*`.
- Layouts and pages use the global typed helpers (e.g. `LayoutProps<"/">`) that Next generates.

## Database conventions

- **Schema files**: tables go in `src/db/schema/<domain>.ts` and must be re-exported from `src/db/schema/index.ts`. drizzle-kit and `db.query.*` only see what the index exports. Never recreate a single `src/db/schema.ts`: `auth:generate` writes to `schema/auth.ts` so it can't overwrite other tables.
- **Migrations**: change the schema → `db:generate` → read the generated SQL in `./drizzle` → `db:migrate`. Commit the migration files. Don't use `db:push`.
- **Column choices**:
  - `uuid` primary keys (`defaultRandom()`)
  - unique `text` slugs for anything in a URL
  - `timestamptz` `created_at`/`updated_at`
  - money as `integer` minor units (cents)
  - counts and money get a `>= 0` check constraint
  - Postgres enums for fixed value sets
  - foreign keys always declared, with an index and an explicit `onDelete`
- **Stock lives in `product_stock`** (1:1 with `products`), not on `products`. Future order/cart code updates that table only.
- **Keep v1 minimal**: only categories, products and stock exist. Add carts, orders, payments, reviews, wishlists or variants only when explicitly asked. New one-to-many data (e.g. a `product_images` table) needs a reason. Product images stay as a `jsonb` array (primary first, never empty) until then.
- **Reads go through query modules, never `@/db` in components.** Catalog reads live in `src/lib/catalog-queries.ts`. Each one:
  - uses `"use cache"` + `cacheLife(...)` + `cacheTag("catalog")`
  - maps rows to the app types in `src/lib/catalog.ts`, so UI components don't depend on DB row shapes

  Any code that writes catalog data must call `revalidateTag("catalog")`.
- **neon-http has no interactive transactions**: use `db.batch([...])` or make multi-step writes idempotent (upserts with `onConflictDoUpdate`).
- **Seeding**: `scripts/seed.ts` must stay safe to re-run (upsert by slug or id). `next build` queries the DB (`generateStaticParams` must return at least one slug), so a seeded DB and `DATABASE_URL` are required to build.
