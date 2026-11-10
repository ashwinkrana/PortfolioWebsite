import type { Metadata } from "next";
import { Red_Hat_Display, Red_Hat_Text } from "next/font/google";
import VariantChrome from "@/components/variants/VariantChrome";
import { analogReset } from "@/components/variants/analogReset";
import { glassCss } from "@/components/variants/signal/glassCss";

const display = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-v13-display",
  display: "swap",
});

const body = Red_Hat_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-v13-body",
  display: "swap",
});

export const metadata: Metadata = { title: "Variant 13, Prism Deck" };

const palette = `
.v13-scope {
  --vd: var(--font-v13-display);
  --ground: #2a0f33;
  --fg: #fff7f2;
  --fg2: #f1dcd6;
  --glass-bg: linear-gradient(145deg, rgba(26,12,30,.56), rgba(26,12,30,.68));
  --glass-solid: #2c1730;
  --glass-line: rgba(255,255,255,.2);
  --glass-hi: rgba(255,255,255,.3);
  --glass-shadow: rgba(30,4,30,.4);
  --glass-blur: 30px;
  --glass-r: 22px;
  --glass-lit: rgba(255,214,102,.85);
  --glass-lit-soft: rgba(255,214,102,.16);
  --spot: rgba(255,235,210,.16);
  --field-bg: rgba(18,6,22,.5);
  --nav-on: rgba(255,255,255,.2);
  --jack: #12061a;
  --jack-ring: rgba(255,255,255,.4);
  --c1: #ffd666; --c2: #37d6d0; --c3: #ff6fa3; --c4: #ffa057;
  --dead: #6d5a72;
  --ok: #5ff0a6; --ok-text: #8ff5bf;
  --bad: #ff5a4f; --bad-soft: rgba(255,90,79,.22); --bad-text: #ffb0a8;
  --hot: #ffd666; --led-off: rgba(255,255,255,.25);
  --cta: #fff7f2; --cta-shine: #ffd666; --cta-fg: #2a0f33;
  --v-bar-bg: rgba(42,15,51,.5);
  --v-bar-line: rgba(255,255,255,.16);
  --v-bar-dim: #f1dcd6;
  --v-bar-accent: #ffd666;
}
.v13-scope ::selection { background: #ffd666; color: #2a0f33; }
.v13-scope :focus-visible { outline: 2px solid #ffd666; outline-offset: 3px; }
${glassCss}
${analogReset}`;

export default function Variant13Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${body.variable} v13-scope min-h-screen bg-[var(--ground)] font-[family-name:var(--font-v13-body)] text-[var(--fg)]`}
    >
      <style dangerouslySetInnerHTML={{ __html: palette }} />
      <VariantChrome n="13" name="Prism Deck" />
      {children}
    </div>
  );
}
