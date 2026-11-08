"use client";

import { useEffect, useState } from "react";

import { WishlistButton } from "./wishlist-button";

const MAX_QUANTITY = 5;

type PurchasePanelProps = {
  productName: string;
  stock: number;
};

// UI only: there is no cart yet. Replace the local "added" state with a cart action later.
export function PurchasePanel({ productName, stock }: PurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(timer);
  }, [added]);

  const soldOut = stock <= 0;
  const maxQuantity = Math.min(stock, MAX_QUANTITY);

  return (
    <div className="space-y-3">
      {soldOut ? (
        <>
          <button type="button" className="btn btn-primary btn-block" disabled>
            Sold out
          </button>
          <button
            type="button"
            onClick={() => setNotify(true)}
            className="btn btn-secondary btn-block"
            disabled={notify}
          >
            {notify ? "We’ll let you know" : "Notify me when available"}
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="quantity" className="eyebrow">
              Quantity
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-10 w-20 cursor-pointer border border-line bg-paper px-3 text-sm hover:border-ink"
            >
              {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <button type="button" onClick={() => setAdded(true)} className="btn btn-primary btn-block">
            {added ? "Added to bag" : "Add to bag"}
          </button>
        </>
      )}

      <WishlistButton productName={productName} variant="full" />

      <p role="status" className="sr-only">
        {added ? `${quantity} × ${productName} added to bag` : ""}
        {notify ? `We’ll email you when ${productName} is back in stock` : ""}
      </p>
    </div>
  );
}
