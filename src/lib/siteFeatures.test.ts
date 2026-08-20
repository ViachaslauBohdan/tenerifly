import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { BLOG_ENABLED } from "./siteFeatures";

describe("site features", () => {
  it("keeps the blog off the public site", () => {
    expect(BLOG_ENABLED).toBe(false);
  });

  it("tells crawlers not to index blog URLs", () => {
    const spec = robots();
    const rules = Array.isArray(spec.rules) ? spec.rules[0] : spec.rules;
    expect(rules.disallow).toEqual(
      expect.arrayContaining(["/blog", "/en/blog", "/pl/blog"])
    );
  });
});
