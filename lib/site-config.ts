import type { Category } from "@prisma/client";

/**
 * Rarely-changing site chrome — business info, brand list. Not database
 * entities: editing these means a code change + redeploy, which is fine
 * for content that changes a few times a year at most.
 */

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
