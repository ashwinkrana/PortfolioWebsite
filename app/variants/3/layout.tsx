import type { Metadata } from "next";
import VariantChrome from "@/components/variants/VariantChrome";

export const metadata: Metadata = {
  title: "Variant 03 — Brutalist Mono",
};

/*
 * No new font import — this variant runs on the two faces the root layout
 * already loads: Archivo (--font-display) for the slab headlines and
 * JetBrains Mono (--font-mono) for everything else.
 */
const palette = `
.v3-scope {
  --bg: #ffffff;
  --fg: #000000;
  --muted: #555555;
  --line: #000000;
  --hairline: #cccccc;
  --accent: #e05b4e;
  --v-bar-bg: #000000;
  --v-bar-line: #000000;
  --v-bar-dim: #ffffff;
  --v-bar-accent: #e05b4e;
}`;

export default function Variant3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="v3-scope min-h-screen bg-[var(--bg)] font-mono text-[var(--fg)]">
      <style>{palette}</style>
      <VariantChrome n="03" name="Brutalist Mono" />
      {children}
    </div>
  );
}
