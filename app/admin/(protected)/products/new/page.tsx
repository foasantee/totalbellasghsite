import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/actions/products";

export default function NewProductPage() {
  return (
    <div>
      <h1>Add Product</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
