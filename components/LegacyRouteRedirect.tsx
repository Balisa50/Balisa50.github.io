"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Sends a retired route to the one that replaced it.
 *
 * There is no server on GitHub Pages to answer with a 301, so the redirect has
 * to happen in the browser. `replace` rather than `push`, so Back leaves the
 * site instead of bouncing off the dead URL and forward again.
 */
export function LegacyRouteRedirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return null;
}
