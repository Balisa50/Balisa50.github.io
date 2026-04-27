import { NextResponse } from "next/server";
import { PROJECTS } from "@/lib/projects";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const payload = {
    name: "balisa.dev",
    updatedAt: new Date().toISOString(),
    projects: Object.fromEntries(
      PROJECTS.map((p) => [
        p.slug,
        p.status === "live"
          ? "live"
          : p.progress != null
          ? p.progress
          : p.status
      ])
    )
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
