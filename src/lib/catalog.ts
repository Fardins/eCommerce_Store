// Storefront types and site copy. Products, categories and stock live in Postgres:
// read them through src/lib/catalog-queries.ts (sample data is seeded from scripts/seed-data.ts).

import type { ImageAsset } from "@/db/schema/catalog";

export type { ImageAsset };

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: { slug: string; name: string };
  price: number; // minor units (cents)
  stock: number; // units available
  color: string;
  material: string;
  description: string;
  details: string[];
  image: ImageAsset; // primary image, used on cards
  images: ImageAsset[]; // full gallery, primary first
  badge?: "New" | "Exclusive";
};

export type LinkTile = {
  slug: string;
  title: string;
  href: string;
  image: ImageAsset;
};

export type StockState = {
  status: "in_stock" | "low_stock" | "out_of_stock";
  label: string;
};

const LOW_STOCK_THRESHOLD = 3;

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=2400`;

export const categoryHref = (categorySlug: string) => `/${categorySlug}`;

export const brand = {
  name: "Maison Elara",
  tagline: "Leather goods and ready-to-wear, made to be kept.",
};

export const announcement = "Complimentary express shipping and returns on all orders";

export const hero = {
  eyebrow: "Autumn–Winter 2026",
  title: "The Quiet Hour",
  description: "Tailoring, leather and soft structure for the season after dark.",
  primaryCta: { label: "Discover the collection", href: "/collections/the-quiet-hour" },
  secondaryCta: { label: "Shop women", href: "/women" },
  image: {
    src: unsplash("1645561305502-63a9ba09ab09"),
    alt: "Woman in a long coat and dark sunglasses",
  },
};

export const featuredCollections: LinkTile[] = [
  {
    slug: "women",
    title: "Women",
    href: "/women",
    image: {
      src: unsplash("1580478491436-fd6a937acc9e"),
      alt: "Woman in a red blazer seated on a stone staircase",
    },
  },
  {
    slug: "men",
    title: "Men",
    href: "/men",
    image: {
      src: unsplash("1656695230389-01185e6fbff8"),
      alt: "Man wearing sunglasses",
    },
  },
];

export function getStockState(stock: number): StockState {
  if (stock <= 0) return { status: "out_of_stock", label: "Sold out" };
  if (stock <= LOW_STOCK_THRESHOLD) return { status: "low_stock", label: `Only ${stock} left` };
  return { status: "in_stock", label: "In stock" };
}

export const shippingAndReturns = [
  "Complimentary express delivery in 2–3 business days.",
  "Free returns within 30 days, collected from your door.",
  "Every order arrives in signature packaging.",
];

export const editorial = {
  eyebrow: "The Edit",
  title: "Made to be kept",
  body: "Every piece in the leather collection is cut, stitched and finished by hand in small workshops, then built to soften and deepen with years of wear.",
  cta: { label: "Read the story", href: "/stories/made-to-be-kept" },
  image: {
    src: unsplash("1574015974293-817f0ebebb74"),
    alt: "Black and white portrait of a woman in a long-sleeved shirt",
  },
};

export const services = [
  { title: "Complimentary shipping", body: "Free express delivery and returns on every order." },
  { title: "Book an appointment", body: "Shop in store or online with a dedicated client advisor." },
  { title: "Signature packaging", body: "Every order arrives gift-wrapped with a handwritten note." },
  { title: "Client care", body: "Repairs and aftercare for the lifetime of your piece." },
];

export const navigation = [
  { label: "New In", href: "/new" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Bags", href: "/bags" },
  { label: "Jewelry", href: "/jewelry" },
  { label: "Gifts", href: "/gifts" },
];

export const footerLinks = [
  {
    title: "Client Services",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "The House",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of sale", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Cookie settings", href: "/cookies" },
    ],
  },
];
