import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL, CATEGORY_ORDER, CATEGORY_SLUGS } from "@/lib/site-config";

// Queries the database for product URLs — generate on request rather than
// at build time, consistent with the rest of the app, so a build never
// depends on database connectivity.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/policies`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/social-code-of-conduct`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORY_ORDER.map((category) => ({
    url: `${SITE_URL}/products/${CATEGORY_SLUGS[category]}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const products = await prisma.product.findMany({
    select: { slug: true, category: true, updatedAt: true },
  });

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${CATEGORY_SLUGS[product.category]}/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
