import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "cc-deep": "#04060c",
        "cc-elevated": "#0a0f1a",
        "cc-surface": "#111827",
        cobalt: "#3b82f6",
        "cc-star": "#fbbf24",
        "cc-star-dim": "#d97706",
        "entity-cem": "#22d3ee",
        "entity-cem-muted": "#14b8a6",
        "entity-cybercrow": "#8b5cf6",
        "entity-cybercrow-muted": "#6366f1",
        "entity-sarea": "#fb7185",
        "entity-sarea-muted": "#fbbf24",
        crow: {
          DEFAULT: "#0f1419",
          feather: "#1a2332",
          wing: "#252f3f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        cc: "18px",
        "cc-md": "12px",
        "cc-sm": "8px",
      },
      boxShadow: {
        "cc-glow": "0 0 0 1px rgba(34, 211, 238, 0.08), 0 0 48px rgba(37, 99, 235, 0.12)",
        "cc-glow-cem": "0 0 0 1px rgba(34, 211, 238, 0.12), 0 0 48px rgba(20, 184, 166, 0.15)",
        "cc-glow-cybercrow": "0 0 0 1px rgba(139, 92, 246, 0.12), 0 0 48px rgba(99, 102, 241, 0.18)",
        "cc-glow-sarea": "0 0 0 1px rgba(251, 113, 133, 0.12), 0 0 48px rgba(251, 191, 36, 0.12)",
        "cc-star": "0 0 24px rgba(251, 191, 36, 0.35)",
      },
      backgroundImage: {
        "cc-hero": "linear-gradient(135deg, #4f46e5 0%, #22d3ee 48%, #14b8a6 100%)",
        "cc-hero-cem": "linear-gradient(135deg, #0891b2 0%, #22d3ee 45%, #14b8a6 100%)",
        "cc-hero-cybercrow": "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 48%, #6366f1 100%)",
        "cc-hero-sarea": "linear-gradient(135deg, #f43f5e 0%, #fb7185 42%, #fbbf24 100%)",
        "cc-radial-star":
          "radial-gradient(ellipse 70% 50% at 50% -15%, rgba(251, 191, 36, 0.12), transparent 55%)",
      },
      animation: {
        "cc-pulse-soft": "cc-pulse-soft 4s ease-in-out infinite",
        "cc-fade-up": "cc-fade-up 0.45s ease-out both",
        "cc-live-pulse": "cc-live-pulse 2s ease-in-out infinite",
        "cc-spin-slow": "cc-spin-slow 1.2s linear infinite",
      },
      keyframes: {
        "cc-pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "cc-fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "cc-live-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 211, 238, 0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(34, 211, 238, 0.12)" },
        },
        "cc-spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
