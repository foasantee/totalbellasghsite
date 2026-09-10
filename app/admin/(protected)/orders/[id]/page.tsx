import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { OrderStatusControls } from "@/components/admin/OrderStatusControls";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div>
      <h1>Order #{order.id.slice(-8).toUpperCase()}</h1>

      <section className="admin-order-block">
        <h2>Customer</h2>
        <p>{order.customerName}</p>
        <p>Phone: {order.customerPhone || "—"}</p>
        <p>Email: {order.customerEmail || "—"}</p>
        <p>Delivery address: {order.deliveryAddress}</p>
        <p>Notes: {order.notes || "—"}</p>
      </section>

      <section className="admin-order-block">
        <h2>Items</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.productNameAtOrder}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.unitPriceAtOrder)}</td>
                <td>{formatPrice(Number(item.unitPriceAtOrder) * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="cart-summary__subtotal">
          Total: <strong>{formatPrice(order.totalAtOrder)}</strong>
        </p>
      </section>

      <section className="admin-order-block">
        <h2>Status</h2>
        <OrderStatusControls order={order} />
      </section>
    </div>
  );
}
