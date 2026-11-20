import { NextResponse } from "next/server";
import { geocodePropertyLocation } from "@/lib/propertyMapGeocode";

const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address") ?? "";
  const city = url.searchParams.get("city") ?? "";
  const region = url.searchParams.get("region") ?? "";
  if ([address, city, region].some((value) => value.length > 300)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const latitude = url.searchParams.get("latitude");
  const longitude = url.searchParams.get("longitude");
  const point = await geocodePropertyLocation({
    address,
    city,
    region,
    latitude: latitude ? Number(latitude) : null,
    longitude: longitude ? Number(longitude) : null,
  });

  return NextResponse.json(
    { point },
    {
      headers: { "Cache-Control": CACHE_CONTROL },
    }
  );
}
