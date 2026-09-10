"use server";

import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { sendContactMessage } from "@/lib/email";

export type ContactFormState = { error?: string; success?: boolean };

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check the form for errors." };
  }

  const data = parsed.data;

  const contactMessage = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    },
  });

  try {
    await sendContactMessage(contactMessage);
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
  }

  return { success: true };
}
