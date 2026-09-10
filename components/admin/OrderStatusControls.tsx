"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/orders";
import type { Order, OrderStatus, PaymentStatus } from "@prisma/client";

const ORDER_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED"];
const PAYMENT_STATUSES: PaymentStatus[] = ["UNPAID", "PAID", "REFUNDED"];

export function OrderStatusControls({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await updateOrderStatus(order.id, status, paymentStatus);
      setSaved(true);
    });
  }

  return (
    <div className="order-status-controls">
      <div className="form-field">
        <label htmlFor="order-status">Order Status</label>
        <select
          id="order-status"
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="payment-status">Payment Status</label>
        <select
          id="payment-status"
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <p className="form-field__hint">
          Marking this Paid does not charge the customer — record it here once you&apos;ve collected
          payment yourself (cash, mobile money, or bank transfer).
        </p>
      </div>

      <button type="button" className="btn btn-primary" onClick={handleSave} disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </button>
      {saved && !pending ? <span className="admin-chip">Saved</span> : null}
    </div>
  );
}
