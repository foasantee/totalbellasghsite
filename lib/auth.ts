import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "tb_admin_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set.");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Verifies the submitted password against ADMIN_PASSWORD and, if valid,
 * sets a signed session cookie. There are no user accounts — this is a
 * single shared admin password by design (one non-technical owner).
 */
export async function loginAdmin(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is not set.");
  }
  if (!safeEqual(password, adminPassword)) {
    return false;
  }

  const issuedAt = Date.now().toString();
  const value = `${issuedAt}.${sign(issuedAt)}`;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });

  return true;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isValidSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const [issuedAt, signature] = raw.split(".");
  if (!issuedAt || !signature) return false;
  if (!safeEqual(signature, sign(issuedAt))) return false;

  const age = Date.now() - Number(issuedAt);
  if (Number.isNaN(age) || age > SESSION_MAX_AGE_MS) return false;

  return true;
}

/** Call at the top of any admin server component/layout that must be protected. */
export async function requireAdmin(): Promise<void> {
  if (!(await isValidSession())) {
    redirect("/admin/login");
  }
}
