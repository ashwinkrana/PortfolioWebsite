import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import VariantChrome from "@/components/variants/VariantChrome";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-v7-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Variant 07 — Dusk Manifesto",
};

/**
 * A second pass at the Editorial Dusk world (v1), this time run through
 * tasteskill.dev's anti-slop rules: a cooler indigo-to-rose gradient (not
 * v6's peach), Cormorant Garamond instead of Fraunces (the skill bans the
 * latter as an LLM default), body copy stays on the site's own Inter, and
 * the composition is an asymmetric split rather than v6's masthead.
 */
const palette = `
.v7-scope {
  background-color: #150c22;
  background-image:
    radial-gradient(46% 38% at 82% 8%, rgba(201,123,156,0.20), transparent 62%),
    radial-gradient(38% 30% at 8% 4%, rgba(243,236,226,0.07), transparent 60%),
    radial-gradient(120% 70% at 50% 128%, #6b3f5c 0%, #33204a 42%, #150c22 78%);
  background-attachment: fixed;
  --bg: #150c22;
  --fg: #f3ece2;
  --muted: #cabfe0;
  --dim: #9c8fb8;
  --line: rgba(243,236,226,0.14);
  --line-strong: rgba(243,236,226,0.28);
  --accent: #c97b9c;
  --v-bar-bg: rgba(21,12,34,0.6);
  --v-bar-line: rgba(243,236,226,0.12);
  --v-bar-dim: #cabfe0;
  --v-bar-accent: #c97b9c;
}
.v7-scope ::selection { background: #c97b9c; color: #150c22; }
.v7-scope { caret-color: #c97b9c; }`;

export default function Variant7Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${serif.variable} v7-scope min-h-screen bg-[var(--bg)] font-sans text-[var(--fg)]`}
    >
      <style>{palette}</style>
      <VariantChrome n="07" name="Dusk Manifesto" />
      {children}
    </div>
  );
}
