import Link from "next/link";
import { prisma } from "@/lib/db";
import { OrderTable } from "@/components/admin/OrderTable";

export default async function AdminDashboardPage() {
  const [recentOrders, pendingCount, outOfStockCount] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { quantity: 0 } }),
  ]);

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat__value">{pendingCount}</p>
          <p className="admin-stat__label">Pending orders</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__value">{outOfStockCount}</p>
          <p className="admin-stat__label">Out of stock products</p>
        </div>
      </div>

      <h2>Recent Orders</h2>
      <OrderTable orders={recentOrders} />
      <p>
        <Link href="/admin/orders">View all orders →</Link>
      </p>
    </div>
  );
}
