import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PropertyDescriptionBody } from "@/components/PropertyDescriptionBody";
import {
  parsePropertyDescription,
  propertyDescriptionPlainText,
} from "@/lib/propertyDescription";

const sample = `Located in the Jardines Del Mar complex in Puerto de Santiago.

**Location:**
Puerto de Santiago, near La Arena Beach.

**Layout and Capacity:**

- 1 bedroom with a comfortable double bed
- Fully equipped kitchen for self-catering

A bright apartment near the beach.`;

describe("property description markdown", () => {
  it("keeps section labels, line breaks, and bullet lists", () => {
    const blocks = parsePropertyDescription(sample);

    expect(blocks).toEqual([
      {
        type: "paragraph",
        lines: [
          "Located in the Jardines Del Mar complex in Puerto de Santiago.",
        ],
      },
      {
        type: "paragraph",
        lines: ["**Location:**", "Puerto de Santiago, near La Arena Beach."],
      },
      { type: "paragraph", lines: ["**Layout and Capacity:**"] },
      {
        type: "list",
        ordered: false,
        items: [
          "1 bedroom with a comfortable double bed",
          "Fully equipped kitchen for self-catering",
        ],
      },
      { type: "paragraph", lines: ["A bright apartment near the beach."] },
    ]);
  });

  it("renders bold labels and lists without raw asterisks", () => {
    render(<PropertyDescriptionBody text={sample} />);

    expect(screen.getByText("Location:")).toHaveClass("font-semibold");
    expect(screen.getByText("Layout and Capacity:")).toBeInTheDocument();
    const item = screen.getByText("1 bedroom with a comfortable double bed");
    expect(item.tagName).toBe("LI");
    expect(document.body.textContent).not.toContain("**");
  });

  it("leaves html as text", () => {
    render(
      <PropertyDescriptionBody text={"Safe text <script>alert(1)</script>"} />
    );

    expect(screen.getByText(/<script>alert\(1\)<\/script>/)).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });

  it("keeps bullets in one list when blank lines separate them", () => {
    expect(
      parsePropertyDescription("- Bedroom\n\n- Kitchen\n\nA bright apartment.")
    ).toEqual([
      { type: "list", ordered: false, items: ["Bedroom", "Kitchen"] },
      { type: "paragraph", lines: ["A bright apartment."] },
    ]);
  });

  it("builds a plain excerpt without markdown markers", () => {
    expect(propertyDescriptionPlainText(sample)).toBe(
      "Located in the Jardines Del Mar complex in Puerto de Santiago. Location: Puerto de Santiago, near La Arena Beach. Layout and Capacity: 1 bedroom with a comfortable double bed Fully equipped kitchen for self-catering A bright apartment near the beach."
    );
  });
});
