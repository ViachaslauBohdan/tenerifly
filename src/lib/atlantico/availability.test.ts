import { describe, expect, it } from "vitest";
import {
  availableIsoDates,
  sessionsForIsoDate,
  weekdayTimeForIsoDate,
} from "./availability";
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

  it("builds a calendar from Monday-first weekdays when no date list is returned", () => {
    const dates = availableIsoDates(
      {
        id: "2232",
        dates: { wdays: [0, 2, 0, 4, 0, 0, 0] },
      },
      { fromIso: "2026-10-19", horizonDays: 6 }
    );
    expect(dates).toEqual(["2026-10-20", "2026-10-22"]);
  });

  it("keeps a real date list instead of expanding weekdays", () => {
    expect(
      availableIsoDates(
        {
          id: "1920",
          dates: {
            date: ["20261020"],
            wdays: [0, 2, 0, 0, 5, 0, 0],
          },
        },
        { fromIso: "2026-10-19" }
      )
    ).toEqual(["2026-10-20"]);
  });

  it("returns nothing when every weekday is closed", () => {
    expect(
      availableIsoDates(
        { id: "538", dates: { wdays: [0, 0, 0, 0, 0, 0, 0] } },
        { fromIso: "2026-10-19" }
      )
    ).toEqual([]);
  });
});

describe("weekdayTimeForIsoDate", () => {
  it("reads the Monday-first departure time and skips closed days", () => {
    const times = ["-", "08:00", "-", "08:00", "-", "-", "-"];
    expect(weekdayTimeForIsoDate(times, "2026-10-20")).toBe("08:00");
    expect(weekdayTimeForIsoDate(times, "2026-10-19")).toBeNull();
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
