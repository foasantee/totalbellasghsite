import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <p className="admin-shell__brand">Total Bellas Admin</p>
        <nav className="admin-shell__nav" aria-label="Admin">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/products">Products</Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="link-button">
            Log Out
          </button>
        </form>
      </header>
      <main className="admin-shell__main">{children}</main>
    </div>
  );
}
