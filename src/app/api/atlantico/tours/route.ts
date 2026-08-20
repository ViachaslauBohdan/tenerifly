import { NextResponse } from "next/server";
import { listAtlanticoTours } from "@/lib/atlantico/client";
import { isAtlanticoCatalogConfigured } from "@/lib/atlantico/config";
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
  const locale = searchParams.get("locale") || "en";
  const classification = searchParams.get("classification") || undefined;

  try {
    const tours = await listAtlanticoTours(locale, classification);
    return NextResponse.json({ tours });
  } catch (error) {
    return atlanticoErrorResponse(error);
  }
}
