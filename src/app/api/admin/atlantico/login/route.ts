import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminPassword,
  adminSessionToken,
  passwordsMatch,
} from "@/lib/adminSession";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const expected = adminPassword();
  if (!expected) {
    return NextResponse.json(
      { error: "Admin password is not configured" },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!passwordsMatch(password, expected)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminSessionToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
