import { describe, expect, it } from "vitest";
import { availableIsoDates, sessionsForIsoDate } from "./availability";
import type { AtlanticoLoadLimitsResponse } from "./types";
import { parseConfirmResponse } from "./client";

const limits: AtlanticoLoadLimitsResponse = {
  id: "184",
  dates: {
    date: ["20260821", "20260822"],
    limit: [10, 0],
    used: [10, 0],
  },
  sessions: {
    "20260821": [
      {
        time: "09:30",
        available: "0",
        sessionId: "1",
      },
    ],
    "20260822": [
      {
        time: "09:30",
        available: "12",
        sessionId: "2",
      },
    ],
  },
};

describe("availableIsoDates", () => {
  it("prefers sessions with remaining places", () => {
    expect(availableIsoDates(limits)).toEqual(["2026-08-22"]);
  });
});

describe("sessionsForIsoDate", () => {
  it("returns bookable sessions for a day", () => {
    expect(sessionsForIsoDate(limits, "2026-08-22")).toHaveLength(1);
    expect(sessionsForIsoDate(limits, "2026-08-21")).toHaveLength(0);
  });
});

describe("parseConfirmResponse", () => {
  it("reads bookingCode from JSON", () => {
    expect(parseConfirmResponse({ bookingCode: "AE-123" })).toEqual({
      bookingCode: "AE-123",
      message: undefined,
    });
  });

  it("reads a plain booking reference string", () => {
    expect(parseConfirmResponse(" AE-999 ")).toEqual({ bookingCode: "AE-999" });
  });
});
