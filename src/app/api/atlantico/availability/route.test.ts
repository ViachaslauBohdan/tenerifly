import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/atlantico/client", () => ({
  getAtlanticoLimits: vi.fn(),
}));

import { getAtlanticoLimits } from "@/lib/atlantico/client";
import { GET } from "./route";

describe("GET /api/atlantico/availability", () => {
  beforeEach(() => {
    vi.mocked(getAtlanticoLimits).mockReset();
  });

  it("requires an event code", async () => {
    const response = await GET(
      new Request("http://localhost/api/atlantico/availability")
    );
    expect(response.status).toBe(400);
    expect(getAtlanticoLimits).not.toHaveBeenCalled();
  });

  it("returns dates from mocked limits without calling Atlántico", async () => {
    vi.mocked(getAtlanticoLimits).mockResolvedValue({
      id: "184",
      dates: { date: ["20260822"], limit: [10], used: [0] },
      sessions: {
        "20260822": [{ time: "09:30", available: "8", sessionId: "2" }],
      },
    });

    const response = await GET(
      new Request("http://localhost/api/atlantico/availability?code=184&locale=en")
    );
    const payload = (await response.json()) as { dates?: string[] };

    expect(response.status).toBe(200);
    expect(payload.dates).toEqual(["2026-08-22"]);
    expect(getAtlanticoLimits).toHaveBeenCalledWith("184", "en", undefined);
  });
});
