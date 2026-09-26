import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/lib/cookieConsent";
import { CookieConsentBanner } from "./CookieConsentBanner";
import { GoogleAdsTag } from "./GoogleAdsTag";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/en",
}));

vi.mock("next/script", () => ({
  default: ({
    id,
    src,
    children,
  }: {
    id?: string;
    src?: string;
    children?: string;
  }) => (
    <script id={id} src={src} data-testid={id ?? "google-ads-loader"}>
      {children}
    </script>
  ),
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function renderConsent() {
  return render(
    <>
      <CookieConsentBanner />
      <GoogleAdsTag />
    </>
  );
}

describe("Google Ads tag consent", () => {
  it("does not load the ads tag until cookies are accepted", async () => {
    const user = userEvent.setup();
    renderConsent();

    await screen.findByRole("dialog", { name: "Cookies" });
    expect(document.querySelector('script[src*="googletagmanager.com"]')).toBeNull();

    await user.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.querySelector('script[src*="googletagmanager.com"]')).toBeNull();
  });

  it("loads the ads tag after accept", async () => {
    const user = userEvent.setup();
    renderConsent();

    await screen.findByRole("button", { name: "Accept" });
    await user.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(
        document.querySelector('script[src*="googletagmanager.com/gtag/js?id=AW-679583815"]')
      ).not.toBeNull();
    });
    expect(screen.getByTestId("google-ads").textContent).toContain(
      "gtag('config', 'AW-679583815')"
    );
  });

  it("loads the ads tag on a later visit when consent was already accepted", async () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");
    render(<GoogleAdsTag />);

    await waitFor(() => {
      expect(
        document.querySelector('script[src*="googletagmanager.com/gtag/js?id=AW-679583815"]')
      ).not.toBeNull();
    });
  });
});
