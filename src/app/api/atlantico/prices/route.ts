import { NextResponse } from "next/server";
import { getAtlanticoPrices } from "@/lib/atlantico/client";
import { isAtlanticoCatalogConfigured } from "@/lib/atlantico/config";
import { parseAtlanticoPrices } from "@/lib/atlantico/prices";
import { atlanticoErrorResponse } from "../errorResponse";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAtlanticoCatalogConfigured()) {
    return NextResponse.json(
      { error: "Atlantico API is not configured", code: "not_configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim() || "";
  const date = searchParams.get("date")?.trim() || "";
  const pProd = searchParams.get("pProd") || undefined;

  if (!code || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "code and date (YYYY-MM-DD) are required" },
      { status: 400 }
    );
  }

  try {
    const raw = await getAtlanticoPrices(code, date);
    return NextResponse.json({
      raw,
      prices: parseAtlanticoPrices(raw, pProd),
    });
  } catch (error) {
    return atlanticoErrorResponse(error);
  }
}
