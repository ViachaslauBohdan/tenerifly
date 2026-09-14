import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/atlantico/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/atlantico/client")>();
  return {
    ...actual,
    getAtlanticoPrices: vi.fn(),
  };
});

import { getAtlanticoPrices } from "@/lib/atlantico/client";
import { GET } from "./route";

function getPrices(query: string) {
  return GET(new Request(`http://localhost/api/atlantico/prices?${query}`));
}

describe("GET /api/atlantico/prices", () => {
  beforeEach(() => {
    vi.mocked(getAtlanticoPrices).mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects missing code/date", async () => {
    const res = await getPrices("code=20");
    expect(res.status).toBe(400);
    expect(getAtlanticoPrices).not.toHaveBeenCalled();
  });

  it("parses production PVPA raw into per-person prices", async () => {
    vi.mocked(getAtlanticoPrices).mockResolvedValue(
      "44.00|32.00|0.00|6.60|4.80|0.00"
    );

    const res = await getPrices("code=20&date=2026-10-15&pProd=0");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(getAtlanticoPrices).toHaveBeenCalledWith("20", "2026-10-15");
    expect(body.prices).toMatchObject({
      kind: "perPerson",
      adult: 44,
      child: 32,
    });
  });

  it("returns null prices for empty supplier placeholders", async () => {
    vi.mocked(getAtlanticoPrices).mockResolvedValue("");

    const res = await getPrices("code=20&date=2026-10-15&pProd=0");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.prices).toBeNull();
  });
});
