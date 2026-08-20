import { afterEach, describe, expect, it, vi } from "vitest";
import { openBookingWhatsApp, openWhatsApp } from "./whatsapp";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("openWhatsApp", () => {
  it("opens the work WhatsApp number with a general enquiry", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);

    openWhatsApp("general", { title: "Tenerife Joy Services" }, "en");

    expect(open).toHaveBeenCalledTimes(1);
    const url = String(open.mock.calls[0][0]);
    expect(url.startsWith("https://wa.me/34604972372?text=")).toBe(true);
    expect(url).not.toContain("34613211069");
    expect(url).not.toContain("34656641433");
    expect(decodeURIComponent(url)).toContain(
      "Hi! I'd like to learn more about your services in Tenerife"
    );
  });
});

describe("openBookingWhatsApp", () => {
  it("opens the work WhatsApp number for a booking request", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);

    openBookingWhatsApp(
      "accommodation",
      { title: "Sunny Duplex", price: "€70" },
      "en"
    );

    expect(open).toHaveBeenCalledTimes(1);
    const url = String(open.mock.calls[0][0]);
    expect(url.startsWith("https://wa.me/34604972372?text=")).toBe(true);
    expect(url).not.toContain("34656641433");
    expect(decodeURIComponent(url)).toContain(
      'Hi! I would like to book "Sunny Duplex" for €70'
    );
  });
});
