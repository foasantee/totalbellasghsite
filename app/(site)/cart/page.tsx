"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items } = useCart();

  return (
    <section className="section" aria-labelledby="cart-heading">
      <div className="container">
        <div className="section__header">
          <span className="section__eyebrow">Your Bag</span>
          <h1 id="cart-heading">Cart</h1>
        </div>

        <CartSummary />

        {items.length > 0 ? (
          <Link href="/checkout" className="btn btn-primary">
            Proceed to Checkout
          </Link>
        ) : (
          <Link href="/products/clothing" className="btn btn-secondary">
            Continue Shopping
          </Link>
        )}
      </div>
    </section>
  );
}
