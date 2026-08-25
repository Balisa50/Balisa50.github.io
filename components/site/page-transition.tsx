"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Page transition, used from app/template.tsx so it remounts on every route
 * change.
 *
 * Kept to a short opacity and translate on enter, with no exit animation. An
 * exit animation on an App Router transition means the new page cannot paint
 * until the old one has finished leaving, which turns a fast navigation into a
 * slow one to no benefit. Six pages that fade in is a transition; a page that
 * waits 300ms to start is a regression.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
