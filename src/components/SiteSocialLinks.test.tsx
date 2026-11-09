import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteSocialLinks } from "./SiteSocialLinks";

afterEach(() => {
  cleanup();
});

describe("SiteSocialLinks", () => {
  it("uses brand-colored badges and opens each profile in a new tab", () => {
    render(<SiteSocialLinks />);

    const instagram = screen.getByRole("link", { name: "Instagram" });
    const facebook = screen.getByRole("link", { name: "Facebook" });
    const tiktok = screen.getByRole("link", { name: "TikTok" });
    const maps = screen.getByRole("link", { name: "Google Maps" });

    expect(instagram).toHaveAttribute("href", "https://www.instagram.com/pana.fera");
    expect(instagram.getAttribute("style") ?? "").toContain("radial-gradient");
    expect(facebook).toHaveAttribute(
      "href",
      "https://www.facebook.com/people/TenerifeJoy-PanaFera/61595340874144/"
    );
    expect(facebook.className).toContain("bg-[#1877F2]");
    expect(tiktok).toHaveAttribute("href", "https://www.tiktok.com/@pana.fera.ru");
    expect(tiktok.className).toContain("bg-black");
    expect(maps).toHaveAttribute("href", "https://maps.app.goo.gl/TBbdVEqmjSkcTLEf6");
    expect(maps.className).toContain("bg-white");

    for (const link of [instagram, facebook, tiktok, maps]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
