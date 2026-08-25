import { NextResponse } from "next/server";
import { getMetrics } from "@/lib/metrics";

/**
 * The probe results as JSON.
 *
 * force-static so this route builds on all three targets: on the static export
 * it becomes a file generated once at build time, and on a server it is an ISR
 * cache entry refreshed on the hour. Either way a page view costs no outbound
 * requests, which matters when the box has one vCPU.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const metrics = await getMetrics();

  return NextResponse.json(metrics, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
