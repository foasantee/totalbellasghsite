import Image from "next/image";
import Link from "next/link";
import { getAllProductsForAdmin } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/site-config";
import { StockBadge } from "@/components/product/StockBadge";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add Product
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th aria-label="Image" />
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Stock</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {product.images[0] ? (
                  <div className="admin-table__thumb">
                    <Image src={product.images[0].url} alt="" fill sizes="48px" />
                  </div>
                ) : null}
              </td>
              <td>{product.name}</td>
              <td>{CATEGORY_LABELS[product.category]}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.quantity}</td>
              <td>
                <StockBadge quantity={product.quantity} />
              </td>
              <td>
                <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
