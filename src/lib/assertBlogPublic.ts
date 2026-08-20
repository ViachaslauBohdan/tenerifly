import { notFound } from "next/navigation";
import { BLOG_ENABLED } from "@/lib/siteFeatures";

export function assertBlogPublic(): void {
  if (!BLOG_ENABLED) {
    notFound();
  }
}
