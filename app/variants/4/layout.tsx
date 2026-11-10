import type { Metadata } from "next";
import VariantChrome from "@/components/variants/VariantChrome";

export const metadata: Metadata = {
  title: "Variant 04 — Terminal / Systems",
};

/* Runs entirely on JetBrains Mono (--font-mono), already loaded by the root layout. */
const palette = `
.v4-scope {
  --bg: #0a0e0a;
  --panel: #0f140f;
  --fg: #b8f5b0;
  --green: #4af626;
  --amber: #f5b544;
  --dim: #5f6b5c;
  --line: #1e2a1c;
  --v-bar-bg: rgba(10,14,10,0.7);
  --v-bar-line: #1e2a1c;
  --v-bar-dim: #5f6b5c;
  --v-bar-accent: #4af626;
}
.v4-scope ::selection { background: #4af626; color: #0a0e0a; }`;

export default function Variant4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="v4-scope min-h-screen bg-[var(--bg)] font-mono text-[var(--fg)]">
      <style>{palette}</style>
      {/* Subtle CRT scanline wash — one static gradient, no animation. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[65] opacity-[0.35] [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0px,rgba(0,0,0,0.25)_1px,transparent_1px,transparent_3px)]"
      />
      <VariantChrome n="04" name="Terminal / Systems" />
      {children}
    </div>
  );
}
