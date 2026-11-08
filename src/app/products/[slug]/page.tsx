import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductAccordion } from "@/components/product/product-accordion";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGridSection } from "@/components/product/product-showcase";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { StockStatus } from "@/components/product/stock-status";
import { brand, categoryHref, getStockState, shippingAndReturns } from "@/lib/catalog";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "@/lib/catalog-queries";
import { formatPrice } from "@/lib/format";

// Cache Components needs at least one param here, so seed the database before building.
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  // Metadata resolves before streaming for crawlers, so this gives them a real 404 status.
  // Browsers get the not-found UI (with noindex) via the notFound() in ProductDetail.
  if (!product) notFound();

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image.src, alt: product.image.alt }],
    },
  };
}

// params are read inside <Suspense> so the route keeps a shared shell for instant navigations.
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

/** Mirrors the product layout so navigation paints the page's shape immediately. */
function ProductPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product" className="lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="aspect-[4/5] animate-pulse bg-surface md:aspect-square lg:aspect-[4/5]" />
      <div className="px-gutter pb-12 pt-6 lg:px-12 lg:py-10 xl:px-16">
        <div className="mx-auto max-w-md space-y-4 lg:mx-0">
          <div className="h-3 w-40 bg-surface-strong" />
          <div className="h-3 w-16 bg-surface-strong" />
          <div className="h-7 w-3/4 bg-surface-strong" />
          <div className="h-5 w-20 bg-surface-strong" />
          <div className="h-20 w-full bg-surface" />
          <div className="h-12 w-full bg-surface-strong" />
          <div className="h-12 w-full bg-surface" />
        </div>
      </div>
    </div>
  );
}

async function ProductDetail({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const stock = getStockState(product.stock);
  const categoryLabel = product.category.name;
  const related = await getRelatedProducts(product.id, product.category.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.images.map((image) => image.src),
    brand: { "@type": "Brand", name: brand.name },
    color: product.color,
    material: product.material,
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "USD",
      availability:
        stock.status === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <article className="lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ProductGallery images={product.images} />

        <div className="px-gutter pb-12 pt-6 lg:px-12 lg:py-10 xl:px-16">
          <div className="mx-auto max-w-md lg:sticky lg:top-[calc(var(--spacing-header)+3.5rem)] lg:mx-0">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-2xs text-muted">
                <li>
                  <Link href="/" className="link-quiet">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={categoryHref(product.category.slug)} className="link-quiet">
                    {categoryLabel}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-ink">
                  {product.name}
                </li>
              </ol>
            </nav>

            <div className="space-y-3">
              <p className="eyebrow flex items-center gap-3 text-muted">
                <Link href={categoryHref(product.category.slug)} className="link-quiet">
                  {categoryLabel}
                </Link>
                {product.badge && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-ink">{product.badge}</span>
                  </>
                )}
              </p>
              <h1 className="heading-page">{product.name}</h1>
              <p className="text-base font-medium tabular-nums">{formatPrice(product.price)}</p>
              <p className="text-2xs uppercase tracking-caps text-muted">Style {product.sku}</p>
            </div>

            <p className="mt-6 text-sm text-muted">{product.description}</p>

            <dl className="mt-6 space-y-2 border-t border-line pt-6">
              <div className="text-meta flex gap-2">
                <dt className="text-muted">Colour</dt>
                <dd>{product.color}</dd>
              </div>
              <div className="text-meta flex gap-2">
                <dt className="text-muted">Material</dt>
                <dd>{product.material}</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-4">
              <StockStatus state={stock} />
              <PurchasePanel productName={product.name} stock={product.stock} />
            </div>

            <p className="text-meta mt-4 text-center text-muted">
              Complimentary express shipping and returns
            </p>

            <div className="mt-8">
              <ProductAccordion
                items={[
                  {
                    title: "Product details",
                    defaultOpen: true,
                    content: (
                      <ul className="list-disc space-y-1 pl-4">
                        {product.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    title: "Shipping & returns",
                    content: (
                      <ul className="space-y-1">
                        {shippingAndReturns.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    title: "Care & repairs",
                    content: (
                      <p>
                        Store in the dust bag provided, away from direct light and moisture. Our
                        client care team offers repairs for the lifetime of the piece.{" "}
                        <Link href="/contact" className="link text-ink">
                          Contact client care
                        </Link>
                      </p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </article>

      <div className="divider">
        <ProductGridSection
          id="related-title"
          eyebrow="Complete the look"
          title="You may also like"
          products={related}
          action={{ label: `View all ${categoryLabel.toLowerCase()}`, href: categoryHref(product.category.slug) }}
        />
      </div>

      <script
        type="application/ld+json"
        // JSON.stringify output is safe here: values come from our own catalog database, and < is escaped below.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
