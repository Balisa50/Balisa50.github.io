import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/**
 * Chrome shared by the intro page and the five routes.
 *
 * This is a route group, so it adds nothing to the URL. It exists because the
 * nav and the footer belong on /, /work, /papers, /stack, /about and /contact
 * and on nothing else. They deliberately do NOT belong on /case-studies/<slug>,
 * which is chrome-free so a study can be shared on its own, so this cannot move
 * up into the root layout.
 *
 * The column is `min-h-dvh` with the main pane on `flex-1`, which is what keeps
 * the footer at the bottom of the window on a short page. Without it the footer
 * sat immediately under the content and left the rest of the screen empty, so
 * on /stack it landed halfway up the page looking like the page had broken off
 * mid-thought. Splitting the page into routes is what exposed this: every route
 * used to be a section of one long document that was always taller than the
 * window, so nothing was ever short enough for it to show.
 *
 * Footer is a sibling of main rather than a child of it, which is also the more
 * honest markup: it is not part of the main content of the document.
 *
 * `id="main"` lives here rather than in each page, because SkipLink targets it
 * and there must be exactly one per document.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Nav />
      <main id="main" className="relative flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
