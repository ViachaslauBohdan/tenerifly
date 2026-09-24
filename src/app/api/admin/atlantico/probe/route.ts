import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { probeAtlanticoTestBooking } from "@/lib/atlantico/adminProbe";
import { ADMIN_COOKIE, isAdminSession } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

export async function POST() {
  const jar = await cookies();
  if (!isAdminSession(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await probeAtlanticoTestBooking();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Probe failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
