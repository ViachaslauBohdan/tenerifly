import { NextResponse } from "next/server";
import { getAtlanticoEventDetails } from "@/lib/atlantico/client";
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
    const event = await getAtlanticoEventDetails(code, locale);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ event });
  } catch (error) {
    return atlanticoErrorResponse(error);
  }
}
