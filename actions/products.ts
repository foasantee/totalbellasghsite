"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productFormSchema } from "@/lib/validation";
import { slugify } from "@/lib/format";
import { CATEGORY_SLUGS } from "@/lib/site-config";
import type { Category } from "@prisma/client";

export type ProductFormState = { error?: string; fieldErrors?: Record<string, string> };

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "product";
  let candidate = base;
  let suffix = 1;
  // Small catalog — a simple loop is more than fast enough here.
  while (
    await prisma.product.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}

function parseImages(formData: FormData): string[] {
  return formData
    .getAll("images")
    .map((value) => String(value))
    .filter(Boolean);
}

function revalidateCatalog(category: Category) {
  revalidatePath("/");
  revalidatePath(`/products/${CATEGORY_SLUGS[category]}`);
  revalidatePath("/admin/products");
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = productFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    quantity: formData.get("quantity"),
    badge: formData.get("badge"),
    images: parseImages(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check the form for errors." };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description || "",
      price: data.price,
      category: data.category,
      quantity: data.quantity,
      badge: data.badge || null,
      images: {
        create: data.images.map((url, position) => ({ url, position })),
      },
    },
  });

  revalidateCatalog(product.category);
  redirect("/admin/products");
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = productFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    quantity: formData.get("quantity"),
    badge: formData.get("badge"),
    images: parseImages(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check the form for errors." };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.name, productId);

  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId } }),
    prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug,
        description: data.description || "",
        price: data.price,
        category: data.category,
        quantity: data.quantity,
        badge: data.badge || null,
        images: {
          create: data.images.map((url, position) => ({ url, position })),
        },
      },
    }),
  ]);

  revalidateCatalog(data.category);
  redirect("/admin/products");
}

export async function deleteProduct(productId: string): Promise<void> {
  await requireAdmin();
  const product = await prisma.product.delete({ where: { id: productId } });
  revalidateCatalog(product.category);
}
