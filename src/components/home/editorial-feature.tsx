import Image from "next/image";
import Link from "next/link";

import { editorial } from "@/lib/catalog";

export function EditorialFeature() {
  return (
    <section aria-labelledby="editorial-title" className="split bg-surface">
      <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[44rem]">
        <Image
          src={editorial.image.src}
          alt={editorial.image.alt}
          fill
          sizes="(min-width: 48rem) 50vw, 100vw"
          className="object-cover object-top md:object-center"
        />
      </div>
      <div className="flex items-center px-gutter py-16 md:px-12 lg:px-20">
        <div className="max-w-md space-y-6">
          <p className="eyebrow text-muted">{editorial.eyebrow}</p>
          <h2 id="editorial-title" className="font-serif text-3xl font-normal md:text-4xl">
            {editorial.title}
          </h2>
          <p className="text-sm text-muted md:text-base">{editorial.body}</p>
          <Link href={editorial.cta.href} className="btn btn-secondary">
            {editorial.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
