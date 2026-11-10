import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import VariantChrome from "@/components/variants/VariantChrome";
import { analogReset } from "@/components/variants/analogReset";

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-v10",
  display: "swap",
});

export const metadata: Metadata = { title: "Variant 10, Field Binder" };

const palette = `
.v10-scope {
  --board: #6b756e;
  --sheet: #f3f5f0;
  --ink: #1c2023;
  --ink-2: #4a5156;
  --hi: #ffe94a;
  --t-work: #ff6a2b;
  --t-experience: #2447e0;
  --t-toolkit: #16a673;
  --t-education: #ef6aa6;
  --t-contact: #ffc400;
  --v-bar-bg: rgba(28,32,35,0.88);
  --v-bar-line: rgba(243,245,240,0.16);
  --v-bar-dim: #d5d9d2;
  --v-bar-accent: #ffe94a;
}
.v10-scope ::selection { background: #ffe94a; color: #1c2023; }
.v10-scope :focus-visible { outline: 2px solid #2447e0; outline-offset: 2px; }
${analogReset}`;

export default function Variant10Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${grotesk.variable} v10-scope min-h-screen bg-[var(--board)] font-[family-name:var(--font-v10)] text-[var(--ink)]`}
    >
      <style dangerouslySetInnerHTML={{ __html: palette }} />
      <VariantChrome n="10" name="Field Binder" />
      {children}
    </div>
  );
}
