import { NextResponse } from "next/server";
import { validateBookRequest } from "@/lib/atlantico/bookRequest";
import { confirmAtlanticoBooking } from "@/lib/atlantico/client";
import {
  getAtlanticoConfig,
  isAtlanticoBookingConfigured,
} from "@/lib/atlantico/config";
import { atlanticoErrorResponse } from "../errorResponse";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAtlanticoBookingConfigured()) {
    return NextResponse.json(
      {
        error:
          "Atlantico booking is not configured. Set ATLANTICO_USER_ID.",
        code: "not_configured",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = validateBookRequest(
    body && typeof body === "object" ? (body as Record<string, unknown>) : {}
  );
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { userId } = getAtlanticoConfig();

  try {
    const result = await confirmAtlanticoBooking({
      ...parsed.value,
      userId,
    });
    return NextResponse.json(result);
  } catch (error) {
    return atlanticoErrorResponse(error);
  }
}
