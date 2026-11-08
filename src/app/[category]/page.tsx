import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ListingGrid, ListingHeader, ListingSkeleton } from "@/components/product/product-listing";
import { brand } from "@/lib/catalog";
import { getCategories, getProductsByCategory } from "@/lib/catalog-queries";

// Cache Components needs at least one param here, so seed the database before building.
// Unknown slugs (e.g. /women) aren't prerendered and fall through to notFound() below.
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

async function findCategory(slug: string) {
  const categories = await getCategories();
  return { category: categories.find((c) => c.slug === slug), categories };
}

export async function generateMetadata({ params }: PageProps<"/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const { category } = await findCategory(slug);
  // Gives crawlers a real 404 status; browsers get the not-found UI via CategoryListing.
  if (!category) notFound();

  const description = `Shop ${category.title.toLowerCase()} from ${brand.name}. ${brand.tagline}`;
  return {
    title: category.title,
    description,
    openGraph: {
      title: category.title,
      description,
      images: [{ url: category.image.src, alt: category.image.alt }],
    },
  };
}

// params are read inside <Suspense> so the route keeps a shared shell for instant navigations.
export default function CategoryPage({ params }: PageProps<"/[category]">) {
  return (
    <Suspense fallback={<ListingSkeleton label="Loading collection" />}>
      <CategoryListing params={params} />
    </Suspense>
  );
}

async function CategoryListing({ params }: Pick<PageProps<"/[category]">, "params">) {
  const { category: slug } = await params;
  const { category, categories } = await findCategory(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  return (
    <section aria-labelledby="category-title" className="pb-section">
      <ListingHeader id="category-title" eyebrow="The collection" title={category.title} count={products.length}>
        {categories.length > 1 && (
          <nav aria-label="Categories" className="-mx-gutter mt-6 md:mt-8">
            <ul className="scroll-row gap-6 scroll-px-gutter px-gutter">
              {categories.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    aria-current={item.slug === category.slug ? "page" : undefined}
                    className="eyebrow link-quiet block py-2 text-muted hover:text-ink aria-[current=page]:text-ink"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </ListingHeader>

      <ListingGrid
        products={products}
        empty={{
          title: "Nothing here just yet",
          body: `New ${category.title.toLowerCase()} are on their way. In the meantime, see what has just arrived.`,
          action: { label: "Shop new arrivals", href: "/new" },
        }}
      />
    </section>
  );
}
