import type { Category, ClothingSubcategory, Size } from "@prisma/client";

/**
 * Rarely-changing site chrome — business info, brand list. Not database
 * entities: editing these means a code change + redeploy, which is fine
 * for content that changes a few times a year at most.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SITE_CONTACT = {
  location: "Accra, Ghana",
  phoneDisplay: "+233 24 451 8651",
  phoneHref: "+233244518651",
  email: "shop@totalbellasgh.com",
  instagramHandle: "@total_bellas_gh_backup",
  instagramUrl: "https://instagram.com/total_bellas_gh_backup",
  instagramNote: "Backup account for @total_bellas_gh",
  whatsappUrl: "https://wa.me/233244518651",
  hours: "Mon – Sat, 9am – 6pm",
};

export const BRANDS_WE_CARRY = ["Zara", "River Island", "Asos", "Aldo", "Next", "Mango"];

export const BRANDS_DISCLAIMER =
  "We're not affiliated with the brands shown — Total Bellas GH is an independent seller of U.K. high street fashion.";

export const CATEGORY_LABELS: Record<Category, string> = {
  CLOTHING: "Clothing",
  SHOES: "Shoes & Footwear",
  BAGS: "Bags",
  FRAGRANCE: "Fragrance",
};

export const CATEGORY_SLUGS: Record<Category, string> = {
  CLOTHING: "clothing",
  SHOES: "shoes",
  BAGS: "bags",
  FRAGRANCE: "fragrance",
};

export const SLUG_TO_CATEGORY: Record<string, Category> = {
  clothing: "CLOTHING",
  shoes: "SHOES",
  bags: "BAGS",
  fragrance: "FRAGRANCE",
};

export const CATEGORY_ORDER: Category[] = ["CLOTHING", "SHOES", "BAGS", "FRAGRANCE"];

export const SIZE_LABELS: Record<Size, string> = {
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
  XXXL: "XXXL",
  SIZE_10: "10",
  SIZE_12: "12",
  SIZE_14: "14",
  SIZE_16: "16",
  SIZE_18: "18",
  SHOE_4_37: "4 / 37",
  SHOE_5_38: "5 / 38",
  SHOE_6_39: "6 / 39",
  SHOE_7_40: "7 / 40",
  SHOE_8_41: "8 / 41",
  SHOE_9_42: "9 / 42",
  SHOE_10_43: "10 / 43",
  SHOE_11_44: "11 / 44",
};

export const CLOTHING_SIZE_ORDER: Size[] = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "SIZE_10",
  "SIZE_12",
  "SIZE_14",
  "SIZE_16",
  "SIZE_18",
];

export const SHOE_SIZE_ORDER: Size[] = [
  "SHOE_4_37",
  "SHOE_5_38",
  "SHOE_6_39",
  "SHOE_7_40",
  "SHOE_8_41",
  "SHOE_9_42",
  "SHOE_10_43",
  "SHOE_11_44",
];

// All sizes usable by any category — for parsing form submissions without
// needing to know which category's grid was rendered.
export const ALL_SIZES: Size[] = [...CLOTHING_SIZE_ORDER, ...SHOE_SIZE_ORDER];

const SIZE_ORDER_BY_CATEGORY: Partial<Record<Category, Size[]>> = {
  CLOTHING: CLOTHING_SIZE_ORDER,
  SHOES: SHOE_SIZE_ORDER,
};

/** Sizes offered for a category's admin/storefront size picker — empty for categories that don't use sizes. */
export function sizesForCategory(category: Category): Size[] {
  return SIZE_ORDER_BY_CATEGORY[category] ?? [];
}

export const CLOTHING_SUBCATEGORY_ORDER: ClothingSubcategory[] = [
  "BLOUSE",
  "T_SHIRT",
  "SHIRT",
  "DRESS",
  "TROUSERS",
  "BLAZERS",
  "SKIRTS",
  "JUMPSUITS",
  "JEANS",
  "TWO_PIECE",
];

export const SUBCATEGORY_LABELS: Record<ClothingSubcategory, string> = {
  BLOUSE: "Blouse",
  T_SHIRT: "T-shirt",
  SHIRT: "Shirt",
  DRESS: "Dress",
  TROUSERS: "Trousers",
  BLAZERS: "Blazers",
  SKIRTS: "Skirts",
  JUMPSUITS: "Jumpsuits",
  JEANS: "Jeans",
  TWO_PIECE: "2-piece",
};

export const SUBCATEGORY_SLUGS: Record<ClothingSubcategory, string> = {
  BLOUSE: "blouse",
  T_SHIRT: "t-shirt",
  SHIRT: "shirt",
  DRESS: "dress",
  TROUSERS: "trousers",
  BLAZERS: "blazers",
  SKIRTS: "skirts",
  JUMPSUITS: "jumpsuits",
  JEANS: "jeans",
  TWO_PIECE: "2-piece",
};

export const SLUG_TO_SUBCATEGORY: Record<string, ClothingSubcategory> = Object.fromEntries(
  CLOTHING_SUBCATEGORY_ORDER.map((sub) => [SUBCATEGORY_SLUGS[sub], sub])
);
