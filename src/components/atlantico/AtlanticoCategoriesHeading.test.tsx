import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AtlanticoCategoriesHeading } from "./AtlanticoCategoriesHeading";

afterEach(() => {
  cleanup();
});

describe("AtlanticoCategoriesHeading", () => {
  it("renders the two-tone main categories title", () => {
    render(<AtlanticoCategoriesHeading locale="en" />);
    expect(
      screen.getByRole("heading", { name: /main categories/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/every corner of Tenerife/i)
    ).toBeInTheDocument();
  });
});
