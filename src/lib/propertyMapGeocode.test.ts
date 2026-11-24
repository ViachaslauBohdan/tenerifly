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

  it("uses the street hit when an earlier query misses", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      nominatimResponse([
        {
          lat: "28.0706661",
          lon: "-16.7293426",
          type: "residential",
        },
      ])
    );

    const point = await geocodePropertyLocation(
      {
        address: "Calle Venezuela, 605 (Ponderosa), San Eugenio Bajo",
        city: "Costa Adeje",
        region: "Tenerife",
        postalCode: "38670",
      },
      { fetchImpl, minIntervalMs: 0 }
    );

    expect(fetchImpl).toHaveBeenCalledOnce();
    const requestUrl = String(fetchImpl.mock.calls[0]?.[0]);
    expect(requestUrl).toContain(
      "q=Calle+Venezuela%2C+San+Eugenio+Bajo%2C+Tenerife"
    );
    expect(point).toMatchObject({
      lat: 28.0706661,
      lng: -16.7293426,
      precision: "address",
      label: "Calle Venezuela",
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
