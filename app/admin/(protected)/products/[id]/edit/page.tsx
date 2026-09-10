import { notFound } from "next/navigation";
import { getProductByIdForAdmin } from "@/lib/products";
import { updateProduct } from "@/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductByIdForAdmin(id);
  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div>
      <div className="admin-page-header">
        <h1>Edit Product</h1>
        <DeleteProductButton productId={product.id} />
      </div>
      <ProductForm
        action={boundUpdate}
        initial={{
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          quantity: product.quantity,
          badge: product.badge,
          images: product.images.map((image) => image.url),
        }}
      />
    </div>
  );
}
