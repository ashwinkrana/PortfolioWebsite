import type { Config } from "tailwindcss";

/**
 * ASHWIN RANA — DESIGN SYSTEM
 * Elite motorsport meets modern digital. Two colours do the work:
 * carbon (the void) and ember (the signal). Everything else is a tint of carbon.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        /* The homepage's scroll-pinned Work section drops to a plain grid when motion is off or the window is too short to pin it. */
        stack: { raw: "(prefers-reduced-motion: reduce), (max-height: 599px)" },
      },
      colors: {
        /* Core surfaces — true black up through gunmetal grey */
        carbon: {
          DEFAULT: "#0E0E10", // page background
          900: "#08080A", // deepest — loader / footer / overlays
          800: "#0E0E10",
          700: "#16161A", // raised cards
          600: "#1E1E23", // hairlines on dark
          500: "#2B2B31", // borders / dividers
          400: "#3C3C44", // strokes / muted strokes
        },
        /* The signal — soft, dusty red */
        ember: {
          DEFAULT: "#E05B4E",
          300: "#F5A79E",
          400: "#EC796B",
          500: "#E05B4E",
          600: "#BF4438",
          700: "#8F3A31",
        },
        /* Text ramp — neutral greys, no warmth */
        chalk: {
          DEFAULT: "#EDEDEF",
          muted: "#9A9AA3",
          dim: "#6E6E78",
        },
        /* Reserved for critical / DRS-style states */
        flare: "#FF7A45",
      },
      fontFamily: {
        display: ["var(--font-display)", "Archivo", "Impact", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        /* Fluid display scale — hero type that never breaks the viewport */
        mega: ["clamp(3rem, 13vw, 12rem)", { lineHeight: "0.82", letterSpacing: "-0.04em" }],
        giga: ["clamp(4rem, 18vw, 18rem)", { lineHeight: "0.78", letterSpacing: "-0.05em" }],
        roster: ["clamp(1.5rem, 4.4vw, 3.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "roster-minor": ["clamp(1.25rem, 3vw, 2.5rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        telemetry: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      letterSpacing: {
        telemetry: "0.22em",
        wide: "0.08em",
      },
      borderRadius: {
        none: "0px", // motorsport = hard edges by default
      },
      boxShadow: {
        ember: "0 0 0 1px #E05B4E, 0 0 44px -8px rgba(224,91,78,0.65)",
        lift: "0 32px 80px -24px rgba(0,0,0,0.9)",
      },
      transitionTimingFunction: {
        /* Snappy out, heavy in — the "expensive machinery" curve */
        drs: "cubic-bezier(0.16, 1, 0.3, 1)",
        brake: "cubic-bezier(0.85, 0, 0.15, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        scanline: {
          "0%,100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        orbit: {
          from: { transform: "rotateX(18deg) rotateY(0deg)" },
          to: { transform: "rotateX(18deg) rotateY(360deg)" },
        },
        /* Gyroscope: three rings, three axes, three speeds. */
        gyro1: {
          from: { transform: "rotateX(74deg) rotateY(0deg)" },
          to: { transform: "rotateX(74deg) rotateY(360deg)" },
        },
        gyro2: {
          from: { transform: "rotateY(68deg) rotateZ(0deg)" },
          to: { transform: "rotateY(68deg) rotateZ(360deg)" },
        },
        gyro3: {
          from: { transform: "rotateX(26deg) rotateZ(0deg)" },
          to: { transform: "rotateX(26deg) rotateZ(-360deg)" },
        },
        pulse2: {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.6)", opacity: "0.35" },
        },
      },
      animation: {
        marquee: "marquee 26s linear infinite",
        "marquee-fast": "marquee 14s linear infinite",
        scanline: "scanline 2.4s ease-in-out infinite",
        "spin-slow": "spinSlow 14s linear infinite",
        orbit: "orbit 26s linear infinite",
        gyro1: "gyro1 9s linear infinite",
        gyro2: "gyro2 13s linear infinite",
        gyro3: "gyro3 18s linear infinite",
        pulse2: "pulse2 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
