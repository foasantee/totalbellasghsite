import { prisma } from "@/lib/db";
import type { Category, Product, ProductImage } from "@prisma/client";
import type { ProductCardData } from "@/components/product/ProductCard";

type ProductWithImages = Product & { images: ProductImage[] };

export function toCardData(product: ProductWithImages): ProductCardData {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price.toString(),
    category: product.category,
    badge: product.badge,
    imageUrl: product.images[0]?.url ?? null,
  };
}

export async function getProductsByCategory(
  category: Category,
  limit?: number
): Promise<ProductWithImages[]> {
  return prisma.product.findMany({
    where: { category },
    include: { images: { orderBy: { position: "asc" } } },
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
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function getAllProductsForAdmin(): Promise<ProductWithImages[]> {
  return prisma.product.findMany({
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductByIdForAdmin(id: string): Promise<ProductWithImages | null> {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
}
