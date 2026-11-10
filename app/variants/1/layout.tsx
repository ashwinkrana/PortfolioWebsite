import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import VariantChrome from "@/components/variants/VariantChrome";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-v1-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Variant 01 — Editorial Dusk",
};

/* Palette + chrome-bar tokens, scoped to this variant only. */
const palette = `
.v1-scope {
  background-color: #170e27;
  background-image:
    radial-gradient(50% 40% at 18% 10%, rgba(245,237,228,0.10), transparent 60%),
    radial-gradient(42% 32% at 88% 6%, rgba(232,169,127,0.16), transparent 62%),
    radial-gradient(130% 85% at 50% 122%, #d98a5c 0%, #7b4f9e 36%, #2c1a4d 64%, #170e27 100%);
  background-attachment: fixed;
  --bg: #170e27;
  --fg: #f5ede4;
  --muted: #c8bcd8;
  --dim: #9385aa;
  --line: rgba(245,237,228,0.14);
  --glass: rgba(245,237,228,0.06);
  --glass-line: rgba(245,237,228,0.16);
  --accent: #e8a97f;
  --v-bar-bg: rgba(23,14,39,0.6);
  --v-bar-line: rgba(245,237,228,0.12);
  --v-bar-dim: #c8bcd8;
  --v-bar-accent: #e8a97f;
}`;

export default function Variant1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${serif.variable} v1-scope bg-[var(--bg)] text-[var(--fg)]`}>
      <style>{palette}</style>
      <VariantChrome n="01" name="Editorial Dusk" />
      {children}
    </div>
  );
}
