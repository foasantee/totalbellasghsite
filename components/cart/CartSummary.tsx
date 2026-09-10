"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/format";

export function CartSummary({ editable = true }: { editable?: boolean }) {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-summary">
      <table className="cart-summary__table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            {editable ? <th aria-label="Remove" /> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productId}>
              <td>
                <div className="cart-summary__item">
                  {item.image ? (
                    <div className="cart-summary__thumb">
                      <Image src={item.image} alt="" fill sizes="64px" />
                    </div>
                  ) : null}
                  <span>{item.name}</span>
                </div>
              </td>
              <td>{formatPrice(item.price)}</td>
              <td>
                {editable ? (
                  <select
                    aria-label={`Quantity for ${item.name}`}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                  >
                    {Array.from({ length: Math.min(item.maxQuantity, 10) }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  item.quantity
                )}
              </td>
              <td>{formatPrice(item.price * item.quantity)}</td>
              {editable ? (
                <td>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="cart-summary__subtotal">
        Subtotal: <strong>{formatPrice(subtotal)}</strong>
      </p>
    </div>
  );
}
