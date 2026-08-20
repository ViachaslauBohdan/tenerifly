import { describe, expect, it, vi } from "vitest";

const notFound = vi.fn(() => {
  throw new Error("NEXT_HTTP_ERROR_FALLBACK;not-found");
});

vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

import { assertBlogPublic } from "./assertBlogPublic";

describe("assertBlogPublic", () => {
  it("404s while the blog is hidden", () => {
    expect(() => assertBlogPublic()).toThrow(/not-found/i);
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
