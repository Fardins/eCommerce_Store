"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { ImageAsset } from "@/lib/catalog";

/**
 * One set of images, two layouts:
 * - below lg: full-width swipeable carousel with snap points and dot controls
 * - lg and up: editorial stack, lead image full width, the rest two-up
 */
export function ProductGallery({ images }: { images: ImageAsset[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const rail = railRef.current;
    if (rail) setActive(Math.round(rail.scrollLeft / rail.clientWidth));
  };

  const goTo = (index: number) => {
    const rail = railRef.current;
    rail?.scrollTo({ left: index * rail.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={railRef}
        onScroll={onScroll}
        aria-label="Product images"
        className="scroll-row lg:grid lg:grid-cols-2 lg:gap-tile lg:overflow-visible"
      >
        {images.map((image, index) => (
          <li
            key={image.src}
            className={`w-full lg:w-auto ${index === 0 ? "lg:col-span-2" : ""}`}
            aria-label={`Image ${index + 1} of ${images.length}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-surface md:aspect-square lg:aspect-[4/5]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload={index === 0}
                sizes={index === 0 ? "(min-width: 64rem) 60vw, 100vw" : "(min-width: 64rem) 30vw, 100vw"}
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 lg:hidden">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={active === index}
              className="grid h-6 w-6 cursor-pointer place-items-center"
            >
              <span
                className={`block h-1.5 rounded-pill transition-all ${
                  active === index ? "w-5 bg-ink" : "w-1.5 bg-ink/30"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
