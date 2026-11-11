"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import type { Category } from "@prisma/client";

export type SizeOption = { size: string; label: string; quantity: number };

export function AddToCartButton({
  productId,
  slug,
  category,
  name,
  price,
  image,
  quantityAvailable,
  sizes,
}: {
  productId: string;
  slug: string;
  category: Category;
  name: string;
  price: number;
  image: string | null;
  quantityAvailable: number;
  /** When present (non-empty), this product tracks stock per size and a
   * size must be picked before adding to cart. */
  sizes?: SizeOption[];
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const usesSizes = Boolean(sizes && sizes.length > 0);
  const firstInStockSize = sizes?.find((s) => s.quantity > 0)?.size ?? null;
  const [selectedSize, setSelectedSize] = useState<string | null>(firstInStockSize);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSizeOption = usesSizes ? sizes!.find((s) => s.size === selectedSize) : undefined;
  const maxQuantity = usesSizes ? selectedSizeOption?.quantity ?? 0 : quantityAvailable;

  const outOfStock = usesSizes
    ? sizes!.every((s) => s.quantity <= 0)
    : quantityAvailable <= 0;

  if (outOfStock) {
    return (
      <button type="button" className="btn btn-secondary" disabled>
        Out of Stock
      </button>
    );
  }

  return (
    <div className="add-to-cart">
      {usesSizes ? (
        <div className="add-to-cart__sizes">
          <span className="add-to-cart__label">Size</span>
          <div className="add-to-cart__size-options">
            {sizes!.map((option) => (
              <button
                key={option.size}
                type="button"
                className={`add-to-cart__size-option${
                  selectedSize === option.size ? " add-to-cart__size-option--selected" : ""
                }`}
                disabled={option.quantity <= 0}
                aria-pressed={selectedSize === option.size}
                onClick={() => {
                  setSelectedSize(option.size);
                  setQuantity(1);
                  setAdded(false);
                }}
              >
                {option.label}
                {option.quantity <= 0 ? <span className="visually-hidden"> (out of stock)</span> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <label htmlFor="quantity-select" className="add-to-cart__label">
        Quantity
      </label>
      <select
        id="quantity-select"
        className="add-to-cart__quantity"
        value={quantity}
        disabled={usesSizes && !selectedSize}
        onChange={(event) => setQuantity(Number(event.target.value))}
      >
        {Array.from({ length: Math.min(Math.max(maxQuantity, 1), 10) }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn btn-primary"
        disabled={usesSizes && !selectedSize}
        onClick={() => {
          addItem(
            {
              productId,
              slug,
              category,
              name,
              price,
              image,
              size: usesSizes ? selectedSize : null,
              maxQuantity,
            },
            quantity
          );
          setAdded(true);
        }}
      >
        Add to Cart
      </button>

      {added ? (
        <p className="add-to-cart__confirmation" role="status">
          Added to cart.{" "}
          <button type="button" className="link-button" onClick={() => router.push("/cart")}>
            View cart
          </button>
        </p>
      ) : null}
    </div>
  );
}
