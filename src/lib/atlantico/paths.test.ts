import { describe, expect, it } from "vitest";
import { ATLANTICO_PATHS } from "./paths";

describe("ATLANTICO_PATHS", () => {
  it("uses trailing slashes on confirm and payment (Apache 404 without them)", () => {
    expect(ATLANTICO_PATHS.confirm).toBe("/confirm/");
    expect(ATLANTICO_PATHS.payment).toBe("/payment/");
  });
});
