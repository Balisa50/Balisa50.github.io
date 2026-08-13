import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      // Neutral greys and one restrained accent. The previous palette was
      // neon cyan and hot pink over pure black with glow shadows, which reads
      // as a themed showcase rather than an engineer's portfolio. Token names
      // are kept so every existing component keeps compiling; only the values
      // move. `cyan` is now a muted steel blue and `pink` is a warm grey, so
      // the per-project accent field neutralises itself without a rewrite.
      colors: {
        background: "#0B0B0C",
        surface: "#131315",
        card: "rgba(19, 19, 21, 0.7)",
        border: "#232326",
        cyan: {
          DEFAULT: "#7FA6D9",
          dark: "#5B82B0"
        },
        pink: "#A8A29E",
        text: {
          DEFAULT: "#FAFAFA",
          secondary: "#A1A1AA"
        },
        status: {
          live: "#6EA97F",
          progress: "#C9A227",
          planning: "#71717A"
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"]
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px"
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        // Kept as no-ops so any component still referencing them compiles and
        // simply stops pulsing or drifting, rather than needing a sweep.
        "glow-pulse": "none",
        "float": "none"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6", filter: "blur(20px)" },
          "50%": { opacity: "1", filter: "blur(28px)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      boxShadow: {
        // The glows were the loudest thing on the page. Neutralised rather
        // than deleted so existing class names stay valid.
        "glow-cyan": "none",
        "glow-cyan-lg": "none",
        "card": "0 1px 2px 0 rgba(0, 0, 0, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
