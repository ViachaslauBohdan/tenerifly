import { describe, expect, it } from "vitest";
import {
  atlanticoImageUrl,
  atlanticoTourImageCandidates,
  atlanticoTourImageUrl,
} from "./images";

describe("atlanticoImageUrl", () => {
  it("returns null for empty values", () => {
    expect(atlanticoImageUrl("")).toBeNull();
    expect(atlanticoImageUrl(null)).toBeNull();
  });

  it("keeps absolute URLs", () => {
    expect(atlanticoImageUrl("https://cdn.example.com/a.jpg")).toBe(
      "https://cdn.example.com/a.jpg"
    );
  });

  it("prefixes category filenames with evtypes", () => {
    expect(atlanticoImageUrl("Excursiones_en_Bus.webp")).toBe(
      "https://www.atlanticoexcursiones.com/images/evtypes/Excursiones_en_Bus.webp"
    );
  });
});

describe("atlanticoTourImageUrl", () => {
  it("uses the GRP{code} product folder", () => {
    expect(atlanticoTourImageUrl("MForestalPark.jpg", "66")).toBe(
      "https://www.atlanticoexcursiones.com/zeus/pictures/GRP66/MForestalPark.jpg"
    );
    expect(
      atlanticoTourImageUrl("1-LoroParqueAnimalEmbassyLogo.webp", 3)
    ).toBe(
      "https://www.atlanticoexcursiones.com/zeus/pictures/GRP3/1-LoroParqueAnimalEmbassyLogo.webp"
    );
  });
});

describe("atlanticoTourImageCandidates", () => {
  it("retries only the same filename with other extensions", () => {
    expect(atlanticoTourImageCandidates("peter_pan.png", "27")).toEqual([
      "https://www.atlanticoexcursiones.com/zeus/pictures/GRP27/peter_pan.png",
      "https://www.atlanticoexcursiones.com/zeus/pictures/GRP27/peter_pan.webp",
      "https://www.atlanticoexcursiones.com/zeus/pictures/GRP27/peter_pan.jpg",
      "https://www.atlanticoexcursiones.com/zeus/pictures/GRP27/peter_pan.jpeg",
    ]);
  });
});
