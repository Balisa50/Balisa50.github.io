import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Deploy to a VPS with Coolify in five minutes",
  description:
    "The actual steps: a droplet, one install command, connect GitHub, point Coolify at the Dockerfile, add a domain. Written for someone who has never administered a server."
};

/**
 * The guide is docs/DEPLOY-COOLIFY.md, rendered here.
 *
 * One file, two audiences. Someone who cloned the repository reads it in the
 * repository; someone who found the site reads it here. Keeping the guide in
 * markdown next to the Dockerfile it describes is also what makes it likely to
 * be updated when the Dockerfile changes.
 */
export default async function DeployGuidePage() {
  const source = fs.readFileSync(path.join(process.cwd(), "docs", "DEPLOY-COOLIFY.md"), "utf8");

  // The markdown file opens with its own H1 and a lede paragraph, both of which
  // the page header already renders. Drop them rather than print them twice.
  const body = source.replace(/^#\s.*\n(?:\n?>.*\n)*/, "");

  const { content } = await compileMDX({ source: body });

  return (
    <>
      <PageHeader
        eyebrow="Guide"
        title="Deploy to a VPS with Coolify in five minutes"
        lede="Written while doing it, for someone who has only ever deployed by connecting a GitHub repository to a platform. Five minutes is the hands-on time. The DNS wait is not included and is the part that will actually make you impatient."
        back={{ href: "/infra", label: "Infrastructure" }}
      />

      <article className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="prose-note">{content}</div>
      </article>
    </>
  );
}
