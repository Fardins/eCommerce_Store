# Maison Elara Storefront

A premium fashion and leather-goods storefront built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Better Auth, Drizzle ORM and Neon Postgres.

This project is a fully wired storefront foundation for a luxury e-commerce brand, with a live catalog, product detail pages, category browsing, stock-aware product display, and a ready-to-extend authentication layer.

## Current status

The app currently includes:

- A branded storefront homepage with hero sections, category spotlight blocks and editorial content
- Product listing and category pages powered by Postgres data
- Product detail pages with gallery, stock status and related products
- Cached server-side catalog queries for fast reads and SEO-friendly rendering
- Better Auth configured with Drizzle adapter and admin plugin
- Database schema for categories, products, stock and generated auth tables
- Seed scripts to populate sample catalog data

The project is still in the storefront phase: there is no cart, checkout, payment flow, or order management yet.

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Better Auth
- Drizzle ORM
- Neon Postgres
- ESLint 9 + Next.js lint rules

## Project structure

```text
.
├── src/
│   ├── app/                  # App Router pages and API routes
│   ├── components/           # Reusable storefront UI
│   ├── db/                   # Drizzle database client and schema exports
│   ├── lib/                  # Catalog logic, auth config, utilities
│   └── ...
├── drizzle/                  # Generated Drizzle migrations
├── scripts/                  # Seed and admin scripts
├── public/                   # Static assets
├── .env.example              # Example environment config
├── drizzle.config.ts         # Drizzle configuration
├── next.config.ts            # Next.js config
├── package.json              # Scripts and dependencies
├── README.md                 # Project documentation
└── tsconfig.json
```

## Prerequisites

- Node.js 20+
- npm
- A Neon Postgres database
- A local `.env.local` file

## Environment setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example env file and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

```env
DATABASE_URL="your_neon_pooled_connection_string"
BETTER_AUTH_SECRET="generate_with_npx_auth_latest_secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secret:

```bash
npx auth@latest secret
```

Important: the project expects a pooled Neon connection string in `DATABASE_URL`, and the app will fail to start without it because the database client is initialized at import time.

## Database and auth setup

This project keeps database models in `src/db/schema/*.ts`, with exports centralized in `src/db/schema/index.ts`.

Run the following to prepare the DB and auth layer:

```bash
npm run auth:generate
npm run db:generate
npm run db:migrate
npm run db:seed
```

Notes:

- `npm run auth:generate` writes Better Auth tables into `src/db/schema/auth.ts`
- `npm run db:generate` creates migration files in `drizzle/`
- `npm run db:migrate` applies migrations to your Neon database
- `npm run db:seed` loads the sample catalog categories and products into Postgres

## Local development

Start the app:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available scripts

```bash
npm run dev           # run the app in development mode
npm run build         # production build and type-check
npm run start         # run the built app
npm run lint          # lint the project

npm run auth:generate # generate Better Auth schema files
npm run db:generate   # generate Drizzle migrations
npm run db:migrate    # apply migrations
npm run db:push       # direct schema push (not the preferred workflow)
npm run db:studio     # open Drizzle Studio
npm run db:seed       # seed the catalog from scripts/seed.ts
npm run admin:create  # create an admin user for the Better Auth admin plugin
```

## Storefront architecture

- `src/app/` contains page routes and the authentication catch-all route
- `src/lib/catalog.ts` stores brand copy and product type definitions
- `src/lib/catalog-queries.ts` reads product/category data from the database with cached server-side queries
- `src/db/schema/catalog.ts` defines categories, products and stock tables
- `src/lib/auth.ts` configures Better Auth with the Drizzle adapter and admin plugin
- `src/app/api/auth/[...all]/route.ts` exposes the auth API handlers

## Notes

- `nextCookies()` remains the last auth plugin in the Better Auth config
- Catalog reads use `"use cache"` and revalidation tags so the storefront stays efficient while still reflecting database changes
- Product images are stored as a JSON array in Postgres, with the primary image first
- The app is intentionally minimal for v1: catalog, storefront pages, auth scaffolding, and seeded sample data are in place, while checkout and commerce workflows are intentionally not yet implemented

## License

This project is currently set up as a private app for this repository and does not include a project-specific license file.

