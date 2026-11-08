import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/catalog";

import { SectionHeader } from "@/components/section-header";

type ProductShowcaseProps = {
  id: string;
  eyebrow?: string;
  title: string;
  products: Product[];
  action?: { label: string; href: string };
};

/** Full-width product grid: 2 / 3 / 4 columns with near-touching tiles. */
export function ProductGridSection({ id, eyebrow, title, products, action }: ProductShowcaseProps) {
  // The tablet layout has 3 columns; drop the leftover items there so the last row is never ragged.
  const tabletVisible = products.length >= 3 ? products.length - (products.length % 3) : products.length;

  return (
    <section aria-labelledby={id} className="section">
      <SectionHeader id={id} eyebrow={eyebrow} title={title} action={action} />
      <div className="product-grid">
        {products.map((product, index) => (
          <div key={product.id} className={index >= tabletVisible ? "md:max-xl:hidden" : undefined}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Horizontally scrolling product rail with snap points. */
export function ProductRailSection({ id, eyebrow, title, products, action }: ProductShowcaseProps) {
  return (
    <section aria-labelledby={id} className="section pt-0">
      <SectionHeader id={id} eyebrow={eyebrow} title={title} action={action} />
      <ul
        className="scroll-row gap-tile scroll-px-gutter px-gutter"
        tabIndex={0}
        aria-label={`${title}, scroll horizontally`}
      >
        {products.map((product) => (
          <li key={product.id} className="w-[72%] sm:w-[42%] lg:w-[30%] xl:w-[23%]">
            <ProductCard
              product={product}
              sizes="(min-width: 80rem) 23vw, (min-width: 64rem) 30vw, (min-width: 40rem) 42vw, 72vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
