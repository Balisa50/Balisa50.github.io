import type { Config } from "tailwindcss";

/**
 * Light editorial palette.
 *
 * History of this file: it began as neon cyan and hot pink over pure black,
 * became neutral greys over near-black when the cinematic layer came off, and
 * is now light. The through-line is that the work should carry the page, so
 * each pass has removed something that was competing with it.
 *
 * Monochrome plus one blue, on warm-ish off-white rather than pure #FFF, which
 * is harsh over a long read. Every colour here is a token: components no longer
 * hardcode `text-white` or `border-white/10`, because that coupling is what
 * made the dark-to-light switch a 14-file edit instead of a config change.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF9",
        // A half-step down from the page, for the rare block that needs to sit
        // back. Never used as a card fill.
        surface: "#F4F4F2",
        card: "#F4F4F2",

        // Two hairline weights: one to separate rows, one to separate sections.
        border: "#E7E5E4",
        rule: "#E7E5E4",
        "rule-strong": "#D6D3D1",

        // Type ramp. `ink` is reserved for display type and anything that must
        // read as the darkest thing on the page.
        ink: "#0C0A09",
        text: {
          DEFAULT: "#1C1917",
          secondary: "#57534E",
          faint: "#A8A29E"
        },

        // One accent, used for links and the single primary action. Passes AA
        // on the background at body size.
        accent: {
          DEFAULT: "#1D4ED8",
          soft: "#EFF4FF"
        },
        // Kept so older components compile; both now resolve to the one accent.
        cyan: { DEFAULT: "#1D4ED8", dark: "#1E40AF" },
        pink: "#57534E",

        status: {
          live: "#15803D",
          progress: "#B45309",
          planning: "#78716C"
        }
      },
      fontFamily: {
        // Inter for interface and body, a serif for display. The generator
        // proposed Playfair as the BODY face, which is a display serif and
        // unreadable at paragraph length; the roles are swapped here.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"]
      },
      maxWidth: {
        // One measure for prose, one for the page shell. Everything aligns to
        // these two, which is most of what "properly aligned" means here.
        prose: "68ch",
        shell: "1120px"
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "glow-pulse": "none",
        float: "none"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      boxShadow: {
        "glow-cyan": "none",
        "glow-cyan-lg": "none",
        card: "none"
      }
    }
  },
  plugins: []
};

export default config;
