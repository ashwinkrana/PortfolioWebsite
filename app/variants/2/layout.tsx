import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import VariantChrome from "@/components/variants/VariantChrome";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-v2-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Variant 02 — Bento Light",
};

const palette = `
.v2-scope {
  --bg: #f1efe9;
  --card: #ffffff;
  --ink: #17150f;
  --muted: #6b675c;
  --line: #dfdbcf;
  --lilac: #cdbcf2;
  --lilac-ink: #2a1c4d;
  --mint: #a9e2cb;
  --mint-ink: #0f3a2b;
  --peach: #f6c9a4;
  --peach-ink: #4d2a12;
  --sky: #a9d2ee;
  --sky-ink: #143142;
  --ink-card: #17150f;
  --v-bar-bg: rgba(241,239,233,0.75);
  --v-bar-line: #dfdbcf;
  --v-bar-dim: #6b675c;
  --v-bar-accent: #7a4de0;
}`;

export default function Variant2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${grotesk.variable} v2-scope min-h-screen bg-[var(--bg)] font-[family-name:var(--font-v2-grotesk)] text-[var(--ink)]`}
    >
      <style>{palette}</style>
      <VariantChrome n="02" name="Bento Light" />
      {children}
    </div>
  );
}
