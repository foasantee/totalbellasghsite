import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/site-config";
import type { Category } from "@prisma/client";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  category: Category;
  badge?: string | null;
  imageUrl: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const href = `/products/${CATEGORY_SLUGS[product.category]}/${product.slug}`;

  return (
    <article className="product-card">
      <Link href={href} className="product-card__link">
        <div className="product-card__image-wrap">
          {product.imageUrl ? (
            <Image
              className="product-card__image"
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 992px) 25vw, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw"
            />
          ) : null}
          {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}
        </div>
        <div className="product-card__body">
          <p className="product-card__category">{CATEGORY_LABELS[product.category]}</p>
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__price">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
