import { afterEach, describe, expect, it, vi } from "vitest";

describe("atlantico bookingMode", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("defaults to iframe when env is unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_ATLANTICO_BOOKING_MODE", "");
    const { getAtlanticoBookingChannel } = await import("./bookingMode");
    expect(getAtlanticoBookingChannel()).toBe("iframe");
  });

  it("selects the REST API form when env is api", async () => {
    vi.stubEnv("NEXT_PUBLIC_ATLANTICO_BOOKING_MODE", "api");
    const { getAtlanticoBookingChannel } = await import("./bookingMode");
    expect(getAtlanticoBookingChannel()).toBe("api");
  });

  it("accepts case-insensitive iframe", async () => {
    vi.stubEnv("NEXT_PUBLIC_ATLANTICO_BOOKING_MODE", " IFRAME ");
    const { getAtlanticoBookingChannel } = await import("./bookingMode");
    expect(getAtlanticoBookingChannel()).toBe("iframe");
  });

  it("falls back to iframe for unknown values like choose", async () => {
    vi.stubEnv("NEXT_PUBLIC_ATLANTICO_BOOKING_MODE", "choose");
    const { getAtlanticoBookingChannel } = await import("./bookingMode");
    expect(getAtlanticoBookingChannel()).toBe("iframe");
  });

  it("exposes isAtlanticoIframeBooking from the same env switch", async () => {
    vi.stubEnv("NEXT_PUBLIC_ATLANTICO_BOOKING_MODE", "api");
    const { isAtlanticoIframeBooking } = await import("./bookingMode");
    expect(isAtlanticoIframeBooking()).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_ATLANTICO_BOOKING_MODE", "iframe");
    const { isAtlanticoIframeBooking: again } = await import("./bookingMode");
    expect(again()).toBe(true);
  });
});