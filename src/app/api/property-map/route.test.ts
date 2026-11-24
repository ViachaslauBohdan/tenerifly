import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/propertyMapGeocode", () => ({
  geocodePropertyLocation: vi.fn(),
}));

import { geocodePropertyLocation } from "@/lib/propertyMapGeocode";
import { GET } from "./route";

describe("GET /api/property-map", () => {
  beforeEach(() => {
    vi.mocked(geocodePropertyLocation).mockReset();
  });

  it("returns a map point for a town", async () => {
    vi.mocked(geocodePropertyLocation).mockResolvedValue({
      lat: 28.08698,
      lng: -16.7358,
      zoom: 13,
      label: "Costa Adeje",
      precision: "city",
      radiusMeters: 700,
    });

    const response = await GET(
      new Request("http://localhost/api/property-map?city=Costa%20Adeje")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.point.label).toBe("Costa Adeje");
    expect(geocodePropertyLocation).toHaveBeenCalledWith({
      address: "",
      city: "Costa Adeje",
      region: "",
      postalCode: "",
      latitude: null,
      longitude: null,
    });
  });

  it("rejects an oversized query", async () => {
    const response = await GET(
      new Request(
        `http://localhost/api/property-map?address=${"a".repeat(301)}`
      )
    );

    expect(response.status).toBe(400);
    expect(geocodePropertyLocation).not.toHaveBeenCalled();
  });
});
