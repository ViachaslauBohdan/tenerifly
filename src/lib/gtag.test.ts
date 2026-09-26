import { afterEach, describe, expect, it, vi } from "vitest";
import { COOKIE_CONSENT_STORAGE_KEY } from "./cookieConsent";
import { gtagReportConversion } from "./gtag";

afterEach(() => {
  localStorage.clear();
  window.gtag = undefined;
});

describe("gtagReportConversion", () => {
  it("does not send a conversion before cookies are accepted", () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    gtagReportConversion();

    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not send a conversion when cookies were rejected", () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "rejected");
    const gtag = vi.fn();
    window.gtag = gtag;

    gtagReportConversion();

    expect(gtag).not.toHaveBeenCalled();
  });

  it("sends a conversion after cookies are accepted", () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");
    const gtag = vi.fn();
    window.gtag = gtag;

    gtagReportConversion();

    expect(gtag).toHaveBeenCalledWith(
      "event",
      "conversion",
      expect.objectContaining({
        send_to: "AW-679583815/QsSACOPai8wBEMfAhsQC",
      })
    );
  });
});
