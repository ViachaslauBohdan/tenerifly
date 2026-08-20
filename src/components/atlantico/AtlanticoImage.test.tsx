import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AtlanticoImage } from "./AtlanticoImage";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    onError,
  }: {
    src: string;
    alt: string;
    onError?: () => void;
  }) => <img alt={alt} src={src} onError={onError} />,
}));

afterEach(() => {
  cleanup();
});

describe("AtlanticoImage", () => {
  it("tries the next candidate after a load error", () => {
    render(
      <AtlanticoImage
        alt="Peter Pan"
        src={[
          "https://www.atlanticoexcursiones.com/zeus/pictures/GRP27/peter_pan.png",
          "https://www.atlanticoexcursiones.com/zeus/pictures/GRP27/peter_pan.jpg",
        ]}
      />
    );

    fireEvent.error(screen.getByAltText("Peter Pan"));

    expect(screen.getByAltText("Peter Pan")).toHaveAttribute(
      "src",
      "https://www.atlanticoexcursiones.com/zeus/pictures/GRP27/peter_pan.jpg"
    );
  });

  it("renders nothing when no matching photo loads", () => {
    render(
      <AtlanticoImage alt="The Wild South Dinner Show" src={["https://example.test/missing.webp"]} />
    );

    fireEvent.error(screen.getByAltText("The Wild South Dinner Show"));

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
