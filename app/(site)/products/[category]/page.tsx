import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategory, toCardData } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CATEGORY_LABELS, SLUG_TO_CATEGORY } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = SLUG_TO_CATEGORY[categorySlug];
  if (!category) return {};
  return { title: CATEGORY_LABELS[category] };
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = SLUG_TO_CATEGORY[categorySlug];
  if (!category) notFound();

  const products = await getProductsByCategory(category);

  return (
    <section className="section" aria-labelledby="category-heading">
      <div className="container">
        <div className="section__header">
          <span className="section__eyebrow">Category</span>
          <h1 id="category-heading">{CATEGORY_LABELS[category]}</h1>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products.map(toCardData)} single={products.length === 1} />
        ) : (
          <p>No products in this category yet — check back soon.</p>
        )}
      </div>
    </section>
  );
}
