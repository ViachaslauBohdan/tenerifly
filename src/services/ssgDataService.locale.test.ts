import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("ssgDataService locale fetch", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("getCarById requests Strapi uk for URL locale ua", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/cars/car-ua-1?") && url.includes("locale=uk")) {
        return jsonResponse({
          documentId: "car-ua-1",
          title: "BMW",
          description: "Український опис авто",
          locale: "uk",
        });
      }
      return jsonResponse(null, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getCarById } = await import("./ssgDataService");
    const car = await getCarById("car-ua-1", "ua");

    expect(car?.description).toBe("Український опис авто");
    expect(car?.locale).toBe("uk");
    expect(fetchMock.mock.calls.some(([u]) => String(u).includes("locale=uk"))).toBe(
      true
    );
    expect(
      fetchMock.mock.calls.some(([u]) => String(u).includes("locale=en"))
    ).toBe(false);
  });

  it("getCarById falls back to EN when uk localization is missing", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/cars/car-missing-uk?") && url.includes("locale=uk")) {
        return jsonResponse(null, 404);
      }
      if (url.includes("/cars/car-missing-uk?") && url.includes("locale=en")) {
        return jsonResponse({
          documentId: "car-missing-uk",
          title: "BMW EN",
          description: "English description",
          locale: "en",
        });
      }
      return jsonResponse(null, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getCarById } = await import("./ssgDataService");
    const car = await getCarById("car-missing-uk", "ua");

    expect(car?.description).toBe("English description");
    expect(car?.title).toBe("BMW EN");
  });

  it("getCarById fills empty uk description from EN", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/cars/car-empty-desc?") && url.includes("locale=uk")) {
        return jsonResponse({
          documentId: "car-empty-desc",
          title: "BMW",
          description: "  ",
          locale: "uk",
        });
      }
      if (url.includes("/cars/car-empty-desc?") && url.includes("locale=en")) {
        return jsonResponse({
          documentId: "car-empty-desc",
          title: "BMW",
          description: "English fallback body",
          locale: "en",
        });
      }
      return jsonResponse(null, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getCarById } = await import("./ssgDataService");
    const car = await getCarById("car-empty-desc", "ua");

    expect(car?.description).toBe("English fallback body");
    expect(car?.locale).toBe("uk");
  });

  it("getPropertyById falls back to EN when property has no uk locale", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (
        url.includes("/properties/prop-no-uk?") &&
        url.includes("locale=uk")
      ) {
        return jsonResponse(null, 404);
      }
      if (
        url.includes("/properties/prop-no-uk?") &&
        url.includes("locale=en")
      ) {
        return jsonResponse({
          documentId: "prop-no-uk",
          title: "Sunny Duplex",
          description: "English apartment description",
          locale: "en",
        });
      }
      return jsonResponse(null, 404);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getPropertyById } = await import("./ssgDataService");
    const property = await getPropertyById("prop-no-uk", "ua");

    expect(property?.title).toBe("Sunny Duplex");
    expect(property?.description).toBe("English apartment description");
  });

  it("getAllProperties keeps EN catalog size when ru has only a stub", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/properties?") && url.includes("locale=en")) {
        return jsonResponse([
          {
            documentId: "a",
            title: "Apt A",
            description: "EN A",
            locale: "en",
          },
          {
            documentId: "b",
            title: "Apt B",
            description: "EN B",
            locale: "en",
          },
        ]);
      }
      if (url.includes("/properties?") && url.includes("locale=ru")) {
        return jsonResponse([
          {
            documentId: "a",
            title: "Квартира A",
            description: "RU A",
            locale: "ru",
          },
        ]);
      }
      return jsonResponse([]);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getAllProperties } = await import("./ssgDataService");
    const properties = await getAllProperties("ru");

    expect(properties).toHaveLength(2);
    expect(properties[0]).toMatchObject({
      documentId: "a",
      title: "Квартира A",
      description: "RU A",
    });
    expect(properties[1]).toMatchObject({
      documentId: "b",
      title: "Apt B",
      description: "EN B",
    });
  });

  it("getHomePageData overlays PL title from full catalog onto EN home preview", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/cars?")) return jsonResponse([]);
      if (url.includes("/blog-posts?")) return jsonResponse([]);
      if (url.includes("/transfers?")) return jsonResponse([]);
      if (
        url.includes("/properties?") &&
        url.includes("locale=en") &&
        url.includes("pageSize]=6")
      ) {
        return jsonResponse([
          {
            documentId: "feat",
            title: "Fantastic View Los Gigantes Apartment",
            description: "English preview",
            locale: "en",
            price: { amount: 70, currency: "EUR", period: "day" },
            location: { city: "Los Gigantes" },
          },
        ]);
      }
      if (
        url.includes("/properties?") &&
        url.includes("locale=pl") &&
        url.includes("pageSize]=6")
      ) {
        return jsonResponse([
          {
            documentId: "other",
            title: "Inny apartament",
            description: "PL other",
            locale: "pl",
          },
        ]);
      }
      if (url.includes("/properties?") && url.includes("locale=pl")) {
        return jsonResponse([
          {
            documentId: "other",
            title: "Inny apartament",
            description: "PL other",
            locale: "pl",
          },
          {
            documentId: "feat",
            title: "Apartament z widokiem Los Gigantes",
            description: "Polski opis",
            locale: "pl",
          },
        ]);
      }
      return jsonResponse([]);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getHomePageData } = await import("./ssgDataService");
    const data = await getHomePageData("pl");

    expect(data.properties[0].title).toBe(
      "Apartament z widokiem Los Gigantes"
    );
    expect(data.properties[0].description).toBe("Polski opis");
  });
});
