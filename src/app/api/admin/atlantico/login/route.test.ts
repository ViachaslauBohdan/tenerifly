import { afterEach, describe, expect, it } from "vitest";
import { ADMIN_COOKIE, adminSessionToken } from "@/lib/adminSession";
import { POST } from "./route";

describe("POST /api/admin/atlantico/login", () => {
  afterEach(() => {
    delete process.env.ATLANTICO_ADMIN_PASSWORD;
  });

  it("rejects login when the password is not configured", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/atlantico/login", {
        method: "POST",
        body: JSON.stringify({ password: "secret" }),
      })
    );
    expect(response.status).toBe(503);
  });

  it("rejects the wrong password and does not set a cookie", async () => {
    process.env.ATLANTICO_ADMIN_PASSWORD = "correct-horse";
    const response = await POST(
      new Request("http://localhost/api/admin/atlantico/login", {
        method: "POST",
        body: JSON.stringify({ password: "nope" }),
      })
    );
    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("sets an httpOnly cookie for the right password", async () => {
    process.env.ATLANTICO_ADMIN_PASSWORD = "correct-horse";
    const response = await POST(
      new Request("http://localhost/api/admin/atlantico/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "correct-horse" }),
      })
    );
    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie") || "";
    expect(cookie).toContain(`${ADMIN_COOKIE}=${adminSessionToken("correct-horse")}`);
    expect(cookie.toLowerCase()).toContain("httponly");
  });
});
