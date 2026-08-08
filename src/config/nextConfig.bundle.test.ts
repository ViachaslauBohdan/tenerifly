import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const nextConfig = require("../../next.config.js") as {
  experimental?: { optimizePackageImports?: string[] };
};

describe("next.config bundle optimizations", () => {
  it("optimizes icon and mantine package imports", () => {
    expect(nextConfig.experimental?.optimizePackageImports).toEqual(
      expect.arrayContaining([
        "@mantine/core",
        "@mantine/hooks",
        "@mantine/dates",
        "@mantine/carousel",
        "@tabler/icons-react",
        "lucide-react",
      ])
    );
  });
});
