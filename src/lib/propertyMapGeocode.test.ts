import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  geocodePropertyLocation,
  resetPropertyMapGeocodeCache,
} from "./propertyMapGeocode";

function nominatimResponse(
  hits: { lat: string; lon: string; type?: string }[]
) {
  return {
    ok: true,
    json: async () => hits,
  } as Response;
}

describe("geocodePropertyLocation", () => {
  beforeEach(() => {
    resetPropertyMapGeocodeCache();
  });

  it("uses a known town center without calling the geocoder", async () => {
    const fetchImpl = vi.fn();
    const point = await geocodePropertyLocation(
      { city: "Costa Adeje", region: "Tenerife", address: "" },
      { fetchImpl, minIntervalMs: 0 }
    );

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(point).toMatchObject({
      lat: 28.08698,
      lng: -16.7358,
      precision: "city",
      label: "Costa Adeje",
      radiusMeters: 700,
    });
  });

  it("geocodes a street and keeps the result on the island", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      nominatimResponse([
        { lat: "28.02797", lon: "-17.19782", type: "village" },
        { lat: "28.23910", lon: "-16.84120", type: "house" },
      ])
    );

    const point = await geocodePropertyLocation(
      {
        address: "Calle Caleta del Jurado, 12",
        city: "Puerto de Santiago",
        region: "Tenerife",
      },
      { fetchImpl, minIntervalMs: 0 }
    );

    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(point).toMatchObject({
      lat: 28.2391,
      lng: -16.8412,
      precision: "address",
      label: "Calle Caleta del Jurado",
      radiusMeters: 0,
    });
  });

  it("falls back to the town when the street cannot be placed", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(nominatimResponse([]));
    const point = await geocodePropertyLocation(
      {
        address: "Calle Venezuela (Ponderosa complex)",
        city: "Costa Adeje",
        region: "Tenerife",
      },
      { fetchImpl, minIntervalMs: 0 }
    );

    expect(point).toMatchObject({
      precision: "city",
      label: "Costa Adeje",
      lat: 28.08698,
      lng: -16.7358,
    });
  });

  it("prefers coordinates already stored for the apartment", async () => {
    const fetchImpl = vi.fn();
    const point = await geocodePropertyLocation(
      {
        address: "Calle Venezuela",
        city: "Costa Adeje",
        latitude: 28.09,
        longitude: -16.74,
      },
      { fetchImpl, minIntervalMs: 0 }
    );

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(point).toMatchObject({
      lat: 28.09,
      lng: -16.74,
      precision: "address",
    });
  });
});
