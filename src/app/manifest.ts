import type { MetadataRoute } from "next";
import { SEO_HOME } from "@/lib/seo";
import { SITE_BRAND } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const { description } = SEO_HOME.en;
  return {
    name: `${SITE_BRAND} — Tenerife travel`,
    short_name: "Tenerife Joy",
    description,
    start_url: "/en/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
