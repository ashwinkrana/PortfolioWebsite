import type { Metadata } from "next";
import { Fraunces, Newsreader } from "next/font/google";
import VariantChrome from "@/components/variants/VariantChrome";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-v6-serif",
  display: "swap",
});

const body = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-v6-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Variant 06 — Dusk Broadsheet",
};

/**
 * Same dusk-gradient world as Variant 01, carried through Impeccable's
 * craft floor: a touch more contrast in the muted ramp, one accent, no
 * second colour. The composition below drops the glass-card scaffold in
 * favour of a broadsheet — hairlines, a masthead, running text.
 */
const palette = `
.v6-scope {
  background-color: #170e27;
  background-image:
    radial-gradient(50% 40% at 18% 8%, rgba(246,239,230,0.08), transparent 60%),
    radial-gradient(42% 32% at 88% 4%, rgba(234,169,125,0.14), transparent 62%),
    radial-gradient(130% 85% at 50% 122%, #d98a5c 0%, #7b4f9e 36%, #2c1a4d 64%, #170e27 100%);
  background-attachment: fixed;
  background-repeat: no-repeat;
  --bg: #170e27;
  --fg: #f6efe6;
  --muted: #d3c7e6;
  --dim: #a999c4;
  --line: rgba(246,239,230,0.16);
  --line-strong: rgba(246,239,230,0.32);
  --accent: #eaa97d;
  --v-bar-bg: rgba(23,14,39,0.6);
  --v-bar-line: rgba(246,239,230,0.14);
  --v-bar-dim: #d3c7e6;
  --v-bar-accent: #eaa97d;
}
.v6-scope ::selection { background: #eaa97d; color: #170e27; }
.v6-scope { caret-color: #eaa97d; }`;

export default function Variant6Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${serif.variable} ${body.variable} v6-scope min-h-screen bg-[var(--bg)] font-[family-name:var(--font-v6-body)] text-[var(--fg)]`}
    >
      <style>{palette}</style>
      <VariantChrome n="06" name="Dusk Broadsheet" />
      {children}
    </div>
  );
}
