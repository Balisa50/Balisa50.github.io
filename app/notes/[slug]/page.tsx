import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { PageHeader } from "@/components/site/page-header";
import { noteSlugs, readNote } from "@/lib/mdx";
import { getMetrics } from "@/lib/metrics";
import { mdxComponents } from "@/components/mdx";

export const revalidate = 3600;

export function generateStaticParams() {
  return noteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = readNote(slug);
  if (!note) return {};
  return { title: note.meta.title, description: note.meta.lede };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = readNote(slug);
  if (!note) notFound();

  // Notes have no project of their own, so the slug bound into the component
  // map is the note's. `<Architecture />` in a note would need its own JSON in
  // data/architecture, which is the correct constraint.
  const metrics = await getMetrics();
  const { content } = await compileMDX({
    source: note.source,
    components: mdxComponents({ slug, metrics })
  });

  return (
    <>
      <PageHeader
        eyebrow={note.meta.kind}
        title={note.meta.title}
        lede={note.meta.lede}
        back={{ href: "/infra", label: "Infrastructure" }}
      />

      <article className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="prose-note">{content}</div>
        {note.meta.updated && (
          <p className="mt-16 border-t border-rule pt-5 font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
            Last revised {note.meta.updated}
          </p>
        )}
      </article>
    </>
  );
}
