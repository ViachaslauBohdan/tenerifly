import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminSession } from "@/lib/adminSession";
import { createNewProperties } from "@/lib/propertyImportCreate";

export const dynamic = "force-dynamic";

function strapiToken(): string {
  return (
    process.env.STRAPI_API_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_STRAPI_API_TOKEN?.trim() ||
    ""
  );
}

function strapiUrl(): string {
  return (
    process.env.STRAPI_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_STRAPI_API_URL?.trim() ||
    "https://tenerifly-strapi-production.up.railway.app"
  );
}

export async function POST(request: Request) {
  const jar = await cookies();
  if (!isAdminSession(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }

  const token = strapiToken();
  if (!token) {
    return NextResponse.json({ error: "Strapi token is not configured" }, { status: 503 });
  }

  let json = "";
  try {
    const body = (await request.json()) as { json?: unknown };
    json = typeof body.json === "string" ? body.json : "";
  } catch {
    return NextResponse.json(
      {
        ok: false,
        issues: [{ index: -1, path: "", message: "Тело запроса не JSON" }],
        results: [],
      },
      { status: 400 }
    );
  }

  const outcome = await createNewProperties(json, {
    apiUrl: strapiUrl(),
    token,
  });
  return NextResponse.json(outcome, { status: outcome.ok ? 200 : 400 });
}
