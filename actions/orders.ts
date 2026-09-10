"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation";
import { toPesewas } from "@/lib/format";
import { processPayment } from "@/lib/payments/processPayment";
import { sendOrderNotification } from "@/lib/email";
import { CATEGORY_SLUGS } from "@/lib/site-config";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

class StockConflictError extends Error {
  constructor(public productName: string) {
    super(`Insufficient stock for ${productName}`);
  }
}

/**
 * Places an order WITHOUT collecting payment. Prices/stock are re-verified
 * server-side (the client's cart is never trusted). The order is created
 * first so a real orderId exists, then processPayment() is called — today
 * that's a synchronous no-op success; this is the exact seam a real
 * payment gateway plugs into later.
 */
export async function placeOrder(input: CheckoutInput): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Please check your details." };
  }
  const data = parsed.data;

  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });
  const productById = new Map(products.map((product) => [product.id, product]));

  for (const line of data.items) {
    const product = productById.get(line.productId);
    if (!product) {
      return { ok: false, error: "One of the items in your cart is no longer available." };
    }
    if (line.quantity > product.quantity) {
      return {
        ok: false,
        error: `Only ${product.quantity} of "${product.name}" left in stock. Please update your cart.`,
      };
    }
  }

  const orderItemsData = data.items.map((line) => {
    const product = productById.get(line.productId)!;
    return {
      productId: product.id,
      productNameAtOrder: product.name,
      productImageAtOrder: product.images[0]?.url ?? null,
      unitPriceAtOrder: product.price,
      quantity: line.quantity,
    };
  });

  const totalAtOrder = orderItemsData.reduce(
    (sum, item) => sum + Number(item.unitPriceAtOrder) * item.quantity,
    0
  );

  // Create the order and decrement stock atomically. The decrement is
  // conditional (quantity >= requested) so two concurrent orders for the
  // last item can't both succeed — the pre-check above is just a fast,
  // friendly error path; this transaction is what actually prevents
  // overselling under a race.
  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      for (const line of data.items) {
        const result = await tx.product.updateMany({
          where: { id: line.productId, quantity: { gte: line.quantity } },
          data: { quantity: { decrement: line.quantity } },
        });
        if (result.count === 0) {
          const product = productById.get(line.productId)!;
          throw new StockConflictError(product.name);
        }
      }

      return tx.order.create({
        data: {
          customerName: data.customerName,
          customerPhone: data.customerPhone || null,
          customerEmail: data.customerEmail || null,
          deliveryAddress: data.deliveryAddress,
          notes: data.notes || null,
          totalAtOrder,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });
    });
  } catch (err) {
    if (err instanceof StockConflictError) {
      return {
        ok: false,
        error: `Sorry, "${err.productName}" just sold out. Please update your cart.`,
      };
    }
    throw err;
  }

  // Payment insertion point — see lib/payments/processPayment.ts.
  const paymentResult = await processPayment({
    orderId: order.id,
    amount: toPesewas(totalAtOrder),
    currency: "GHS",
    customer: {
      name: data.customerName,
      email: data.customerEmail || undefined,
      phone: data.customerPhone || undefined,
    },
  });

  if (!paymentResult.success) {
    // Dead branch today (processPayment always succeeds) — kept intentionally
    // so a real gateway's failure path doesn't require restructuring this
    // flow. The order row is left in place (status PENDING/UNPAID) so the
    // owner can still follow up manually.
    return { ok: false, error: "We couldn't process your order. Please try again or contact us." };
  }

  try {
    await sendOrderNotification(order);
  } catch (err) {
    console.error("Failed to send order notification email:", err);
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/");
  const affectedCategories = new Set(products.map((p) => CATEGORY_SLUGS[p.category]));
  for (const slug of affectedCategories) {
    revalidatePath(`/products/${slug}`);
  }
  for (const product of products) {
    revalidatePath(`/products/${CATEGORY_SLUGS[product.category]}/${product.slug}`);
  }

  return { ok: true, orderId: order.id };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentStatus: PaymentStatus
): Promise<void> {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { status, paymentStatus },
  });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
