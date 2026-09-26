import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/lib/cookieConsent";
import { CookieConsentBanner } from "./CookieConsentBanner";

const pathname = vi.fn(() => "/en");

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => pathname(),
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.style.removeProperty("--cookie-banner-height");
  pathname.mockReturnValue("/en");
});

describe("CookieConsentBanner", () => {
  it("asks for a choice and remembers accept", async () => {
    const user = userEvent.setup();
    render(<CookieConsentBanner />);

    const dialog = await screen.findByRole("dialog", { name: "Cookies" });
    expect(dialog).toHaveTextContent("measure advertising");
    expect(screen.getByRole("link", { name: "Cookie policy" })).toHaveAttribute(
      "href",
      "/en/cookies"
    );

    await user.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).toBe("accepted");
    expect(
      document.documentElement.style.getPropertyValue("--cookie-banner-height")
    ).toBe("");
    expect(screen.getByRole("button", { name: "Cookie settings" })).toBeInTheDocument();
  });

  it("reopens after a choice so consent can be withdrawn", async () => {
    const user = userEvent.setup();
    render(<CookieConsentBanner />);

    await screen.findByRole("dialog", { name: "Cookies" });
    await user.click(screen.getByRole("button", { name: "Accept" }));
    await user.click(screen.getByRole("button", { name: "Cookie settings" }));

    expect(screen.getByText("Advertising cookies are on.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reject" }));

    expect(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).toBe("rejected");
    await user.click(screen.getByRole("button", { name: "Cookie settings" }));
    expect(screen.getByText("Advertising cookies are off.")).toBeInTheDocument();
  });

  it("shows the banner again when a choice is already stored", async () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");
    render(<CookieConsentBanner />);

    expect(await screen.findByRole("dialog", { name: "Cookies" })).toBeInTheDocument();
    expect(await screen.findByText("Advertising cookies are on.")).toBeInTheDocument();
  });

  it("shows the banner when the stored value is not a real choice", async () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "later");
    render(<CookieConsentBanner />);

    expect(await screen.findByRole("dialog", { name: "Cookies" })).toBeInTheDocument();
    expect(screen.queryByText("Advertising cookies are on.")).not.toBeInTheDocument();
  });

  it("uses the locale from the URL", async () => {
    pathname.mockReturnValue("/ru/tours");
    render(<CookieConsentBanner />);

    expect(
      await screen.findByRole("dialog", { name: "Файлы cookie" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Отклонить" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Политика cookie" })).toHaveAttribute(
      "href",
      "/ru/cookies"
    );
  });
});
