import { describe, expect, it } from "vitest";
import { validateBookRequest } from "./bookRequest";

describe("validateBookRequest", () => {
  const valid = {
    t_id: "184",
    t_group: "12",
    language: "ENG",
    tourDate: "2026-08-21",
    sesTime: "09:30",
    adults: 2,
    childs: 0,
    infants: 0,
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: "+34600111222",
  };

  it("accepts a complete booking payload", () => {
    const result = validateBookRequest(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.t_id).toBe("184");
      expect(result.value.adults).toBe(2);
      expect(result.value.sesTime).toBe("09:30");
    }
  });

  it("defaults session time when missing", () => {
    const result = validateBookRequest({ ...valid, sesTime: "" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.sesTime).toBe("00:00");
  });

  it("rejects missing guests", () => {
    const result = validateBookRequest({
      ...valid,
      adults: 0,
      childs: 0,
      infants: 0,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = validateBookRequest({ ...valid, email: "nope" });
    expect(result.ok).toBe(false);
  });

  it("keeps hotel and notes optional", () => {
    const result = validateBookRequest(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).not.toHaveProperty("hotel");
      expect(result.value).not.toHaveProperty("Notes");
    }
  });

  it("includes hotel and notes when provided", () => {
    const result = validateBookRequest({
      ...valid,
      hotel: "Hotel Botanico",
      notes: "Window seat",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hotel).toBe("Hotel Botanico");
      expect(result.value.Notes).toBe("Window seat");
    }
  });
});
