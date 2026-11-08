// Loads the sample catalog into Postgres. Safe to re-run: rows are upserted by slug / product id.
// Usage: npm run db:seed   (reads DATABASE_URL from .env.local)

import { sql } from "drizzle-orm";

import { db } from "../src/db";
import { categories, products, productStock } from "../src/db/schema";
import * as seed from "./seed-data";

/** Value the conflicting INSERT tried to write, for ON CONFLICT DO UPDATE. */
const excluded = (column: string) => sql.raw(`excluded."${column}"`);

async function main() {
  const categoryRows = await db
    .insert(categories)
    .values(
      seed.categories.map((category, index) => ({
        slug: category.slug,
        name: category.title,
        imageUrl: category.image.src,
        imageAlt: category.image.alt,
        sortOrder: index,
      })),
    )
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        name: excluded("name"),
        imageUrl: excluded("image_url"),
        imageAlt: excluded("image_alt"),
        sortOrder: excluded("sort_order"),
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: categories.id, slug: categories.slug });

  const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]));

  // Seed products are listed newest first; space created_at a minute apart to keep that order.
  const now = Date.now();
  const productRows = await db
    .insert(products)
    .values(
      seed.products.map((product, index) => {
        const categoryId = categoryIds.get(product.category);
        if (!categoryId) throw new Error(`Unknown category "${product.category}" on ${product.slug}`);
        return {
          categoryId,
          slug: product.slug,
          sku: product.sku,
          name: product.name,
          description: product.description,
          color: product.color,
          material: product.material,
          price: product.price,
          details: product.details,
          images: product.images,
          badge: product.badge ?? null,
          createdAt: new Date(now - index * 60_000),
        };
      }),
    )
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        categoryId: excluded("category_id"),
        sku: excluded("sku"),
        name: excluded("name"),
        description: excluded("description"),
        color: excluded("color"),
        material: excluded("material"),
        price: excluded("price"),
        details: excluded("details"),
        images: excluded("images"),
        badge: excluded("badge"),
        createdAt: excluded("created_at"),
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: products.id, slug: products.slug });

  const productIds = new Map(productRows.map((row) => [row.slug, row.id]));

  await db
    .insert(productStock)
    .values(seed.products.map((product) => ({ productId: productIds.get(product.slug)!, quantity: product.stock })))
    .onConflictDoUpdate({
      target: productStock.productId,
      set: { quantity: excluded("quantity"), updatedAt: sql`now()` },
    });

  console.log(`Seeded ${categoryRows.length} categories, ${productRows.length} products with stock.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
