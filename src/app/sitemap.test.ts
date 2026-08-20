import { describe, expect, it, vi } from "vitest";

const getAllBlogIds = vi.fn(async () => {
  throw new Error("hidden blog catalog must not be loaded");
});

vi.mock("@/services/ssgDataService", () => ({
  getAllPropertyIds: async () => [],
  getAllCarIds: async () => [],
  getAllTourIds: async () => [],
  getAllBlogIds: () => getAllBlogIds(),
  getAllTransferIds: async () => [{ documentId: "van-1" }],
}));

import sitemap from "./sitemap";

describe("sitemap without blog", () => {
  it("does not list blog index or posts, and does not fetch blog ids", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls.some((url) => url.includes("/blog"))).toBe(false);
    expect(urls.some((url) => url.includes("/transfers/van-1"))).toBe(true);
    expect(getAllBlogIds).not.toHaveBeenCalled();
  });
});
