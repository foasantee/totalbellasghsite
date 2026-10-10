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

  const orderRef = order.id.slice(-8).toUpperCase();

  // Product images for the original seeded catalog are relative paths
  // (e.g. "/products/x.jpeg", served from this app's own /public folder) —
  // fine on the website itself, but meaningless in an email with no "current
  // site" to resolve against. Images uploaded via the admin panel (Spaces)
  // are already absolute and pass through unchanged.
  const toAbsoluteUrl = (url: string) => (url.startsWith("/") ? `${getSiteUrl()}${url}` : url);

  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:4px 8px;">
            ${
              item.productImageAtOrder
                ? `<img src="${toAbsoluteUrl(item.productImageAtOrder)}" alt="" width="48" height="60" style="object-fit:cover;border-radius:4px;vertical-align:middle;margin-right:8px;" />`
                : ""
            }
            <span style="vertical-align:middle;">${item.productNameAtOrder}</span>
          </td>
          <td style="padding:4px 8px;">${item.quantity}</td>
          <td style="padding:4px 8px;">${formatPrice(item.unitPriceAtOrder)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <h2>New order #${orderRef} from ${order.customerName}</h2>
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
    <p><a href="${getSiteUrl()}/admin/orders/${order.id}">View order #${orderRef} in the admin panel</a></p>
  `;

  const { error } = await resend.emails.send({
    from: "Total Bellas GH <shop@totalbellasgh.com>",
    to: getOwnerEmail(),
    subject: `New order #${orderRef} from ${order.customerName} — ${formatPrice(order.totalAtOrder)}`,
    html,
  });
  if (error) throw new Error(`Resend rejected order notification: ${error.message}`);
}

export async function sendContactMessage(message: ContactMessage): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping contact message email.");
    return;
  }

  const { error } = await resend.emails.send({
    from: "Total Bellas GH <shop@totalbellasgh.com>",
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
  if (error) throw new Error(`Resend rejected contact message: ${error.message}`);
}
