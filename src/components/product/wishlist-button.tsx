"use client";

import { useState } from "react";

import { HeartIcon } from "@/components/icons";

type WishlistButtonProps = {
  productName: string;
  /** "icon": round button overlaid on a product tile. "full": labelled button for the product page. */
  variant?: "icon" | "full";
};

// UI-only toggle for now; persist to the user's wishlist once accounts exist.
export function WishlistButton({ productName, variant = "icon" }: WishlistButtonProps) {
  const [saved, setSaved] = useState(false);
  const toggle = () => setSaved((s) => !s);
  const heart = <HeartIcon fill={saved ? "currentColor" : "none"} />;

  if (variant === "full") {
    return (
      <button type="button" onClick={toggle} aria-pressed={saved} className="btn btn-secondary btn-block">
        {heart}
        {saved ? "Saved to wishlist" : "Save to wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      className="btn-icon absolute right-2 top-2 z-10 hover:bg-paper/70"
    >
      {heart}
    </button>
  );
}
