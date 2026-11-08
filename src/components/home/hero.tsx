import Image from "next/image";
import Link from "next/link";

import { hero } from "@/lib/catalog";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="media-hero media-scrim">
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        preload
        sizes="100vw"
        className="object-[60%_center]"
      />
      <div className="absolute inset-x-0 bottom-0 z-10 pb-8 text-center text-paper md:pb-16">
        <div className="container-page flex flex-col items-center gap-4">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="heading-display">
            {hero.title}
          </h1>
          <p className="max-w-md text-sm text-paper/85">{hero.description}</p>
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link href={hero.primaryCta.href} className="btn btn-inverse w-full sm:w-auto">
              {hero.primaryCta.label}
            </Link>
            <Link href={hero.secondaryCta.href} className="btn btn-inverse w-full sm:w-auto">
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
