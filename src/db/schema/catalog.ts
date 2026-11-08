import { relations, sql } from "drizzle-orm";
import { check, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type ImageAsset = {
  src: string;
  alt: string;
};

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const productBadge = pgEnum("product_badge", ["New", "Exclusive"]);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    slug: text("slug").notNull().unique(),
    sku: text("sku").notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    color: text("color").notNull(),
    material: text("material").notNull(),
    /** Minor units (cents), USD. */
    price: integer("price").notNull(),
    details: text("details").array().notNull().default(sql`'{}'::text[]`),
    /** Ordered gallery, primary image first. */
    images: jsonb("images").$type<ImageAsset[]>().notNull(),
    badge: productBadge("badge"),
    ...timestamps,
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    check("products_price_non_negative", sql`${table.price} >= 0`),
    // Cards and metadata use images[0], so every product needs at least one image.
    check("products_images_not_empty", sql`jsonb_typeof(${table.images}) = 'array' and jsonb_array_length(${table.images}) > 0`),
  ],
);

export const productStock = pgTable(
  "product_stock",
  {
    productId: uuid("product_id")
      .primaryKey()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    updatedAt: timestamps.updatedAt,
  },
  (table) => [check("product_stock_quantity_non_negative", sql`${table.quantity} >= 0`)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  stock: one(productStock, { fields: [products.id], references: [productStock.productId] }),
}));

export const productStockRelations = relations(productStock, ({ one }) => ({
  product: one(products, { fields: [productStock.productId], references: [products.id] }),
}));
