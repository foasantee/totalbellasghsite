import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategory, toCardData } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  CATEGORY_LABELS,
  SLUG_TO_CATEGORY,
  CLOTHING_SUBCATEGORY_ORDER,
  SUBCATEGORY_LABELS,
  SUBCATEGORY_SLUGS,
  SLUG_TO_SUBCATEGORY,
} from "@/lib/site-config";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = SLUG_TO_CATEGORY[categorySlug];
  if (!category) return {};
  return { title: CATEGORY_LABELS[category] };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params;
  const { sub } = await searchParams;
  const category = SLUG_TO_CATEGORY[categorySlug];
  if (!category) notFound();

  const subcategory = category === "CLOTHING" && sub ? SLUG_TO_SUBCATEGORY[sub] : undefined;
  const products = await getProductsByCategory(category, undefined, subcategory);

  return (
    <section className="section" aria-labelledby="category-heading">
      <div className="container">
        <div className="section__header">
          <span className="section__eyebrow">Category</span>
          <h1 id="category-heading" className={category === "SALES" ? "text-hot-coral" : undefined}>
            {CATEGORY_LABELS[category]}
          </h1>
        </div>

        {category === "CLOTHING" ? (
          <div className="subcategory-filter">
            <Link
              href="/products/clothing"
              className={`subcategory-filter__pill${!subcategory ? " subcategory-filter__pill--active" : ""}`}
            >
              All
            </Link>
            {CLOTHING_SUBCATEGORY_ORDER.map((sc) => (
              <Link
                key={sc}
                href={`/products/clothing?sub=${SUBCATEGORY_SLUGS[sc]}`}
                className={`subcategory-filter__pill${subcategory === sc ? " subcategory-filter__pill--active" : ""}`}
              >
                {SUBCATEGORY_LABELS[sc]}
              </Link>
            ))}
          </div>
        ) : null}

        {products.length > 0 ? (
          <ProductGrid products={products.map(toCardData)} single={products.length === 1} />
        ) : (
          <p>No products in this category yet — check back soon.</p>
        )}
      </div>
    </section>
  );
}
