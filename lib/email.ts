import { Resend } from "resend";
import type { Order, OrderItem, ContactMessage } from "@prisma/client";
import { formatPrice } from "./format";

type OrderWithItems = Order & { items: OrderItem[] };

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getOwnerEmail(): string {
  return process.env.OWNER_NOTIFICATION_EMAIL || "shop@totalbellasgh.com";
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/**
 * Emails the business owner with the new order's details. Wrapped in
 * try/catch by every caller — a Resend outage must never block an order
 * from being placed.
 */
export async function sendOrderNotification(order: OrderWithItems): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping order notification email.");
    return;
  }

  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:4px 8px;">${item.productNameAtOrder}</td>
          <td style="padding:4px 8px;">${item.quantity}</td>
          <td style="padding:4px 8px;">${formatPrice(item.unitPriceAtOrder)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <h2>New order from ${order.customerName}</h2>
    <p><strong>Total: ${formatPrice(order.totalAtOrder)}</strong></p>
    <table style="border-collapse:collapse;">
      <thead><tr><th align="left">Item</th><th align="left">Qty</th><th align="left">Price</th></tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <p><strong>Customer contact</strong><br/>
      Phone: ${order.customerPhone || "—"}<br/>
      Email: ${order.customerEmail || "—"}<br/>
      Delivery address: ${order.deliveryAddress}<br/>
      Notes: ${order.notes || "—"}
    </p>
    <p><a href="${getSiteUrl()}/admin/orders/${order.id}">View this order in the admin panel</a></p>
  `;

  await resend.emails.send({
    from: "Total Bellas GH <orders@totalbellasgh.com>",
    to: getOwnerEmail(),
    subject: `New order from ${order.customerName} — ${formatPrice(order.totalAtOrder)}`,
    html,
  });
}

export async function sendContactMessage(message: ContactMessage): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping contact message email.");
    return;
  }

  await resend.emails.send({
    from: "Total Bellas GH <contact@totalbellasgh.com>",
    to: getOwnerEmail(),
    replyTo: message.email,
    subject: `New contact message from ${message.name}`,
    html: `
      <p><strong>From:</strong> ${message.name} (${message.email})</p>
      <p><strong>Phone:</strong> ${message.phone || "—"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.message.replace(/\n/g, "<br/>")}</p>
    `,
  });
}
