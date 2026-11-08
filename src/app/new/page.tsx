import type { Metadata } from "next";

import { ListingGrid, ListingHeader } from "@/components/product/product-listing";
import { getNewArrivals } from "@/lib/catalog-queries";

const NEW_ARRIVALS_LIMIT = 24;

export const metadata: Metadata = {
  title: "New arrivals",
  description: "The latest leather goods and ready-to-wear, just in for the season.",
};

// getNewArrivals is cached ("use cache"), so the page prerenders into the static shell like the homepage.
export default async function NewArrivalsPage() {
  const products = await getNewArrivals(NEW_ARRIVALS_LIMIT);

  return (
    <section aria-labelledby="new-arrivals-title" className="pb-section">
      <ListingHeader
        id="new-arrivals-title"
        eyebrow="Just in"
        title="New arrivals"
        description="The latest pieces from the house, from soft-structured leather to the season’s tailoring."
        count={products.length}
      />
      <ListingGrid
        products={products}
        empty={{
          title: "Nothing new just yet",
          body: "The next pieces are on their way. In the meantime, explore the collection.",
          action: { label: "Back to the homepage", href: "/" },
        }}
      />
    </section>
  );
}
