import { describe, expect, it } from "vitest";
import {
  isPhoneNumberValid,
  nationalFromE164,
  parsePastedPhone,
  toE164,
} from "./PhoneNumberInput.parse";

describe("toE164", () => {
  it("builds an E.164 number from national digits", () => {
    expect(toE164("ES", "612 345 678")).toBe("+34612345678");
  });

  it("does not double the country calling code", () => {
    expect(toE164("ES", "34612345678")).toBe("+34612345678");
    expect(toE164("UA", "380501234567")).toBe("+380501234567");
  });

  it("returns undefined when empty", () => {
    expect(toE164("ES", "   ")).toBeUndefined();
  });
});

describe("nationalFromE164", () => {
  it("drops the calling code for the input field", () => {
    expect(nationalFromE164("ES", "+34612345678")).toBe("612345678");
  });
});

describe("parsePastedPhone", () => {
  it("reads a full international number", () => {
    expect(parsePastedPhone("+34 612 345 678")).toEqual({
      country: "ES",
      value: "+34612345678",
      national: "612345678",
    });
  });

  it("ignores national-only input", () => {
    expect(parsePastedPhone("612 345 678")).toBeNull();
  });
});

describe("isPhoneNumberValid", () => {
  it("accepts a valid Spanish mobile", () => {
    expect(isPhoneNumberValid("ES", "+34612345678")).toBe(true);
  });

  it("rejects a missing or short number", () => {
    expect(isPhoneNumberValid("ES", undefined)).toBe(false);
    expect(isPhoneNumberValid("ES", "+34612")).toBe(false);
  });
});
