import type { Metadata } from "next";
import VariantChrome from "@/components/variants/VariantChrome";

export const metadata: Metadata = {
  title: "Variant 05 — Kinetic Carbon+",
};

/*
 * Stays inside the live design system — carbon/ember tokens from
 * tailwind.config.ts, Archivo via --font-display. Only the chrome-bar
 * custom properties are declared here.
 */
const palette = `
.v5-scope {
  --v-bar-bg: rgba(8,8,10,0.7);
  --v-bar-line: #1e1e23;
  --v-bar-dim: #9a9aa3;
  --v-bar-accent: #e05b4e;
}`;

export default function Variant5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="v5-scope min-h-screen bg-carbon text-chalk">
      <style>{palette}</style>
      <VariantChrome n="05" name="Kinetic Carbon+" />
      {children}
    </div>
  );
}
