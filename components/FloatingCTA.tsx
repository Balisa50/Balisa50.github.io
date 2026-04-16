"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useIdleCTA } from "@/hooks/useIdleCTA";

const DISMISS_KEY = "portfolio-idle-cta-dismissed";

export function FloatingCTA() {
  const idle = useIdleCTA(12_000);
  const [dismissed, setDismissed] = useState(true); // start dismissed → prevents flash

  useEffect(() => {
    // Respect prior dismissals within a session
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const visible = idle && !dismissed;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore storage errors */
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-full border border-cyan/40 bg-black/80 pl-5 pr-2 py-2 shadow-glow-cyan backdrop-blur-md"
        >
          <MessageCircle className="h-4 w-4 text-cyan" aria-hidden="true" />
          <a
            href="#contact"
            onClick={dismiss}
            className="min-h-[36px] py-1 text-sm font-medium text-white focus-visible:outline-none"
          >
            Still here? <span className="text-cyan">Let&apos;s talk →</span>
          </a>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
