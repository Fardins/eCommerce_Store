import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import type { LinkTile } from "@/lib/catalog";

import { SectionHeader } from "@/components/section-header";

export function CategoryGrid({ categories }: { categories: LinkTile[] }) {
  return (
    <section aria-labelledby="categories-title" className="section">
      <SectionHeader id="categories-title" eyebrow="Explore" title="Shop by category" />
      <ul className="container-bleed grid grid-cols-2 gap-x-tile gap-y-6 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={category.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                <Image
                  src={category.image.src}
                  alt={category.image.alt}
                  fill
                  sizes="(min-width: 64rem) 25vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                />
              </div>
              <p className="eyebrow mt-3 flex items-center gap-2">
                {category.title}
                <ArrowRightIcon
                  width={14}
                  height={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
