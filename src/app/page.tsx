import { CategoryGrid } from "@/components/home/category-grid";
import { CollectionSplit } from "@/components/home/collection-split";
import { EditorialFeature } from "@/components/home/editorial-feature";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { ProductGridSection, ProductRailSection } from "@/components/product/product-showcase";
import { Services } from "@/components/home/services";
import { featuredCollections } from "@/lib/catalog";
import { getCategories, getNewArrivals, getProductsByCategory } from "@/lib/catalog-queries";

// The catalog reads are cached ("use cache"), so the page still prerenders into the static shell.
export default async function HomePage() {
  const [newArrivals, signatureBags, categories] = await Promise.all([
    getNewArrivals(),
    getProductsByCategory("bags"),
    getCategories(),
  ]);

  return (
    <>
      <Hero />

      <section aria-label="Season introduction" className="container-narrow section text-center">
        <p className="eyebrow text-muted">The new season</p>
        <p className="mx-auto mt-4 max-w-xl text-base md:text-lg">
          A wardrobe built on restraint: considered silhouettes, quiet hardware and leather that
          only gets better with time.
        </p>
      </section>

      <CollectionSplit collections={featuredCollections} />

      <ProductGridSection
        id="new-arrivals-title"
        eyebrow="Just in"
        title="New arrivals"
        products={newArrivals}
        action={{ label: "View all", href: "/new" }}
      />

      <EditorialFeature />

      <CategoryGrid categories={categories} />

      <ProductRailSection
        id="signature-bags-title"
        eyebrow="Icons of the house"
        title="Signature bags"
        products={signatureBags}
        action={{ label: "Shop bags", href: "/bags" }}
      />

      <Services />
      <Newsletter />
    </>
  );
}
