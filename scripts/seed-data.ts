// Sample catalog loaded by scripts/seed.ts. The storefront reads this data from Postgres, not from here.

import type { ImageAsset } from "../src/db/schema/catalog";

export type SeedCategory = {
  slug: string;
  title: string;
  image: ImageAsset;
};

export type SeedProduct = {
  slug: string;
  sku: string;
  name: string;
  category: string; // category slug
  price: number; // minor units (cents)
  stock: number;
  color: string;
  material: string;
  description: string;
  details: string[];
  image: ImageAsset;
  images: ImageAsset[];
  badge?: "New" | "Exclusive";
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=2400`;

/** Close-up crop of the same photo, centered on a focal point and zoomed in. */
const unsplashDetail = (id: string, x: number, y: number, zoom: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=focalpoint&fp-x=${x}&fp-y=${y}&fp-z=${zoom}&w=1600&h=2000&q=80`;

/** Sample gallery: full shot plus two detail crops. Real products will have their own photography. */
function gallery(id: string, alt: string): Pick<SeedProduct, "image" | "images"> {
  const image = { src: unsplash(id), alt };
  return {
    image,
    images: [
      image,
      { src: unsplashDetail(id, 0.5, 0.45, 1.8), alt: `${alt}, close-up` },
      { src: unsplashDetail(id, 0.38, 0.6, 2.6), alt: `${alt}, detail of the finish` },
    ],
  };
}

/** Listed newest first: the seed gives earlier entries a later created_at. */
export const products: SeedProduct[] = [
  {
    slug: "aurelia-buckle-satchel",
    sku: "ME-BG-1001",
    name: "Aurelia buckle satchel",
    category: "bags",
    price: 325000,
    stock: 2,
    badge: "New",
    color: "Dove grey",
    material: "Pebbled calf leather",
    description:
      "A structured satchel with twin buckled straps and a top handle, sized to carry the day's essentials without losing its shape.",
    details: [
      "Pebbled calf leather with suede lining",
      "Gold-toned brass buckles",
      "Detachable, adjustable shoulder strap",
      "Interior slip pocket",
      "W 26 × H 19 × D 9 cm",
      "Made in Italy",
    ],
    ...gallery("1605733513597-a8f8341084e6", "Grey leather satchel with gold buckles"),
  },
  {
    slug: "noir-patent-slingback",
    sku: "ME-SH-2001",
    name: "Noir patent slingback",
    category: "shoes",
    price: 105000,
    stock: 9,
    badge: "New",
    color: "Black",
    material: "Patent leather",
    description:
      "A pointed slingback on a sculpted lacquered heel, polished enough for evening and steady enough for a full day.",
    details: [
      "Crinkled patent leather upper",
      "Sculpted 4 cm heel",
      "Elasticated slingback strap",
      "Leather sole and lining",
      "Fits true to size",
      "Made in Italy",
    ],
    ...gallery("1789110519431-0a9bf0af5074", "Black patent leather slingback shoe"),
  },
  {
    slug: "catena-chain-necklace",
    sku: "ME-JW-3001",
    name: "Catena chain necklace",
    category: "jewelry",
    price: 175000,
    stock: 14,
    color: "Yellow gold",
    material: "18k gold-plated sterling silver",
    description:
      "Interlocking hand-finished links that sit close at the collarbone. Wear it alone or layered with finer chains.",
    details: [
      "18k gold plating over sterling silver",
      "Lobster clasp",
      "Length 45 cm with 5 cm extender",
      "Presented in a signature pouch",
      "Made in Italy",
    ],
    ...gallery("1611107683227-e9060eccd846", "Gold chain necklace on a white surface"),
  },
  {
    slug: "mira-crossbody-bag",
    sku: "ME-BG-1002",
    name: "Mira crossbody bag",
    category: "bags",
    price: 215000,
    stock: 11,
    color: "Silver grey",
    material: "Smooth calf leather",
    description:
      "A compact flap bag with studded trim and a chain strap that converts from shoulder to crossbody.",
    details: [
      "Smooth calf leather",
      "Pale gold-toned studs and hardware",
      "Chain and leather strap, two lengths",
      "Magnetic flap closure",
      "W 22 × H 15 × D 7 cm",
      "Made in Italy",
    ],
    ...gallery("1559563458-527698bf5295", "Grey leather crossbody bag"),
  },
  {
    slug: "linea-acetate-sunglasses",
    sku: "ME-EW-4001",
    name: "Linea acetate sunglasses",
    category: "eyewear",
    price: 52000,
    stock: 20,
    color: "Black / smoke gradient",
    material: "Acetate and metal",
    description:
      "A browline frame in polished acetate over a fine metal rim, with gradient lenses for soft, even shade.",
    details: [
      "Acetate brow with metal rim",
      "Gradient lenses, 100% UV protection",
      "Spring hinges",
      "Includes leather case and cleaning cloth",
      "Made in Italy",
    ],
    ...gallery("1584036553516-bf83210aa16c", "Black framed sunglasses on a white surface"),
  },
  {
    slug: "soleil-top-handle-bag",
    sku: "ME-BG-1003",
    name: "Soleil top handle bag",
    category: "bags",
    price: 289000,
    stock: 0,
    badge: "Exclusive",
    color: "Saffron",
    material: "Croc-embossed calf leather",
    description:
      "An architectural top handle bag in saturated saffron, with a turn-lock closure and an expandable gusset.",
    details: [
      "Croc-embossed calf leather",
      "Silver-toned turn-lock",
      "Detachable shoulder strap",
      "Two interior compartments",
      "W 25 × H 20 × D 11 cm",
      "Made in Italy",
    ],
    ...gallery("1640901555383-7335ec5a6476", "Yellow top handle handbag on a white background"),
  },
  {
    slug: "arden-leather-shoe",
    sku: "ME-SH-2002",
    name: "Arden leather shoe",
    category: "shoes",
    price: 98000,
    stock: 7,
    color: "Espresso",
    material: "Burnished calf leather",
    description:
      "A wingtip derby, hand-burnished for depth of colour, on a Goodyear-welted sole that can be resoled for years.",
    details: [
      "Burnished calf leather upper",
      "Brogue wingtip detailing",
      "Goodyear-welted leather sole",
      "Leather lining",
      "Fits true to size",
      "Made in Portugal",
    ],
    ...gallery("1641893843833-a006778dc00b", "Pair of brown leather wingtip shoes"),
  },
  {
    slug: "trio-studded-rings",
    sku: "ME-JW-3002",
    name: "Trio studded rings",
    category: "jewelry",
    price: 89000,
    stock: 3,
    color: "Yellow gold",
    material: "18k gold-plated brass, crystal",
    description:
      "Three stacking rings in woven, pavé and heart motifs. Designed to be worn together or apart.",
    details: [
      "18k gold-plated brass",
      "Hand-set crystals",
      "Set of three rings",
      "Presented in a signature box",
      "Made in Italy",
    ],
    ...gallery("1543294001-f7cd5d7fb516", "Three gold studded rings"),
  },
  {
    slug: "cassia-mini-bag",
    sku: "ME-BG-1004",
    name: "Cassia mini bag",
    category: "bags",
    price: 195000,
    stock: 6,
    color: "Tobacco",
    material: "Vegetable-tanned leather",
    description:
      "A small flap bag in vegetable-tanned leather that darkens and softens with wear, finished with a push-lock clasp.",
    details: [
      "Vegetable-tanned leather",
      "Antique brass push-lock",
      "Top handle and adjustable strap",
      "W 20 × H 14 × D 8 cm",
      "Made in Italy",
    ],
    ...gallery("1711548244653-72219aa9ac27", "Brown leather mini bag on a table"),
  },
  {
    slug: "verona-shoulder-bag",
    sku: "ME-BG-1005",
    name: "Verona shoulder bag",
    category: "bags",
    price: 360000,
    stock: 4,
    badge: "New",
    color: "Cognac / black",
    material: "Calf leather",
    description:
      "A softly structured shoulder bag with contrast trim, roomy enough for a laptop sleeve and the rest of the day.",
    details: [
      "Calf leather with contrast trim",
      "Magnetic closure",
      "Interior zip and slip pockets",
      "W 32 × H 24 × D 12 cm",
      "Made in Italy",
    ],
    ...gallery("1746880223690-359948154c53", "Brown and black leather shoulder bag on display"),
  },
  {
    slug: "riviera-woven-tote",
    sku: "ME-BG-1006",
    name: "Riviera woven tote",
    category: "bags",
    price: 148000,
    stock: 15,
    color: "Natural",
    material: "Woven raffia, leather trim",
    description:
      "A hand-woven tote with leather handles, made for long weekends and warm cities.",
    details: [
      "Hand-woven raffia",
      "Leather handles and trim",
      "Unlined, with a removable leather pouch",
      "W 40 × H 30 × D 15 cm",
      "Made in Spain",
    ],
    ...gallery("1524679813234-66a389fe1a42", "Two brown woven tote bags"),
  },
  {
    slug: "ivory-cat-eye-sunglasses",
    sku: "ME-EW-4002",
    name: "Ivory cat-eye sunglasses",
    category: "eyewear",
    price: 56000,
    stock: 0,
    color: "Ivory / brown",
    material: "Acetate",
    description:
      "A softly lifted cat-eye in ivory acetate with warm brown lenses.",
    details: [
      "Polished acetate frame",
      "Brown lenses, 100% UV protection",
      "Five-barrel hinges",
      "Includes leather case and cleaning cloth",
      "Made in Italy",
    ],
    ...gallery("1577803645773-f96470509666", "White framed sunglasses with brown lenses"),
  },
];

/** In display order. */
export const categories: SeedCategory[] = [
  {
    slug: "bags",
    title: "Bags",
    image: { src: unsplash("1537440437066-c585a62baf1f"), alt: "Person holding a black leather handbag" },
  },
  {
    slug: "shoes",
    title: "Shoes",
    image: { src: unsplash("1632497775901-50ba4637399f"), alt: "Pair of black shoes hanging on a wall" },
  },
  {
    slug: "jewelry",
    title: "Jewelry",
    image: { src: unsplash("1606760227091-3dd870d97f1d"), alt: "Gold and silver jewelry arranged together" },
  },
  {
    slug: "eyewear",
    title: "Eyewear",
    image: { src: unsplash("1619785690726-89c6b3bd3849"), alt: "Woman in a purple coat wearing black sunglasses" },
  },
];
