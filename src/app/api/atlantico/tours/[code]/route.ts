import { NextResponse } from "next/server";
import { getAtlanticoTourDetails } from "@/lib/atlantico/client";
import { isAtlanticoCatalogConfigured } from "@/lib/atlantico/config";
import { atlanticoErrorResponse } from "../../errorResponse";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  if (!isAtlanticoCatalogConfigured()) {
    return NextResponse.json(
      { error: "Atlantico API is not configured", code: "not_configured" },
      { status: 503 }
    );
  }

  const { code } = await context.params;
  const locale = new URL(request.url).searchParams.get("locale") || "en";

  try {
    const tour = await getAtlanticoTourDetails(code, locale);
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }
    return NextResponse.json({ tour });
  } catch (error) {
    return atlanticoErrorResponse(error);
  }
}
