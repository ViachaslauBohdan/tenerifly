import { NextResponse } from "next/server";
import { availableIsoDates } from "@/lib/atlantico/availability";
import { getAtlanticoLimits } from "@/lib/atlantico/client";
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
  const code = searchParams.get("code")?.trim() || "";
  const locale = searchParams.get("locale") || "en";
  const date = searchParams.get("date")?.trim() || undefined;

  if (!code) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

  try {
    const limits = await getAtlanticoLimits(code, locale, date);
    return NextResponse.json({
      limits,
      dates: availableIsoDates(limits),
    });
  } catch (error) {
    return atlanticoErrorResponse(error);
  }
}
