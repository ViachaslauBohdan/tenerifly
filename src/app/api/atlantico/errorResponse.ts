import { NextResponse } from "next/server";
import { AtlanticoApiError } from "@/lib/atlantico/client";

export function atlanticoErrorResponse(error: unknown) {
  if (error instanceof AtlanticoApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    );
  }
  const message =
    error instanceof Error ? error.message : "Atlantico request failed";
  return NextResponse.json({ error: message }, { status: 502 });
}
