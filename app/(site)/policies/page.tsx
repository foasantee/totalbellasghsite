import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "Total Bellas GH policies — disclaimer, delivery terms, payment terms, and exchanges & refunds.",
};

export default function PoliciesPage() {
  return (
    <section className="section" aria-labelledby="policies-heading">
      <div className="container">
        <div className="section__header">
          <span className="section__eyebrow">Customer Service</span>
          <h1 id="policies-heading">Policies</h1>
          <p className="section__lede">
            Our disclaimer, delivery terms, payment terms, and exchange &amp; refund policy.
          </p>
        </div>

        <article className="conduct-body">
          <section id="disclaimer" className="conduct-block">
            <h2>Disclaimer</h2>
            <p>
              We are not affiliated with or endorsed by any featured brand (Zara, River Island,
              ASOS, Next, Aldo, etc.). All trademarks and images belong to their respective owners.
              Items are sourced independently.
            </p>
          </section>

          <section id="delivery" className="conduct-block">
            <h2>Delivery Terms</h2>
            <p>
              Our business operates exclusively on a delivery-only basis, with no option for
              customer pickups. All orders are processed, packaged, and dispatched through our
              approved third-party fulfilment partner, Kudya Logistics. This independent partner
              manages all warehousing, packaging, and delivery services on our behalf.
            </p>
            <p>
              Estimated delivery times are within 48 hours, excluding weekends and holidays, but
              may vary based on location, courier availability, and other external factors.
              Delivery fees are determined by our fulfilment partner and depend on the delivery
              location and order size.
            </p>
          </section>

          <section id="payment" className="conduct-block">
            <h2>Payment Terms</h2>
            <p>
              Orders are only confirmed once payment has been received and verified. Product
              availability may change at any time, so payment must be made immediately to secure
              an item. If payment is delayed, availability must be reconfirmed before proceeding.
            </p>
            <p>
              We do not offer cash on delivery or credit purchases. Payments can be made via
              mobile money (MTN) or bank transfer.
            </p>
          </section>

          <section id="exchanges" className="conduct-block">
            <h2>Exchanges &amp; Refunds</h2>
            <p>
              We accept exchanges within 24 hours of delivery if the item is unused, unworn, and
              has all tags or seals intact. For exchanges requested by the customer (such as
              changing size or product), all delivery and return shipping costs are the customer&apos;s
              responsibility.
            </p>
            <p>
              If an exchange is needed due to our error — like sending the wrong item, size, or a
              defective product — we will cover all related delivery costs. Refunds are only
              issued if we cannot fulfil an order due to product unavailability after payment.
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}
