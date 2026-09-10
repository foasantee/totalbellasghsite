import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <section className="section" aria-labelledby="checkout-heading">
      <div className="container conduct-page">
        <div className="section__header">
          <span className="section__eyebrow">Almost There</span>
          <h1 id="checkout-heading">Checkout</h1>
        </div>
        <CheckoutForm />
      </div>
    </section>
  );
}
