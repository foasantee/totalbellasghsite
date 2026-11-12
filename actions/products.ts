"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productFormSchema, productSizeInputSchema } from "@/lib/validation";
import { slugify } from "@/lib/format";
import { CATEGORY_SLUGS, ALL_SIZES } from "@/lib/site-config";
import type { Category } from "@prisma/client";
import type { z } from "zod";

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

// Each size has its own input, named `size_<SIZE>`. A blank input means
// that size isn't offered at all; "0" means offered but currently out of
// stock for that size — both are different from "field not present".
// Checked against every size value, not just the category's own list, since
// the form only renders the ones relevant to the selected category anyway.
function parseSizes(formData: FormData): z.infer<typeof productSizeInputSchema>[] {
  return ALL_SIZES.map((size) => ({ size, raw: formData.get(`size_${size}`) }))
    .filter((entry) => entry.raw !== null && String(entry.raw).trim() !== "")
    .map((entry) => ({ size: entry.size, quantity: Number(entry.raw) }));
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
    // Not every category's form renders this field (only CLOTHING does), so
    // it's often absent — FormData.get() then returns null, not undefined,
    // which z.optional() doesn't accept; normalize to "" either way.
    subcategory: formData.get("subcategory") ?? "",
    quantity: formData.get("quantity"),
    badge: formData.get("badge"),
    images: parseImages(formData),
    sizes: parseSizes(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check the form for errors." };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.name);
  const usesSizes = data.sizes.length > 0;

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description || "",
      price: data.price,
      category: data.category,
      // Subcategory only means anything for CLOTHING — discard it otherwise.
      subcategory: data.category === "CLOTHING" ? data.subcategory || null : null,
      // When sizes are in use, the total is always their sum — never the
      // raw quantity field, which is ignored in that case.
      quantity: usesSizes
        ? data.sizes.reduce((sum, s) => sum + s.quantity, 0)
        : data.quantity,
      badge: data.badge || null,
      images: {
        create: data.images.map((url, position) => ({ url, position })),
      },
      sizes: {
        create: data.sizes,
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
    subcategory: formData.get("subcategory") ?? "",
    quantity: formData.get("quantity"),
    badge: formData.get("badge"),
    images: parseImages(formData),
    sizes: parseSizes(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check the form for errors." };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(data.name, productId);
  const usesSizes = data.sizes.length > 0;

  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId } }),
    prisma.productSize.deleteMany({ where: { productId } }),
    prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug,
        description: data.description || "",
        price: data.price,
        category: data.category,
        subcategory: data.category === "CLOTHING" ? data.subcategory || null : null,
        quantity: usesSizes
          ? data.sizes.reduce((sum, s) => sum + s.quantity, 0)
          : data.quantity,
        badge: data.badge || null,
        images: {
          create: data.images.map((url, position) => ({ url, position })),
        },
        sizes: {
          create: data.sizes,
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
