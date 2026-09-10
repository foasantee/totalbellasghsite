import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Order } from "@prisma/client";

export function OrderTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p>No orders yet.</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Customer</th>
          <th>Contact</th>
          <th>Total</th>
          <th>Status</th>
          <th>Payment</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            className={order.status === "PENDING" ? "admin-table__row--pending" : ""}
          >
            <td>{order.createdAt.toLocaleDateString()}</td>
            <td>
              <Link href={`/admin/orders/${order.id}`}>{order.customerName}</Link>
              {order.status === "PENDING" ? <span className="admin-chip">New</span> : null}
            </td>
            <td>{order.customerPhone || order.customerEmail || "—"}</td>
            <td>{formatPrice(order.totalAtOrder)}</td>
            <td>{order.status}</td>
            <td>{order.paymentStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
