import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import VariantChrome from "@/components/variants/VariantChrome";
import { analogReset } from "@/components/variants/analogReset";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-v8-display",
  display: "swap",
});

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-v8-body",
  display: "swap",
});

export const metadata: Metadata = { title: "Variant 08, Signal Path" };

const palette = `
.v8-scope {
  --rack: #17191c;
  --rail: #24272b;
  --plate: #d9dbd6;
  --ink: #15171a;
  --ink-2: #474b4f;
  --c1: #f2b705;
  --c2: #12a5a5;
  --c3: #e8457a;
  --c4: #ff7a1a;
  --dead: #5b5f63;
  --ok: #1f9d4d;
  --bad: #d92d20;
  --v-bar-bg: rgba(23,25,28,0.85);
  --v-bar-line: rgba(217,219,214,0.16);
  --v-bar-dim: #c3c6c0;
  --v-bar-accent: #f2b705;
}
.v8-scope ::selection { background: #f2b705; color: #15171a; }
.v8-scope :focus-visible { outline: 2px solid #ff7a1a; outline-offset: 2px; }
${analogReset}`;

export default function Variant8Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${body.variable} v8-scope min-h-screen bg-[var(--rack)] font-[family-name:var(--font-v8-body)] text-[var(--ink)]`}
    >
      <style dangerouslySetInnerHTML={{ __html: palette }} />
      <VariantChrome n="08" name="Signal Path" />
      {children}
    </div>
  );
}
