import { NextResponse } from "next/server";
import { fetchAllStars } from "@/lib/github";

export const revalidate = 3600; // cache for 1h at the route level

export async function GET() {
  try {
    const stars = await fetchAllStars();
    return NextResponse.json(
      { stars, fetchedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
        }
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        stars: [],
        error: "github_unreachable",
        message: err instanceof Error ? err.message : "unknown"
      },
      { status: 200 } // deliberately 200, client falls back silently
    );
  }
}
