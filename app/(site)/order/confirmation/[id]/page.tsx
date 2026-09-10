import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const contactMethod = order.customerPhone || order.customerEmail || "the details you provided";

  return (
    <section className="section" aria-labelledby="confirmation-heading">
      <div className="container conduct-page">
        <div className="section__header">
          <span className="section__eyebrow">Order Received</span>
          <h1 id="confirmation-heading">Thank you, {order.customerName}!</h1>
          <p className="section__lede">
            Your order (#{order.id.slice(-8).toUpperCase()}) has been received. We&apos;ll contact you
            at {contactMethod} shortly to confirm details and arrange payment and delivery.
          </p>
        </div>

        <table className="cart-summary__table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.productNameAtOrder}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.unitPriceAtOrder)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="cart-summary__subtotal">
          Total: <strong>{formatPrice(order.totalAtOrder)}</strong>
        </p>
      </div>
    </section>
  );
}
