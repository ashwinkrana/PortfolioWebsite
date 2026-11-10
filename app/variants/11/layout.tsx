import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import VariantChrome from "@/components/variants/VariantChrome";
import { analogReset } from "@/components/variants/analogReset";
import { glassCss } from "@/components/variants/signal/glassCss";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-v11-display",
  display: "swap",
});

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-v11-body",
  display: "swap",
});

export const metadata: Metadata = { title: "Variant 11, Aurora Rack" };

const palette = `
.v11-scope {
  --vd: var(--font-v11-display);
  --ground: #070b12;
  --fg: #f2f6fa;
  --fg2: #c3cfd9;
  --glass-bg: linear-gradient(145deg, rgba(255,255,255,.13), rgba(255,255,255,.04));
  --glass-solid: #18212c;
  --glass-line: rgba(255,255,255,.16);
  --glass-hi: rgba(255,255,255,.26);
  --glass-shadow: rgba(0,4,12,.42);
  --glass-blur: 26px;
  --glass-r: 20px;
  --glass-lit: rgba(242,183,5,.75);
  --glass-lit-soft: rgba(242,183,5,.16);
  --spot: rgba(255,255,255,.14);
  --field-bg: rgba(4,8,14,.42);
  --nav-on: rgba(255,255,255,.18);
  --jack: #05080d;
  --jack-ring: rgba(255,255,255,.34);
  --c1: #f2b705; --c2: #1cc7c7; --c3: #f0568a; --c4: #ff8a33;
  --dead: #4a5560;
  --ok: #35d07f; --ok-text: #6fe3a6;
  --bad: #ff5a4f; --bad-soft: rgba(255,90,79,.2); --bad-text: #ff9a92;
  --hot: #f2b705; --led-off: rgba(255,255,255,.22);
  --cta: #f2f6fa; --cta-shine: #ffd968; --cta-fg: #0a0f16;
  --v-bar-bg: rgba(7,11,18,.55);
  --v-bar-line: rgba(255,255,255,.12);
  --v-bar-dim: #c3cfd9;
  --v-bar-accent: #f2b705;
}
.v11-scope ::selection { background: #f2b705; color: #0a0f16; }
.v11-scope :focus-visible { outline: 2px solid #f2b705; outline-offset: 3px; }
${glassCss}
${analogReset}`;

export default function Variant11Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${body.variable} v11-scope min-h-screen bg-[var(--ground)] font-[family-name:var(--font-v11-body)] text-[var(--fg)]`}
    >
      <style dangerouslySetInnerHTML={{ __html: palette }} />
      <VariantChrome n="11" name="Aurora Rack" />
      {children}
    </div>
  );
}
