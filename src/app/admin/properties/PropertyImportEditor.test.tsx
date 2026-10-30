import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PropertyImportEditor } from "./PropertyImportEditor";

afterEach(() => {
  cleanup();
});

const valid = JSON.stringify([
  {
    title: "Villa El Duque",
    slug: "villa-el-duque",
    description: "Ocean view villa.",
    type: "rent",
    property_status: "available",
    category: "villa",
    price: { amount: 730, currency: "EUR", period: "day" },
    location: { city: "Costa Adeje" },
  },
]);

describe("PropertyImportEditor", () => {
  it("highlights a broken paste and does not upload it", () => {
    const onUpload = vi.fn();
    render(<PropertyImportEditor onUpload={onUpload} />);
    const field = screen.getByLabelText("JSON апартаментов");

    fireEvent.change(field, { target: { value: "{ title:" } });

    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field.className).toMatch(/border-red-500/);
    expect(screen.getByText(/JSON не читается/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Загрузить новые" })).toBeDisabled();
    expect(onUpload).not.toHaveBeenCalled();
  });

  it("highlights the bad object and keeps a valid batch ready to upload", () => {
    const onUpload = vi.fn();
    render(<PropertyImportEditor onUpload={onUpload} />);

    fireEvent.change(screen.getByLabelText("JSON апартаментов"), {
      target: { value: valid },
    });

    expect(screen.getByText(/Формат верный: 1 объект/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Загрузить новые" })).toBeEnabled();

    fireEvent.change(screen.getByLabelText("JSON апартаментов"), {
      target: {
        value: JSON.stringify([
          {
            title: "Broken",
            description: "Text",
            type: "rent",
            property_status: "available",
            category: "apartment",
            price: "850 EUR / night",
            location: { city: "Adeje" },
          },
        ]),
      },
    });

    expect(screen.getByText(/Объект 1 · price/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Загрузить новые" })).toBeDisabled();
  });
});
