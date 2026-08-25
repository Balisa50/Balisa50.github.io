import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Every page except the home page opens the same way: an eyebrow, a serif
 * title, and one paragraph that says what the page is for. Consistency here is
 * what makes six pages read as one site rather than six.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  back,
  children
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-rule pb-10 pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-shell px-6 sm:px-10">
        {back && (
          <Link
            href={back.href}
            className="mb-6 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.11em] text-text-secondary transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <p className="label">{eyebrow}</p>
        <h1 className="display mt-3 text-[clamp(2rem,1.3rem+2.8vw,3.1rem)]">{title}</h1>
        {lede && <p className="measure mt-5 text-[1.0625rem] leading-relaxed text-text-secondary">{lede}</p>}
        {children}
      </div>
    </header>
  );
}
