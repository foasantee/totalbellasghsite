"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import type { Category } from "@prisma/client";

export function AddToCartButton({
  productId,
  slug,
  category,
  name,
  price,
  image,
  quantityAvailable,
}: {
  productId: string;
  slug: string;
  category: Category;
  name: string;
  price: number;
  image: string | null;
  quantityAvailable: number;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (quantityAvailable <= 0) {
    return (
      <button type="button" className="btn btn-secondary" disabled>
        Out of Stock
      </button>
    );
  }

  return (
    <div className="add-to-cart">
      <label htmlFor="quantity-select" className="add-to-cart__label">
        Quantity
      </label>
      <select
        id="quantity-select"
        className="add-to-cart__quantity"
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      >
        {Array.from({ length: Math.min(quantityAvailable, 10) }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          addItem(
            {
              productId,
              slug,
              category,
              name,
              price,
              image,
              maxQuantity: quantityAvailable,
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
