import { NextRequest, NextResponse } from "next/server";
import {
  CMS_CACHE_TAGS,
  type CmsCacheTag,
} from "@/config/cmsCache";
import { revalidateCmsCache } from "@/services/ssgDataService";

const ALLOWED_TAGS = new Set<string>([
  "all",
  ...Object.values(CMS_CACHE_TAGS),
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, tag } = body as { secret?: string; tag?: string };

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    const normalized = tag ?? "all";
    if (!ALLOWED_TAGS.has(normalized)) {
      return NextResponse.json(
        { message: "Invalid tag", allowed: [...ALLOWED_TAGS] },
        { status: 400 }
      );
    }

    await revalidateCmsCache(
      normalized === "all" ? "all" : (normalized as CmsCacheTag)
    );

    return NextResponse.json({
      message: "Cache invalidated successfully",
      revalidated: true,
      tag: normalized,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Error revalidating cache:", error);
    return NextResponse.json(
      { message: "Error revalidating cache", revalidated: false },
      { status: 500 }
    );
  }
}
