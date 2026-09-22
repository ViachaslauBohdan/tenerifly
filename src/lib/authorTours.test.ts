import { describe, expect, it } from "vitest";
import { getAuthorTourBundle, getAuthorTourImageSrc } from "./authorTours";

describe("authorTours", () => {
  it("lists the 8-day route and the 7-beach route in Russian", () => {
    const { tours } = getAuthorTourBundle("ru");
    expect(tours.map((tour) => tour.priceEur)).toEqual([700, 500]);
    expect(tours[0].program).toHaveLength(8);
    expect(tours[0].program[1]).toMatch(/Маска/);
    expect(tours[1].included.join(" ")).toMatch(/яхт/i);
    expect(getAuthorTourImageSrc("tenerife-8-days")).toBe(
      "/author-tours/teide-landscape.jpg"
    );
    expect(getAuthorTourImageSrc("seven-beaches")).toBe(
      "/author-tours/beach-landscape.jpg"
    );
  });

  it("falls back to English outside ru and uk", () => {
    expect(getAuthorTourBundle("pl").ui.sectionTitle).toBe("Author tours");
    expect(getAuthorTourBundle("ua").tours[0].title).toMatch(/8 дней/);
  });
});
