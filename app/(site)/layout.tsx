import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/**
 * Chrome shared by the five public routes and the intro page.
 *
 * This is a route group, so it adds nothing to the URL. It exists because the
 * nav and the footer belong on /, /work, /papers, /stack, /about and /contact
 * and on nothing else. They deliberately do NOT belong on /case-studies/<slug>,
 * which is chrome-free so a study can be shared on its own, so this cannot move
 * up into the root layout.
 *
 * `id="main"` lives here rather than in each page, because SkipLink targets it
 * and there must be exactly one per document.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main" className="relative flex flex-col">
        {children}
        <Footer />
      </main>
    </>
  );
}
