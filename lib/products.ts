import { prisma } from "@/lib/db";
import type { Category, ClothingSubcategory, Product, ProductImage, ProductSize } from "@prisma/client";
import type { ProductCardData } from "@/components/product/ProductCard";

type ProductWithImages = Product & { images: ProductImage[]; sizes: ProductSize[] };

export function toCardData(product: ProductWithImages): ProductCardData {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price.toString(),
    category: product.category,
    badge: product.badge,
    // A card thumbnail is rendered with next/image, which can't play a
    // video — always prefer an actual photo, even if a video is first.
    imageUrl: product.images.find((image) => image.type === "IMAGE")?.url ?? null,
  };
}

export async function getProductsByCategory(
  category: Category,
  limit?: number,
  subcategory?: ClothingSubcategory
): Promise<ProductWithImages[]> {
  return prisma.product.findMany({
    where: { category, ...(subcategory ? { subcategory } : {}) },
    include: { images: { orderBy: { position: "asc" } }, sizes: true },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
}

export async function getProductBySlug(
  category: Category,
  slug: string
): Promise<ProductWithImages | null> {
  return prisma.product.findFirst({
    where: { category, slug },
    include: { images: { orderBy: { position: "asc" } }, sizes: true },
  });
}

export async function getAllProductsForAdmin(): Promise<ProductWithImages[]> {
  return prisma.product.findMany({
    include: { images: { orderBy: { position: "asc" } }, sizes: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductByIdForAdmin(id: string): Promise<ProductWithImages | null> {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, sizes: true },
  });
}
