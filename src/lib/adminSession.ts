import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "atlantico_admin";

const TOKEN_LABEL = "atlantico-admin-v1";

export function adminPassword(): string {
  return process.env.ATLANTICO_ADMIN_PASSWORD?.trim() || "";
}

export function adminSessionToken(password = adminPassword()): string {
  return createHmac("sha256", password).update(TOKEN_LABEL).digest("hex");
}

export function passwordsMatch(submitted: string, expected: string): boolean {
  if (!submitted || !expected) return false;
  const left = Buffer.from(adminSessionToken(submitted));
  const right = Buffer.from(adminSessionToken(expected));
  return timingSafeEqual(left, right);
}

export function isAdminSession(cookieValue: string | undefined | null): boolean {
  const expected = adminPassword();
  if (!expected || !cookieValue) return false;
  const left = Buffer.from(cookieValue);
  const right = Buffer.from(adminSessionToken(expected));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
