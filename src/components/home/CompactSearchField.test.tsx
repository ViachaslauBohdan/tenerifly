import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CompactSearchField } from "@/components/home/CompactSearchField";

afterEach(() => {
  cleanup();
});

describe("CompactSearchField", () => {
  it("renders a plain field container without htmlFor", () => {
    const { container } = render(
      <CompactSearchField label="Guests">
        <select aria-label="Guests">
          <option value="2">2</option>
        </select>
      </CompactSearchField>
    );

    expect(container.querySelector("label")).toBeNull();
    expect(screen.getByText("Guests")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Guests" })).toBeInTheDocument();
  });

  it("wraps the full field in a label linked to the control id", () => {
    const { container } = render(
      <CompactSearchField label="Leisure" htmlFor="hero-leisure">
        <select id="hero-leisure" aria-label="Leisure">
          <option value="cars">Cars</option>
        </select>
      </CompactSearchField>
    );

    const label = container.querySelector('label[for="hero-leisure"]');
    const select = container.querySelector("#hero-leisure");
    expect(label).not.toBeNull();
    expect(label).toContainElement(select);
    expect(label?.className).toMatch(/cursor-pointer/);
  });

  it("activates the linked select when the field label text is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CompactSearchField label="Guests" htmlFor="hero-guests">
        <select
          id="hero-guests"
          aria-label="Guests"
          defaultValue="2"
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="2">2</option>
          <option value="4">4</option>
        </select>
      </CompactSearchField>
    );

    await user.click(screen.getByText("Guests"));
    expect(screen.getByRole("combobox", { name: "Guests" })).toHaveFocus();

    await user.selectOptions(screen.getByRole("combobox", { name: "Guests" }), "4");
    expect(onChange).toHaveBeenCalledWith("4");
  });
});
