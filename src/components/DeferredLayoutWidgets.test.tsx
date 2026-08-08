import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createNextDynamicMock } from "@/test/nextDynamicMock";

vi.mock("next/dynamic", async () => createNextDynamicMock());

vi.mock("@/components/ReferralCodeClient", () => ({
  ReferralCodeClient: () => <div data-testid="referral-code-client" />,
}));

vi.mock("@/components/WhatsAppFloatingButton", () => ({
  WhatsAppFloatingButton: () => <div data-testid="whatsapp-floating-button" />,
}));

afterEach(() => {
  cleanup();
});

describe("DeferredLayoutWidgets", () => {
  it("lazy-loads the referral client", async () => {
    const { DeferredReferral } = await import(
      "@/components/DeferredLayoutWidgets"
    );

    render(<DeferredReferral />);

    await waitFor(() => {
      expect(screen.getByTestId("referral-code-client")).toBeInTheDocument();
    });
  });

  it("lazy-loads the WhatsApp floating button", async () => {
    const { DeferredWhatsApp } = await import(
      "@/components/DeferredLayoutWidgets"
    );

    render(<DeferredWhatsApp />);

    await waitFor(() => {
      expect(
        screen.getByTestId("whatsapp-floating-button")
      ).toBeInTheDocument();
    });
  });
});
