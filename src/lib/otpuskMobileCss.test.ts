import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  path.join(process.cwd(), "src/styles/globals.css"),
  "utf8"
);

const layout = readFileSync(
  path.join(process.cwd(), "src/app/layout.tsx"),
  "utf8"
);

const worldToursClient = readFileSync(
  path.join(process.cwd(), "src/app/world-tours/client.tsx"),
  "utf8"
);

function otpuskPhoneMediaBlock(source: string): string {
  const start = source.indexOf(
    "/* Otpusk desktop CSS sets .new_f-form > .clearfix { width: 890px }"
  );
  expect(start).toBeGreaterThan(-1);
  const media = source.indexOf("@media (max-width: 639px)", start);
  expect(media).toBeGreaterThan(-1);
  const end = source.indexOf(
    "/* Otpusk tour search — extra space under the form row",
    media
  );
  expect(end).toBeGreaterThan(media);
  return source.slice(media, end);
}

describe("Otpusk phone CSS contract", () => {
  const phoneCss = otpuskPhoneMediaBlock(css);

  it("covers both home and world-tours Otpusk hosts", () => {
    expect(phoneCss).toContain("#otpusk-search-container");
    expect(phoneCss).toContain("#otpusk-world-search-container");
  });

  it("drops the 890px desktop row instead of wrapping fields at 50%", () => {
    expect(phoneCss).toContain("width: auto !important");
    expect(phoneCss).toContain("max-width: 100% !important");
    expect(phoneCss).toContain(".new_f-form > .clearfix");
    expect(phoneCss).not.toContain("50%");
    expect(phoneCss).not.toContain("body:not(.new_mobile-form)");
    expect(phoneCss).not.toContain("body:not(.new_m-mobile-form)");
  });

  it("stacks Country/From/date as full-width blocks", () => {
    expect(phoneCss).toContain(".new_f-form-field");
    expect(phoneCss).toContain("float: none !important");
    expect(phoneCss).toContain("display: block !important");
    expect(phoneCss).toContain("width: 100% !important");
  });
});

describe("root viewport for iPhone", () => {
  it("exports device-width so Safari does not treat the page as a 980px desktop", () => {
    expect(layout).toContain("export const viewport");
    expect(layout).toContain('width: "device-width"');
    expect(layout).toContain("initialScale: 1");
  });
});

describe("world-tours Otpusk host", () => {
  it("mounts the widget in the container the phone CSS targets", () => {
    expect(worldToursClient).toContain(
      'searchContainerId="otpusk-world-search-container"'
    );
    expect(worldToursClient).toContain(
      'tourContainerId="otpusk-world-tour-container"'
    );
  });
});
