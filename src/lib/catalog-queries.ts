// Server-side catalog reads. Each function is cached with `use cache`, so pages that call it
// stay in the static shell. Call revalidateTag("catalog") after writes to refresh immediately;
// otherwise the "minutes" profile picks up changes (e.g. stock edited in Drizzle Studio) within about a minute.

import { cacheLife, cacheTag } from "next/cache";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { categories, type products, type productStock } from "@/db/schema";
import { categoryHref, type LinkTile, type Product } from "@/lib/catalog";

const CATALOG_TAG = "catalog";

const withRelations = {
  category: { columns: { slug: true, name: true } },
  stock: { columns: { quantity: true } },
} as const;

type ProductRow = typeof products.$inferSelect & {
  category: { slug: string; name: string };
  stock: Pick<typeof productStock.$inferSelect, "quantity"> | null;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    category: row.category,
    price: row.price,
    stock: row.stock?.quantity ?? 0,
    color: row.color,
    material: row.material,
    description: row.description,
    details: row.details,
    image: row.images[0],
    images: row.images,
    badge: row.badge ?? undefined,
  };
}

/** Subquery: id of the category with this slug. */
const categoryIdBySlug = (slug: string) =>
  sql`(select ${categories.id} from ${categories} where ${categories.slug} = ${slug})`;

export async function getCategories(): Promise<LinkTile[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);

  const rows = await db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder), asc(c.name)],
  });
  return rows.map((row) => ({
    slug: row.slug,
    title: row.name,
    href: categoryHref(row.slug),
    image: { src: row.imageUrl, alt: row.imageAlt },
  }));
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);

  const rows = await db.query.products.findMany({
    with: withRelations,
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    limit,
  });
  return rows.map(toProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);

  const rows = await db.query.products.findMany({
    with: withRelations,
    where: (p, { eq }) => eq(p.categoryId, categoryIdBySlug(categorySlug)),
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);

  const row = await db.query.products.findFirst({
    with: withRelations,
    where: (p, { eq }) => eq(p.slug, slug),
  });
  return row ? toProduct(row) : null;
}

/** Same-category products first, topped up from the rest of the catalog. */
export async function getRelatedProducts(productId: string, categorySlug: string, limit = 4): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);

  const rows = await db.query.products.findMany({
    with: withRelations,
    where: (p, { ne }) => ne(p.id, productId),
    orderBy: (p, { desc }) => [desc(sql`${p.categoryId} = ${categoryIdBySlug(categorySlug)}`), desc(p.createdAt)],
    limit,
  });
  return rows.map(toProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);

  const rows = await db.query.products.findMany({ columns: { slug: true } });
  return rows.map((row) => row.slug);
}
