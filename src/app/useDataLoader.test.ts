import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDataLoader } from "./useDataLoader";

function jsonOk(data: unknown) {
  return {
    ok: true,
    json: async () => ({ data }),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useDataLoader property locale overlay", () => {
  it("overlays PL titles from the full catalog onto the EN home preview", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/cars?")) return jsonOk([]);
      if (url.includes("/blog-posts?")) return jsonOk([]);
      if (url.includes("/transfers?")) return jsonOk([]);
      if (
        url.includes("/properties?") &&
        url.includes("locale=en") &&
        url.includes("pageSize]=6")
      ) {
        return jsonOk([
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
        url.includes("pageSize]=1000")
      ) {
        return jsonOk([
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
      return jsonOk([]);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDataLoader(true, "pl"));

    await waitFor(() => {
      expect(result.current.dataLoading).toBe(false);
    });

    expect(result.current.accommodation[0]).toMatchObject({
      documentId: "feat",
      title: "Apartament z widokiem Los Gigantes",
      description: "Polski opis",
    });
    expect(
      fetchMock.mock.calls.some(
        ([u]) =>
          String(u).includes("/properties?") &&
          String(u).includes("locale=pl") &&
          String(u).includes("pageSize]=1000")
      )
    ).toBe(true);
  });

  it("requests Strapi uk when the URL locale is ua", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/cars?")) return jsonOk([]);
      if (url.includes("/blog-posts?")) return jsonOk([]);
      if (url.includes("/transfers?")) return jsonOk([]);
      if (url.includes("/properties?") && url.includes("locale=en")) {
        return jsonOk([
          {
            documentId: "a",
            title: "Apt A EN",
            description: "EN A",
            locale: "en",
            price: { amount: 70, currency: "EUR", period: "day" },
            location: { city: "Adeje" },
          },
        ]);
      }
      if (url.includes("/properties?") && url.includes("locale=uk")) {
        return jsonOk([
          {
            documentId: "a",
            title: "Квартира A",
            description: "UA A",
            locale: "uk",
          },
        ]);
      }
      return jsonOk([]);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDataLoader(true, "ua"));

    await waitFor(() => {
      expect(result.current.dataLoading).toBe(false);
    });

    expect(result.current.accommodation[0].title).toBe("Квартира A");
    expect(
      fetchMock.mock.calls.some(
        ([u]) =>
          String(u).includes("/properties?") && String(u).includes("locale=uk")
      )
    ).toBe(true);
    expect(
      fetchMock.mock.calls.some(
        ([u]) =>
          String(u).includes("/properties?") && String(u).includes("locale=ua")
      )
    ).toBe(false);
  });

  it("requests Strapi uk for transfers when the URL locale is ua", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/cars?")) return jsonOk([]);
      if (url.includes("/blog-posts?")) return jsonOk([]);
      if (url.includes("/properties?")) return jsonOk([]);
      if (url.includes("/transfers?") && url.includes("locale=uk")) {
        return jsonOk([
          {
            documentId: "sprinter-8",
            title: "Mercedes Sprinter 8 місць",
            description: "Приватний трансфер з аеропорту",
            locale: "uk",
            seats: 8,
            price_south_airport: 50,
            price_north_airport: 100,
            currency: "EUR",
          },
        ]);
      }
      return jsonOk([]);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDataLoader(true, "ua"));

    await waitFor(() => {
      expect(result.current.dataLoading).toBe(false);
    });

    expect(result.current.transfers[0].title).toBe(
      "Mercedes Sprinter 8 місць"
    );
    expect(
      fetchMock.mock.calls.some(
        ([u]) =>
          String(u).includes("/transfers?") && String(u).includes("locale=uk")
      )
    ).toBe(true);
    expect(
      fetchMock.mock.calls.some(
        ([u]) =>
          String(u).includes("/transfers?") && String(u).includes("locale=ua")
      )
    ).toBe(false);
  });

  it("loads Polish transfer titles when Strapi has a pl locale", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/cars?")) return jsonOk([]);
      if (url.includes("/blog-posts?")) return jsonOk([]);
      if (url.includes("/properties?")) return jsonOk([]);
      if (url.includes("/transfers?") && url.includes("locale=pl")) {
        return jsonOk([
          {
            documentId: "sprinter-8",
            title: "Mercedes Sprinter 8 miejsc",
            description: "Prywatny transfer z lotniska",
            locale: "pl",
            seats: 8,
            price_south_airport: 50,
            price_north_airport: 100,
            currency: "EUR",
          },
        ]);
      }
      return jsonOk([]);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDataLoader(true, "pl"));

    await waitFor(() => {
      expect(result.current.dataLoading).toBe(false);
    });

    expect(result.current.transfers[0]).toMatchObject({
      documentId: "sprinter-8",
      title: "Mercedes Sprinter 8 miejsc",
      description: "Prywatny transfer z lotniska",
    });
  });

  it("does not fetch when disabled", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() =>
      useDataLoader(true, "pl", { enabled: false })
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.dataLoading).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
