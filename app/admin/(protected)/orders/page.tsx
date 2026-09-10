import Link from "next/link";
import { prisma } from "@/lib/db";
import { OrderTable } from "@/components/admin/OrderTable";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED"];

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const activeStatus = STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;

  const orders = await prisma.order.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1>Orders</h1>

      <div className="admin-tabs">
        <Link href="/admin/orders" className={!activeStatus ? "is-active" : ""}>
          All
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={activeStatus === s ? "is-active" : ""}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <OrderTable orders={orders} />
    </div>
  );
}
