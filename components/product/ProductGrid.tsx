import { ProductCard, type ProductCardData } from "./ProductCard";

export function ProductGrid({
  products,
  single = false,
}: {
  products: ProductCardData[];
  single?: boolean;
}) {
  return (
    <div className={`product-grid${single ? " product-grid--single" : ""}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
