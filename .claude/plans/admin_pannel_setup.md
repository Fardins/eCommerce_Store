# Admin panel setup — Maison Elara

> First implementation step: copy this plan to `E:\Projects\Claude_Code_Project\.claude\plans\admin_pannel_setup.md` (requested location; plan mode only allows writing here).

## Context
The storefront reads categories, products and stock from Postgres, but nothing can edit them except `scripts/seed.ts`. There is no login, no role system and no orders. This plan adds a staff-only admin at `/admin` for categories, products (with image uploads and archiving) and stock. Orders stay out of scope.

Decisions made: **product status column** (draft/active/archived), **zod** for validation, **staff-only accounts** (public sign-up disabled), **UploadThing** for image uploads.

Verified in docs:
- In a Server Action, `updateTag("catalog")` gives read-your-own-writes (`node_modules/next/dist/docs/.../04-functions/updateTag.md`).
- `revalidateTag` now needs a second argument (`revalidateTag("catalog", "max")`); the one-argument form is deprecated. Use it only outside actions, e.g. in the UploadThing route.
- Better Auth admin `auth.api.createUser` called server-side with no headers skips the session check and can set `role` (`node_modules/better-auth/dist/plugins/admin/routes.mjs:152-200`). That makes a bootstrap script possible even with sign-up disabled.

## Phase 1 — Auth + admin role
1. `src/lib/auth.ts`:
   - `emailAndPassword: { enabled: true, disableSignUp: true }`
   - `plugins: [admin(), nextCookies()]` (`nextCookies()` stays last)
2. `src/lib/auth-client.ts`: add `plugins: [adminClient()]`.
3. Create the auth tables:
   - `npm run auth:generate` writes `src/db/schema/auth.ts`.
   - Add `export * from "./auth"` to `src/db/schema/index.ts`.
   - `npm run db:generate`, review the SQL (user/session/account/verification plus role/banned/impersonatedBy), then `npm run db:migrate`.
4. `src/lib/admin-auth.ts` (`import "server-only"`): `requireAdmin()`, wrapped in React `cache()`.
   - Calls `auth.api.getSession({ headers: await headers() })`.
   - No session → `redirect("/admin/sign-in")`.
   - Role isn't `admin` → `notFound()`.
   - Returns the session.
5. `scripts/create-admin.ts`: reads `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME` from env.
   - No user yet → `auth.api.createUser({ body: { …, role: "admin" } })`.
   - User exists → set `role = "admin"` with a direct Drizzle update.
   - Safe to re-run. Add an `admin:create` script in package.json using the same `tsx --env-file-if-exists` flags as `db:seed`.
6. Optional UX-only redirect in `src/proxy.ts` (Next 16 name for middleware):
   - matcher `/admin/:path*`, excluding `/admin/sign-in`;
   - redirects when `getSessionCookie` from `better-auth/cookies` finds no cookie.
   - It is **not** authorization.
7. Update `.env.example` with the `ADMIN_*` and `UPLOADTHING_TOKEN` variables.

## Phase 2 — Layout split
- Move `src/app/{page.tsx,new,[category],products}` into `src/app/(shop)/`.
- New `src/app/(shop)/layout.tsx` holds `AnnouncementBar`, `SiteHeader`, `<main id="main">` and `SiteFooter`, taken out of the root layout.
- `src/app/layout.tsx` keeps only `<html>`, fonts, `globals.css` and the skip link.
- `api/` stays where it is. URLs don't change. A static `admin/` segment takes priority over `[category]`.
- Add `admin`, `api`, `products`, `new` and `cart`/`account` to a `RESERVED_CATEGORY_SLUGS` list for validation.

## Phase 3 — Schema: product status
- In `src/db/schema/catalog.ts`:
  - `export const productStatus = pgEnum("product_status", ["draft","active","archived"])`;
  - `status: productStatus("status").notNull().default("active")`, plus `index("products_status_idx")`.
  - Existing rows become active.
- `db:generate`, review the SQL, `db:migrate`.
- `src/lib/catalog-queries.ts`: filter every public read to `status = 'active'`. That covers `getNewArrivals`, `getProductsByCategory`, `getProductBySlug` (archived → null → `notFound`), `getRelatedProducts` and `getAllProductSlugs`.
- Seed: set `status: "active"` explicitly in `scripts/seed.ts` upserts.

## Phase 4 — Admin data layer
- `npm i zod uploadthing @uploadthing/react`
- `src/lib/admin-schemas.ts` (zod), shared by server actions:
  - **`categorySchema`:**
    - `slug`: kebab-case, not reserved;
    - `name` and `imageUrl`/`imageAlt`;
    - `sortOrder` ≥ 0.
  - **`productSchema`:**
    - `slug`/`sku` format;
    - `price` entered in dollars, turned into integer cents, ≥ 0;
    - `images`: at least one `{src (url), alt (non-empty)}`;
    - `details` as `string[]`;
    - `badge` from the enum values;
    - `status`;
    - `categoryId` as a uuid.
  - **`stockAdjustSchema`, `stockSetSchema`.**
- `src/lib/admin-queries.ts` (`server-only`, **uncached**, rendered inside Suspense): `listProductsForAdmin` (with category, stock, status), `getProductForEdit(id)`, `listCategoriesWithCounts`.
  - Admin views must not be stale and must show drafts and archived products.
  - These map rows to small admin types and reuse `getStockState` from `src/lib/catalog.ts`.
- `src/lib/catalog-mutations.ts` (`server-only`). Every function returns `{ ok } | { fieldErrors }`.
  - **Unique-key collisions:** Postgres error 23505 (`slug`/`sku`) becomes a field error.
  - **`createCategory` / `updateCategory`:** simple insert or update.
  - **`deleteCategory`:** refuse if it has products, or if it is the last category. Also catch 23503.
  - **`createProduct`:** generate the id with `crypto.randomUUID()`, then `db.batch([insert product, insert product_stock {quantity}])`.
  - **`updateProduct`:** update only; stock is not touched.
  - **`archiveProduct` / `restoreProduct`:** status update.
  - **`deleteProduct`:** hard delete (stock cascades). Allowed only for draft or archived products, and never the last product (`next build` needs one).
  - **`adjustStock(id, delta)`:** `UPDATE product_stock SET quantity = quantity + $d WHERE product_id=$id AND quantity + $d >= 0 RETURNING quantity`. Zero rows → error "would go negative". If no row exists and delta > 0, upsert instead.
  - **`setStock(id, qty, expected)`:** compare-and-set (`AND quantity = $expected`). Zero rows → "stock changed, reload".
- Server actions in `src/app/(admin)/admin/_actions/{categories,products,stock}.ts` (`"use server"`). Each one, in order:
  1. `await requireAdmin()`
  2. zod `safeParse` of the FormData
  3. the mutation
  4. `updateTag("catalog")`
  5. `redirect` or return state for `useActionState`

## Phase 5 — Image uploads (UploadThing)
- `src/app/api/uploadthing/core.ts`: a `productImage` route, `f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })`. Its `.middleware` reads the session from `req.headers` through `auth.api.getSession` and throws `UploadThingError` if the user isn't an admin. `onUploadComplete` returns `{ url: file.ufsUrl }`.
- `src/app/api/uploadthing/route.ts`: `createRouteHandler({ router })`.
- `src/lib/uploadthing.ts`: `generateUploadButton/Dropzone<OurFileRouter>()`.
- `next.config.ts`: add a remotePattern `{ protocol: "https", hostname: "<APP_ID>.ufs.sh", pathname: "/f/*" }` (or `*.ufs.sh`). Keep the existing Unsplash pattern for seeded data.
- Images stay a `jsonb` `{src, alt}[]` (no new table). The editor uploads files, appends each URL with a required alt-text input, and supports reorder and remove (the first image is the primary one).
- Cleanup (best effort): when a product is saved or hard-deleted, call `new UTApi().deleteFiles(keys)` for removed `ufs.sh` URLs. The key is the path segment after `/f/`.
- Category images use the same uploader with `maxFileCount: 1`.

## Phase 6 — Admin UI
Follow the `build-ui` skill steps and reuse the `globals.css` utilities: `btn*`, `eyebrow`, `heading-page`, `hairline`, `container-page`/`container-narrow`, `text-price`. Also reuse `formatPrice` (`src/lib/format.ts`), the icons (`src/components/icons.tsx`) and the `StockStatus` pattern.

- **Primitives in `src/components/admin/`:**
  - `Field` (label + control + `aria-describedby` error in `text-danger`), `TextInput`, `Textarea`, `Select`
  - `DataTable` (semantic `<table>`, hairline rows, `eyebrow` headers, `tabular-nums`)
  - `StatusBadge`
  - `ConfirmDialog` (native `<dialog>`)
  - `SubmitButton` (`useFormStatus`)
  - `FlashMessage` (`role="status"`)
  - `ImageListEditor`
- **Routes in `src/app/(admin)/admin/`:**
  - `layout.tsx`: sidebar plus top bar. The admin check sits in a Suspense-wrapped child so `{children}` isn't blocked. Sidebar items: Dashboard, Products, Categories, Inventory, and a disabled "Orders — coming soon".
  - `sign-in/page.tsx`: email/password form using `authClient.signIn.email`. This is the only admin page without `requireAdmin`.
  - `page.tsx`: dashboard with counts plus low and sold-out stock.
  - `products/page.tsx` (list with a status filter), `products/new/page.tsx`, `products/[id]/page.tsx` (edit, archive/restore, delete)
  - `categories/page.tsx`, `categories/new/page.tsx`, `categories/[id]/page.tsx`
  - `inventory/page.tsx`: a table with inline adjust (±) and set-exact forms.
  - `loading.tsx` and `error.tsx` at the admin root.
- Every data page uses the existing pattern: a `<Suspense fallback={Skeleton}>` around an async inner component that calls `requireAdmin()` and then admin-queries.

## Phase 7 — Docs
Update CLAUDE.md:
- `updateTag` in actions / `revalidateTag(tag, "max")` elsewhere
- `@theme {}` (not inline)
- admin queries are uncached
- product status
- the `admin:create` script
- auth tables now exist
- UploadThing env

## Verification
1. `npx tsc --noEmit`, `npm run lint`, `npm run build` (needs the seeded DB).
2. `npm run db:seed` still re-runs cleanly; `npm run admin:create` run twice → one admin user.
3. `GET /api/auth/ok` returns ok.
4. Public sign-up is rejected (`POST /api/auth/sign-up/email` → error).
5. Logged out, `/admin` redirects to sign-in. A non-admin user gets 404.
6. Call a server action without a session (e.g. replay its POST) → rejected.
7. As admin:
   - create a category, then a product with an uploaded image → the stock row exists, the product appears on the storefront right after saving;
   - a duplicate slug shows a field error;
   - archive the product → it 404s and disappears from listings; restore it;
   - adjust stock below zero → refused; a stale set → "reload" error;
   - delete a category that has products → refused.
8. Drive these flows in the browser (claude-in-chrome) and check desktop and mobile widths.
