import type { Prisma } from "@prisma/client";

/**
 * Formats a price as Ghanaian Cedi, e.g. "₵350.00" / "₵1,200.00".
 * Deliberately hand-formatted (symbol, comma thousands separator, two
 * decimals) rather than Intl.NumberFormat("en-GH", {currency:"GHS"}), which
 * renders inconsistently across browsers/locales (often "GH₵" not "₵").
 */
export function formatPrice(value: Prisma.Decimal | number | string): string {
  const num = typeof value === "number" ? value : Number(value);
  return `₵${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Converts a GHS decimal amount to integer pesewas (avoids float drift). */
export function toPesewas(value: Prisma.Decimal | number | string): number {
  const num = typeof value === "number" ? value : Number(value);
  return Math.round(num * 100);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
