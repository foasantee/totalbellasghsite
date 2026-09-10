"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { CartSummary } from "@/components/cart/CartSummary";
import { placeOrder } from "@/actions/orders";

export function CheckoutForm() {
  const { items, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const result = await placeOrder({
      customerName: String(form.get("customerName") || ""),
      customerEmail: String(form.get("customerEmail") || ""),
      customerPhone: String(form.get("customerPhone") || ""),
      deliveryAddress: String(form.get("deliveryAddress") || ""),
      notes: String(form.get("notes") || ""),
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    clear();
    router.push(`/order/confirmation/${result.orderId}`);
  }

  if (items.length === 0) {
    return <p>Your cart is empty — add something before checking out.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="checkout__section-title">Order Summary</h2>
      <CartSummary editable={false} />

      <h2 className="checkout__section-title">Your Details</h2>

      <div className="form-field">
        <label htmlFor="customerName">
          Full Name <span className="required" aria-hidden="true">*</span>
        </label>
        <input type="text" id="customerName" name="customerName" required autoComplete="name" />
      </div>

      <div className="form-field">
        <label htmlFor="customerPhone">Phone</label>
        <input type="tel" id="customerPhone" name="customerPhone" placeholder="024 123 4567" autoComplete="tel" />
      </div>

      <div className="form-field">
        <label htmlFor="customerEmail">Email</label>
        <input type="email" id="customerEmail" name="customerEmail" autoComplete="email" />
      </div>

      <p className="form-field__hint">Please provide at least a phone number or an email address.</p>

      <div className="form-field">
        <label htmlFor="deliveryAddress">
          Delivery Address <span className="required" aria-hidden="true">*</span>
        </label>
        <textarea id="deliveryAddress" name="deliveryAddress" rows={3} required />
      </div>

      <div className="form-field">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea id="notes" name="notes" rows={2} />
      </div>

      {error ? (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Placing Order…" : "Place Order"}
      </button>
      <p className="checkout__payment-note">
        No payment is collected here — we&apos;ll contact you to arrange payment and delivery.
      </p>
    </form>
  );
}
