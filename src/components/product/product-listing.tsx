import Link from "next/link";
import type { ReactNode } from "react";

import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/catalog";

type ListingHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  count?: number;
  /** Rendered under the title block, e.g. sibling-category links. */
  children?: ReactNode;
};

/** Page header for product listings: breadcrumb, title block and item count. */
export function ListingHeader({ id, eyebrow, title, description, count, children }: ListingHeaderProps) {
  return (
    <header className="container-bleed pb-6 pt-6 md:pb-8 md:pt-8">
      <nav aria-label="Breadcrumb" className="mb-6 md:mb-10">
        <ol className="flex flex-wrap items-center gap-2 text-2xs text-muted">
          <li>
            <Link href="/" className="link-quiet">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {title}
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-md space-y-2">
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h1 id={id} className="heading-page">
            {title}
          </h1>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {count !== undefined && count > 0 && (
          <p className="text-meta text-muted tabular-nums">
            {count} {count === 1 ? "piece" : "pieces"}
          </p>
        )}
      </div>

      {children}
    </header>
  );
}

type ListingGridProps = {
  products: Product[];
  empty: { title: string; body: string; action: { label: string; href: string } };
};

/** Full product grid (2 / 3 / 4 columns). Unlike ProductGridSection, never hides items. */
export function ListingGrid({ products, empty }: ListingGridProps) {
  if (products.length === 0) {
    return (
      <div className="container-narrow divider py-section text-center">
        <p className="eyebrow">{empty.title}</p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">{empty.body}</p>
        <Link href={empty.action.href} className="btn btn-secondary mt-6">
          {empty.action.label}
        </Link>
      </div>
    );
  }

  return (
    <ul className="product-grid">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

/** Mirrors ListingHeader + ListingGrid so navigation paints the page's shape immediately. */
export function ListingSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true" aria-label={label} className="pb-section">
      <div className="container-bleed space-y-3 pb-6 pt-6 md:pb-8 md:pt-8">
        <div className="mb-6 h-3 w-32 bg-surface-strong md:mb-10" />
        <div className="h-3 w-16 bg-surface-strong" />
        <div className="h-7 w-48 bg-surface-strong" />
        <div className="h-4 w-full max-w-md bg-surface" />
      </div>
      <div className="product-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-surface" />
        ))}
      </div>
    </div>
  );
}
