import type { Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import Cursor from "@/components/Cursor";
import { ScrollProgress } from "@/components/ScrollFX";

/** Archive of design explorations. Redirected to the homepage in production (next.config.mjs). */

const display = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0E0E10",
  colorScheme: "dark",
};

export default function VariantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} font-sans`}>
      <ScrollProgress />
      <Cursor />
      {children}
    </div>
  );
}
