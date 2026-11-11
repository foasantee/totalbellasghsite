import { z } from "zod";

// Same email pattern the static site's js/form-validation.js used.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .regex(EMAIL_PATTERN, "Please enter a valid email address."),
  phone: z.string().trim().optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;

const SIZE_VALUES = [
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
] as const;

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  size: z.enum(SIZE_VALUES).optional(),
});

export const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(1, "Please enter your full name."),
    customerEmail: z
      .string()
      .trim()
      .regex(EMAIL_PATTERN, "Please enter a valid email address.")
      .optional()
      .or(z.literal("")),
    customerPhone: z.string().trim().optional().or(z.literal("")),
    deliveryAddress: z.string().trim().min(1, "Please enter a delivery address."),
    notes: z.string().trim().optional().or(z.literal("")),
    items: z.array(checkoutItemSchema).min(1, "Your cart is empty."),
  })
  .refine((data) => Boolean(data.customerEmail) || Boolean(data.customerPhone), {
    message: "Please provide a phone number or an email address so we can reach you.",
    path: ["customerPhone"],
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productSizeInputSchema = z.object({
  size: z.enum(SIZE_VALUES),
  quantity: z.coerce.number().int().min(0, "Size quantity cannot be negative."),
});

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Product name is required."),
  description: z.string().trim().optional().or(z.literal("")),
  price: z.coerce.number().positive("Price must be greater than zero."),
  category: z.enum(["CLOTHING", "SHOES", "BAGS", "FRAGRANCE"]),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative."),
  badge: z.string().trim().optional().or(z.literal("")),
  images: z.array(z.string().url()).default([]),
  // Only meaningful for CLOTHING. Empty array = this product isn't using
  // per-size stock — the plain `quantity` field above stays authoritative.
  sizes: z.array(productSizeInputSchema).default([]),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
