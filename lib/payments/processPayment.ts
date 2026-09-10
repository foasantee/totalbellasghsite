export type PaymentRequest = {
  orderId: string;
  /** Amount in pesewas (integer) — avoids float cent-drift. 100 pesewas = ₵1. */
  amount: number;
  currency: "GHS";
  customer: { name: string; email?: string; phone?: string };
};

export type PaymentResult =
  | { success: true; reference: string | null; provider: "none" }
  | { success: false; error: string };

/**
 * PLACEHOLDER — no real payment gateway is wired up yet. Payments are
 * collected manually (the business contacts the customer to arrange
 * payment/delivery after the order is placed).
 *
 * This always returns success synchronously. When a real gateway (e.g.
 * Paystack or Stripe) is ready to go live, swap ONLY the body of this
 * function — keep the signature stable so `actions/orders.ts` doesn't need
 * to change. If the real gateway needs an external redirect (e.g. to a
 * hosted checkout page) rather than a synchronous success/fail, that's the
 * one place call sites will need a small follow-up change.
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  void request;
  return { success: true, reference: null, provider: "none" };
}
