import { Manrope } from "next/font/google";
import { glassCss } from "@/components/variants/signal/glassCss";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-site",
  display: "swap",
});

const palette = `
html, body { background: #cdeaf0; background-image: none; }
::-webkit-scrollbar-track { background: #e6f1f5; }
::-webkit-scrollbar-thumb { background: #9fb3bf; }
::-webkit-scrollbar-thumb:hover { background: #0f1720; }
.site-scope {
  --vd: var(--font-site);
  --font-display: var(--font-site);
  --ground: #edf2f7;
  --fg: #0f1720;
  --fg2: #3f4c5a;
  --glass-bg: linear-gradient(145deg, rgba(255,255,255,.62), rgba(255,255,255,.3));
  --glass-solid: #f8fafc;
  --glass-line: rgba(255,255,255,.85);
  --glass-hi: rgba(255,255,255,.95);
  --glass-shadow: rgba(58,82,112,.16);
  --glass-blur: 16px;
  --glass-r: 28px;
  --glass-lit: rgba(10,132,160,.7);
  --glass-lit-soft: rgba(28,180,200,.14);
  --spot: rgba(255,255,255,.75);
  --field-bg: rgba(255,255,255,.72);
  --nav-on: rgba(15,23,32,.09);
  --jack: #111a23;
  --jack-ring: rgba(255,255,255,.95);
  --c1: #f0a400; --c2: #06a7b8; --c3: #e8457a; --c4: #ff7a1a;
  --dead: #a9b4bf;
  --ok: #12a150; --ok-text: #0b7039;
  --bad: #e0352b; --bad-soft: rgba(224,53,43,.12); --bad-text: #b3261e;
  --hot: #06a7b8; --led-off: rgba(15,23,32,.2);
  --cta: #0f1720; --cta-shine: #55708c; --cta-fg: #ffffff;
}
.site-scope ::selection { background: #0f1720; color: #ffffff; }
.site-scope :focus-visible { outline: 2px solid #0f1720; outline-offset: 3px; }
.site-scope [tabindex="-1"]:focus-visible { outline: none; }
${glassCss}`;

// Without JavaScript nothing reveals the scroll animations or pans the Work track.
const noScriptCss = `
.site-scope [style*="opacity"], .site-scope [style*="transform"] { opacity: 1 !important; transform: none !important; }
#work { height: auto !important; }
#work > div { position: static !important; height: auto !important; overflow: visible !important; }
#work [class*="w-max"] { display: grid !important; width: 100% !important; gap: 1rem !important; }
#work article { width: 100% !important; max-width: none !important; }`;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${manrope.variable} site-scope min-h-screen font-[family-name:var(--font-site)] text-[var(--fg)]`}>
      <style dangerouslySetInnerHTML={{ __html: palette }} />
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: noScriptCss }} />
      </noscript>
      {children}
    </div>
  );
}
