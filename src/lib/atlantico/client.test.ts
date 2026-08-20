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

  it("posts /confirm only to the mocked fetch, never a live supplier host", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = String(input);
      expect(url).not.toMatch(REAL_SUPPLIER_HOST);
      expect(url).toBe("https://atlantico.test.invalid/confirm");
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

  it("loads catalog data through mocked GET requests", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = String(input);
      expect(url).not.toMatch(REAL_SUPPLIER_HOST);
      if (url.includes("/groupsList/")) {
        return jsonResponse([{ id: "12", code: "12", name: "Forestal Park" }]);
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
      { id: "12", code: "12", name: "Forestal Park" },
    ]);
    expect(limits?.id).toBe("184");
    expect(fetchMock.mock.calls.every(([input]) => String(input).includes("/confirm"))).toBe(
      false
    );
  });
});
