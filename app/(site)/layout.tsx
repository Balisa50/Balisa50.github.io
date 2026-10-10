import { Nav } from "@/components/Nav";
import { MobileWordmark } from "@/components/MobileWordmark";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";

/**
 * Chrome shared by the intro page and the five routes.
 *
 * This is a route group, so it adds nothing to the URL. It exists because the
 * nav and the footer belong on /, /work, /papers, /build-log, /about and
 * /contact and on nothing else. They deliberately do NOT belong on
 * /case-studies/<slug>, which is chrome-free so a study can be shared on its
 * own, so this cannot move up into the root layout.
 *
 * Two navs live here. The top Nav is desktop-only; the BottomNav is
 * mobile-only. Both break on the same `md` boundary so a tablet or phone
 * never sees both at once.
 *
 * main gets bottom padding on mobile so the last section clears the fixed
 * bottom nav. On desktop the padding is removed and the footer sits normally.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MobileWordmark />
      <Nav />
      <main
        id="main"
        className="relative flex flex-1 flex-col pb-20 md:pb-0"
      >
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
