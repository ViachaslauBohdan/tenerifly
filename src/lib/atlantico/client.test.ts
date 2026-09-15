import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AtlanticoConfirmRequest } from "./types";

const REAL_SUPPLIER_HOST = /atlanticoexcursiones\.com/i;

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "application/json" },
    text: async () => JSON.stringify(body),
  };
}

const confirmPayload: AtlanticoConfirmRequest = {
  userId: "3726",
  t_id: "184",
  t_group: "12",
  language: "ENG",
  tourDate: "2026-08-22",
  sesTime: "09:30",
  adults: 2,
  childs: 0,
  infants: 0,
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+34600111222",
};

describe("Atlantico client (mocked network)", () => {
  beforeEach(() => {
    vi.stubEnv("ATLANTICO_API_BASE_URL", "https://atlantico.test.invalid");
    vi.stubEnv("ATLANTICO_API_TOKEN", "");
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("parses a confirm JSON body", async () => {
    const { parseConfirmResponse } = await import("./client");
    expect(parseConfirmResponse({ bookingCode: "AE-123", message: "ok" })).toEqual(
      {
        bookingCode: "AE-123",
        message: "ok",
      }
    );
  });

  it("rejects placeholder confirm values 0 and 1", async () => {
    const { parseConfirmResponse } = await import("./client");
    expect(() => parseConfirmResponse("0")).toThrow(/booking code/i);
    expect(() => parseConfirmResponse("1")).toThrow(/booking code/i);
  });

  it("posts /confirm/ only to the mocked fetch, never a live supplier host", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = String(input);
      expect(url).not.toMatch(REAL_SUPPLIER_HOST);
      expect(url).toBe("https://atlantico.test.invalid/confirm/");
      return jsonResponse({ bookingCode: "TEST-NO-LIVE-BOOKING" });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { confirmAtlanticoBooking } = await import("./client");
    const result = await confirmAtlanticoBooking(confirmPayload);

    expect(result).toEqual({
      bookingCode: "TEST-NO-LIVE-BOOKING",
      message: undefined,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [RequestInfo, RequestInit];
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toMatchObject({
      userId: "3726",
      t_id: "184",
      email: "ada@example.com",
    });
  });

  it("posts /payment/ with redirect:manual and returns the gateway Location", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      const url = String(input);
      expect(url).not.toMatch(REAL_SUPPLIER_HOST);
      expect(url).toBe("https://atlantico.test.invalid/payment/");
      expect(init?.redirect).toBe("manual");
      return {
        ok: false,
        status: 302,
        headers: {
          get: (name: string) =>
            name.toLowerCase() === "location"
              ? "https://pay.example/checkout/abc"
              : null,
        },
        text: async () => "",
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    const { startAtlanticoPayment } = await import("./client");
    const result = await startAtlanticoPayment(confirmPayload);

    expect(result).toEqual({ paymentUrl: "https://pay.example/checkout/abc" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("unwraps JSON-encoded loadPrices strings and skips empty office responses", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = String(input);
      expect(url).not.toMatch(REAL_SUPPLIER_HOST);
      if (url.endsWith("/loadPrices/20/2026-10-15")) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => "text/html; charset=UTF-8" },
          text: async () => '"42.00|30.00|0.00|6.30|4.50|0.00"',
        };
      }
      if (url.includes("/loadPrices/20/2026-10-15/3726")) {
        return jsonResponse([]);
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("ATLANTICO_COLLABORATOR", "3726");

    const { getAtlanticoPrices } = await import("./client");
    await expect(getAtlanticoPrices("20", "2026-10-15")).resolves.toBe(
      "42.00|30.00|0.00|6.30|4.50|0.00"
    );
  });

  it("maps production loadPrices objects when the pipe format is unavailable", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = String(input);
      if (url.endsWith("/loadPrices/20/2026-10-15")) {
        return jsonResponse({
          PVPA: "44.00",
          PVPC: "32.00",
          PVPOS: "0.00",
          COMA: "6.60",
          COMC: "4.80",
          COMOS: "0.00",
        });
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("ATLANTICO_COLLABORATOR", "");

    const { getAtlanticoPrices } = await import("./client");
    await expect(getAtlanticoPrices("20", "2026-10-15")).resolves.toBe(
      "44.00|32.00|0.00|6.60|4.80|0.00"
    );
  });

  it("falls back from empty office [] to production PVPA body (live bug)", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = String(input);
      // Generic (no office) — production shape
      if (url.endsWith("/loadPrices/20/2026-09-11")) {
        return jsonResponse({
          PVPA: "44.00",
          PVPC: "32.00",
          PVPOS: "0.00",
          COMA: "6.60",
          COMC: "4.80",
          COMOS: "0.00",
        });
      }
      // Office variant — what production returned before the fix
      if (url.endsWith("/loadPrices/20/2026-09-11/3726")) {
        return jsonResponse([]);
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("ATLANTICO_COLLABORATOR", "3726");

    const { getAtlanticoPrices } = await import("./client");
    const { parseAtlanticoPrices, estimateBookingTotal } = await import("./prices");

    const raw = await getAtlanticoPrices("20", "2026-09-11");
    expect(raw).toBe("44.00|32.00|0.00|6.60|4.80|0.00");
    // Generic endpoint is tried first — office [] must not win
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      "https://atlantico.test.invalid/loadPrices/20/2026-09-11"
    );

    const prices = parseAtlanticoPrices(raw, "0");
    expect(estimateBookingTotal(prices, 0, 1, 0)).toBe(32);
  });

  it("loads catalog data through mocked GET requests", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = String(input);
      expect(url).not.toMatch(REAL_SUPPLIER_HOST);
      if (url.includes("/clasificationList/")) {
        return jsonResponse([{ id: "cat1", code: "22", name: "Theme parks" }]);
      }
      if (url.includes("/groupsList/")) {
        return jsonResponse([
          { id: "12", code: "12", name: "Forestal Park", category: "cat1" },
        ]);
      }
      if (url.includes("/loadLimits/")) {
        return jsonResponse({
          id: "184",
          dates: { date: ["20260822"] },
          sessions: {},
        });
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { listAtlanticoTours, getAtlanticoLimits } = await import("./client");
    const tours = await listAtlanticoTours("en");
    const limits = await getAtlanticoLimits("184", "en");

    expect(tours).toEqual([
      { id: "12", code: "12", name: "Forestal Park", category: "cat1" },
    ]);
    expect(limits?.id).toBe("184");
    expect(fetchMock.mock.calls.every(([input]) => String(input).includes("/confirm"))).toBe(
      false
    );
  });

  it("keeps the catalog when one category list is truncated", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = String(input);
      expect(url).not.toMatch(REAL_SUPPLIER_HOST);
      if (url.includes("/clasificationList/")) {
        return jsonResponse([
          { id: "cat1", code: "22", name: "Theme parks" },
          { id: "water", code: "23", name: "Water Sports" },
        ]);
      }
      if (url.endsWith("/groupsList/ENG/-1/water")) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => "text/html; charset=UTF-8" },
          text: async () => '[{"id":"99","name":"Broken","duration":"',
        };
      }
      if (url.endsWith("/groupsList/ENG/-1/cat1")) {
        return jsonResponse([
          {
            id: "12",
            code: "12",
            name: "Forestal Park",
            category: "cat1",
          },
        ]);
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { listAtlanticoClassificationsWithCounts } = await import("./client");
    const classifications = await listAtlanticoClassificationsWithCounts("en");

    expect(classifications).toEqual([
      { id: "cat1", code: "22", name: "Theme parks", count: 1 },
    ]);
  });
});
