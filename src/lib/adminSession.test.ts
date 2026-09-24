import { afterEach, describe, expect, it } from "vitest";
import {
  adminSessionToken,
  isAdminSession,
  passwordsMatch,
} from "./adminSession";

describe("adminSession", () => {
  afterEach(() => {
    delete process.env.ATLANTICO_ADMIN_PASSWORD;
  });

  it("rejects a missing or wrong password", () => {
    process.env.ATLANTICO_ADMIN_PASSWORD = "correct-horse";
    expect(passwordsMatch("", "correct-horse")).toBe(false);
    expect(passwordsMatch("nope", "correct-horse")).toBe(false);
    expect(passwordsMatch("correct-horse", "correct-horse")).toBe(true);
  });

  it("accepts only the cookie minted from the configured password", () => {
    process.env.ATLANTICO_ADMIN_PASSWORD = "correct-horse";
    expect(isAdminSession(undefined)).toBe(false);
    expect(isAdminSession("short")).toBe(false);
    expect(isAdminSession(adminSessionToken("other"))).toBe(false);
    expect(isAdminSession(adminSessionToken("correct-horse"))).toBe(true);
  });
});
