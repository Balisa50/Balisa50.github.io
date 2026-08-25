import { PageTransition } from "@/components/site/page-transition";

/**
 * A template rather than a layout, because it remounts on every navigation,
 * which is the whole point: the enter animation has to replay per route.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
