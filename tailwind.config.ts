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
      colors: {
        background: "#050505",
        surface: "#0A0A0A",
        card: "rgba(10, 10, 10, 0.7)",
        border: "#1A1A1A",
        cyan: {
          DEFAULT: "#00F0FF",
          dark: "#00B8CC"
        },
        pink: "#FF0055",
        text: {
          DEFAULT: "#FFFFFF",
          secondary: "#A0A0A0"
        },
        status: {
          live: "#00FF88",
          progress: "#FFB800",
          planning: "#666666"
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
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite"
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
        "glow-cyan": "0 0 40px -10px rgba(0, 240, 255, 0.4)",
        "glow-cyan-lg": "0 0 60px -5px rgba(0, 240, 255, 0.6)",
        "card": "0 4px 24px -4px rgba(0, 0, 0, 0.6)"
      }
    }
  },
  plugins: []
};

export default config;
