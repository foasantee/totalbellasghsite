"use server";

import { redirect } from "next/navigation";
import { loginAdmin, logoutAdmin } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") || "");
  if (!password) {
    return { error: "Please enter the admin password." };
  }

  const ok = await loginAdmin(password);
  if (!ok) {
    return { error: "Incorrect password." };
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logoutAdmin();
  redirect("/admin/login");
}
