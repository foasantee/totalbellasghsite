import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS, SLUG_TO_CATEGORY } from "@/lib/site-config";
import { StockBadge } from "@/components/product/StockBadge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string; slug: string }> };

async function loadProduct(categorySlug: string, slug: string) {
  const category = SLUG_TO_CATEGORY[categorySlug];
  if (!category) return null;
  return getProductBySlug(category, slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const product = await loadProduct(categorySlug, slug);
  if (!product) return {};
  return { title: product.name };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const product = await loadProduct(categorySlug, slug);
  if (!product) notFound();

  const primaryImage = product.images[0]?.url ?? null;

  return (
    <section className="section" aria-labelledby="product-heading">
      <div className="container product-detail">
        <div className="product-detail__gallery">
          <div className="product-detail__main-image">
            {primaryImage ? (
              <Image src={primaryImage} alt={product.name} fill sizes="(min-width: 992px) 50vw, 100vw" />
            ) : null}
          </div>
          {product.images.length > 1 ? (
            <div className="product-detail__thumbnails">
              {product.images.map((image) => (
                <div className="product-detail__thumbnail" key={image.id}>
                  <Image src={image.url} alt="" fill sizes="80px" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-detail__info">
          <p className="product-card__category">{CATEGORY_LABELS[product.category]}</p>
          <h1 id="product-heading">{product.name}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <StockBadge quantity={product.quantity} />
          {product.description ? (
            <p className="product-detail__description">{product.description}</p>
          ) : null}

          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            category={product.category}
            name={product.name}
            price={Number(product.price)}
            image={primaryImage}
            quantityAvailable={product.quantity}
          />
        </div>
      </div>
    </section>
  );
}
