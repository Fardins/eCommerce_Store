import Image from "next/image";
import Link from "next/link";

import type { LinkTile } from "@/lib/catalog";

export function CollectionSplit({ collections }: { collections: LinkTile[] }) {
  return (
    <section aria-label="Featured collections" className="split gap-tile">
      {collections.map((collection) => (
        <Link
          key={collection.slug}
          href={collection.href}
          className="group media-scrim relative block aspect-[4/5] overflow-hidden md:aspect-auto md:h-[min(88svh,56rem)]"
        >
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            sizes="(min-width: 48rem) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-1000 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 pb-8 text-paper md:pb-12">
            <h2 className="heading-section">{collection.title}</h2>
            <span className="btn btn-inverse btn-sm">Shop now</span>
          </div>
        </Link>
      ))}
    </section>
  );
}
