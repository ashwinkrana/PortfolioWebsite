import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Design Variants",
  description: "Thirteen alternative design directions for the portfolio.",
};

/**
 * Static index for the five design explorations. Each variant is a full,
 * self-contained homepage under app/variants/[n]/ with its own palette and
 * typeface; this page just links them and shows the palette at a glance.
 */

type Variant = {
  n: string;
  href?: string;
  name: string;
  blurb: string;
  swatches: string[];
  bg: string;
  fg: string;
};

const variants: Variant[] = [
  {
    n: "01",
    name: "Editorial Dusk",
    blurb:
      "Dusk-gradient atmosphere, serif display type, a glass nav pill. Calm, centred, cinematic.",
    swatches: ["#1b1030", "#3b2a6b", "#8b6fc4", "#e8b98f", "#f5ede4"],
    bg: "linear-gradient(135deg,#1b1030,#3b2a6b 55%,#c77d5a)",
    fg: "#f5ede4",
  },
  {
    n: "02",
    name: "Bento Light",
    blurb:
      "Warm paper background, a huge geometric wordmark, a gapless pastel bento grid of cards and stat tiles.",
    swatches: ["#f4f2ee", "#c9b8f0", "#a7e0c8", "#f4c9a8", "#1a1a1a"],
    bg: "#f4f2ee",
    fg: "#1a1a1a",
  },
  {
    n: "03",
    name: "Brutalist Mono",
    blurb:
      "Pure black on white, a visible ruler grid, oversized numerals, everything in a data table. One hairline of ember.",
    swatches: ["#ffffff", "#000000", "#e05b4e"],
    bg: "#ffffff",
    fg: "#000000",
  },
  {
    n: "04",
    name: "Terminal / Systems",
    blurb:
      "A boot sequence for a hero, phosphor-green monospace, sections as terminal panes, htop-style stat bars.",
    swatches: ["#0a0e0a", "#4af626", "#f5b544", "#8a938a"],
    bg: "#0a0e0a",
    fg: "#4af626",
  },
  {
    n: "05",
    name: "Kinetic Carbon+",
    blurb:
      "The current carbon/ember system pushed louder — full-bleed kinetic type, a horizontal-scrolling work strip, an oversized ticker.",
    swatches: ["#0e0e10", "#e05b4e", "#ededef"],
    bg: "#0e0e10",
    fg: "#ededef",
  },
  {
    n: "06",
    name: "Dusk Broadsheet",
    blurb:
      "Editorial Dusk run through the Impeccable skill: same gradient world, but the glass cards are gone — a masthead, hairline rules and running text do the work instead.",
    swatches: ["#170e27", "#3b2a6b", "#eaa97d", "#f6efe6"],
    bg: "linear-gradient(135deg,#170e27,#3b2a6b 55%,#c77d5a)",
    fg: "#f6efe6",
  },
  {
    n: "07",
    name: "Dusk Manifesto",
    blurb:
      "Editorial Dusk again, this time through tasteskill.dev's anti-slop rules: an asymmetric split hero, a cooler indigo-to-rose gradient, one eyebrow on the whole page.",
    swatches: ["#150c22", "#33204a", "#c97b9c", "#f3ece2"],
    bg: "linear-gradient(135deg,#150c22,#33204a 55%,#8a5570)",
    fg: "#f3ece2",
  },
  {
    n: "08",
    name: "Signal Path",
    blurb:
      "A rack of synth modules. Mohar's pipeline is wired up with real patch cables, and changing a reading kills the signal.",
    swatches: ["#17191c", "#d9dbd6", "#f2b705", "#12a5a5", "#e8457a", "#ff7a1a"],
    bg: "#d9dbd6",
    fg: "#15171a",
  },
  {
    n: "09",
    name: "Plotted",
    blurb:
      "White ink on cobalt paper, drawn by a pen plotter as you scroll. An altered record gets crossed out in yellow.",
    swatches: ["#1b3cb8", "#f4f6ff", "#ffd23f"],
    bg: "#1b3cb8",
    fg: "#f4f6ff",
  },
  {
    n: "10",
    name: "Field Binder",
    blurb:
      "Printed sheets in a binder with index tabs, taped-in screenshots and a highlighter that marks whatever fails.",
    swatches: ["#6b756e", "#f3f5f0", "#ff6a2b", "#2447e0", "#ffe94a"],
    bg: "#f3f5f0",
    fg: "#1c2023",
  },
  {
    n: "11",
    name: "Aurora Rack",
    blurb:
      "Signal Path in dark frosted glass over slow-moving light, with glowing cables running behind every module.",
    swatches: ["#070b12", "#1cc7c7", "#f2b705", "#f0568a"],
    bg: "linear-gradient(135deg,#070b12,#0f4a52 60%,#7a5a10)",
    fg: "#f2f6fa",
  },
  {
    n: "00",
    href: "/variants/classic",
    name: "Classic",
    blurb:
      "The previous homepage in Kinetic Carbon, kept here after Daylight with Silk became the live site.",
    swatches: ["#0e0e10", "#e05b4e", "#ededef"],
    bg: "#0e0e10",
    fg: "#ededef",
  },
  {
    n: "13",
    name: "Prism Deck",
    blurb:
      "Signal Path as layered smoked glass over saturated orange and plum. Panes open in turn as the signal passes.",
    swatches: ["#2a0f33", "#ff7a1a", "#f03c82", "#ffd666"],
    bg: "linear-gradient(135deg,#ff7a1a,#f03c82 55%,#2a0f33)",
    fg: "#fff7f2",
  },
];

export default function VariantsIndex() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-5 py-16 text-[#ededef] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-[#8a8a93]">
            Portfolio / Design Variants
          </p>
          <Link
            href="/"
            className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-[#8a8a93] transition-colors hover:text-[#e05b4e]"
          >
            ← Live site
          </Link>
        </div>

        <h1 className="mt-8 font-mono text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Thirteen directions for
          <br />
          the same portfolio.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#9a9aa3]">
          Each one is a complete homepage built from the same content, with its
          own palette, typeface and motion language. Variants 06 and 07 both
          rework Editorial Dusk (01) through a design-quality skill — Impeccable
          and tasteskill.dev respectively — so you can compare their takes
          directly. Open any of them; the bar at the top of the page links back
          here.
        </p>

        <ul className="mt-14 grid gap-px border border-[#26262b] bg-[#26262b] sm:grid-cols-2">
          {variants.map((v) => (
            <li key={v.n} className="bg-[#0b0b0d]">
              <Link
                href={v.href ?? `/variants/${Number(v.n)}`}
                className="group flex h-full flex-col justify-between gap-8 p-7 transition-colors hover:bg-[#141417] sm:p-9"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-[#e05b4e]">
                      Variant {v.n}
                    </span>
                    <span
                      aria-hidden
                      className="h-10 w-10 shrink-0 rounded-full border border-white/10"
                      style={{ background: v.bg }}
                    />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                    {v.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#9a9aa3]">
                    {v.blurb}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span aria-hidden className="flex gap-1.5">
                    {v.swatches.map((c) => (
                      <span
                        key={c}
                        className="h-4 w-4 rounded-sm ring-1 ring-inset ring-white/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-[#6e6e78] transition-colors group-hover:text-[#ededef]">
                    Open ↗
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
