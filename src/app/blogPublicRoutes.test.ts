import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { generateStaticParams as generateLocaleBlogParams } from "./[locale]/blog/page";
import { generateStaticParams as generateLocaleBlogPostParams } from "./[locale]/blog/[id]/page";
import { generateStaticParams as generateEnBlogPostParams } from "./blog/[id]/page";

const pageFiles = [
  "src/app/blog/page.tsx",
  "src/app/[locale]/blog/page.tsx",
  "src/app/blog/[id]/page.tsx",
  "src/app/[locale]/blog/[id]/page.tsx",
];

describe("hidden blog routes", () => {
  it.each(pageFiles)("%s calls assertBlogPublic before rendering", (file) => {
    const source = readFileSync(path.join(process.cwd(), file), "utf8");
    expect(source).toContain("assertBlogPublic()");
  });

  it("does not prebuild locale blog listing pages", () => {
    expect(generateLocaleBlogParams()).toEqual([]);
  });

  it("does not prebuild blog post pages", async () => {
    await expect(generateLocaleBlogPostParams()).resolves.toEqual([]);
    await expect(generateEnBlogPostParams()).resolves.toEqual([]);
  });
});
