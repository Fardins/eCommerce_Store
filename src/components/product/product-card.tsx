import Image from "next/image";
import Link from "next/link";

import { getStockState, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

import { WishlistButton } from "./wishlist-button";

type ProductCardProps = {
  product: Product;
  sizes?: string;
};

export function ProductCard({
  product,
  sizes = "(min-width: 80rem) 25vw, (min-width: 48rem) 33vw, 50vw",
}: ProductCardProps) {
  const href = `/products/${product.slug}`;
  const soldOut = getStockState(product.stock).status === "out_of_stock";
  const badge = soldOut ? "Sold out" : product.badge;

  return (
    <article className="group relative">
      <div className="media-product">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes={sizes}
          className="transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {badge && (
          <span className="absolute left-3 top-3 z-10 text-2xs uppercase tracking-caps">{badge}</span>
        )}
        <WishlistButton productName={product.name} />
      </div>

      <div className="space-y-1 px-3 pb-6 pt-3 md:px-4">
        <h3 className="text-meta">
          {/* Stretched link makes the whole card clickable, wishlist stays separate. */}
          <Link href={href} className="after:absolute after:inset-0 hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="text-price">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
