import type { Metadata } from "next";
import { Jost } from "next/font/google";
import VariantChrome from "@/components/variants/VariantChrome";
import { analogReset } from "@/components/variants/analogReset";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-v9",
  display: "swap",
});

export const metadata: Metadata = { title: "Variant 09, Plotted" };

const palette = `
.v9-scope {
  --paper: #1b3cb8;
  --ink: #f4f6ff;
  --ink-2: #cfd8ff;
  --pen: #ffd23f;
  --v-bar-bg: rgba(27,60,184,0.88);
  --v-bar-line: rgba(244,246,255,0.25);
  --v-bar-dim: #dfe5ff;
  --v-bar-accent: #ffd23f;
}
.v9-scope ::selection { background: #ffd23f; color: #1b3cb8; }
.v9-scope :focus-visible { outline: 2px solid #ffd23f; outline-offset: 3px; }
${analogReset}`;

export default function Variant9Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${jost.variable} v9-scope min-h-screen bg-[var(--paper)] font-[family-name:var(--font-v9)] text-[var(--ink)]`}
    >
      <style dangerouslySetInnerHTML={{ __html: palette }} />
      <VariantChrome n="09" name="Plotted" />
      {children}
    </div>
  );
}
