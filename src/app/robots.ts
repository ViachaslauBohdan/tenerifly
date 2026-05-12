import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/_next/",
        "/static/",
        "/admin/",
        "/dashboard/",
      ],
    },
    host: "https://tenerifly.io",
    sitemap: "https://tenerifly.io/sitemap.xml",
  };
} 