import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { LOCALES } from "@/types/locale";
import { BLOG_ENABLED } from "@/lib/siteFeatures";

export default function robots(): MetadataRoute.Robots {
  const blogDisallow = BLOG_ENABLED
    ? []
    : ["/blog", ...LOCALES.map((locale) => `/${locale.code}/blog`)];

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
        ...blogDisallow,
      ],
    },
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
} 