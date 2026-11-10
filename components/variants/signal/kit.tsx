"use client"; // Pointer-driven glass, measured cables and the signal sequencer all need the browser.

import { useEffect, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Shot from "@/components/variants/Shot";
import { useActiveSection, useChain } from "@/components/variants/useChain";
import { sectionIds, vc } from "@/lib/variantContent";

export const easeOut = [0.16, 1, 0.3, 1] as const;
export const cableColors = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];
const STEP_MS = 900;

/** False during hydration so server and client markup match, then the real preference. */
export function useSettledReducedMotion() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(reduce);
}

export type AmbientField = {
  color: string;
  className: string;
  x: number[];
  y: number[];
  duration: number;
};

export function Ambient({ fields, children }: { fields: AmbientField[]; children?: ReactNode }) {
  const reduce = useSettledReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {fields.map((field) => (
        <motion.div
          key={field.className}
          className={`absolute min-h-[560px] min-w-[640px] rounded-full ${field.className}`}
          style={{ background: `radial-gradient(closest-side, ${field.color}, transparent)` }}
          animate={reduce ? { x: 0, y: 0 } : { x: field.x, y: field.y }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: field.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
        />
      ))}
      {children}
    </div>
  );
}

export function Glass({
  children,
  className = "",
  id,
  delay = 0,
  tone,
  style,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  tone?: "lit" | "bad";
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const glow = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${x}px ${y}px, var(--spot), transparent 70%)`;
  const toneClass = tone === "lit" ? "glass-lit" : tone === "bad" ? "glass-bad" : "";

  return (
    <motion.div
      id={id}
      className={`glass relative scroll-mt-28 ${toneClass} ${className}`}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, delay, ease: easeOut }}
      onPointerMove={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - box.left);
        y.set(e.clientY - box.top);
      }}
      onPointerEnter={() => {
        if (!reduce) animate(glow, 1, { duration: 0.3 });
      }}
      onPointerLeave={() => animate(glow, 0, { duration: 0.5 })}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: spotlight, opacity: glow }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function Magnetic({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });
  const external = href.startsWith("http");

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - box.left - box.width / 2) * 0.28);
        y.set((e.clientY - box.top - box.height / 2) * 0.4);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex min-h-12 items-center rounded-full px-7 text-lg font-semibold ${
        primary ? "cta" : "glass text-[var(--fg)]"
      }`}
    >
      {children}
    </motion.a>
  );
}

export function RiseName({ className = "" }: { className?: string }) {
  // A CSS animation, so the name appears on first paint instead of waiting for JavaScript.
  let index = 0;
  return (
    <h1 className={className} aria-label={vc.name}>
      {[vc.first, vc.last].map((word) => (
        <span key={word} aria-hidden className="-mr-[0.08em] block shrink-0 overflow-hidden pb-[0.06em] pr-[0.08em]">
          {word.split("").map((letter, i) => (
            <span key={`${letter}-${i}`} className="rise-letter inline-block" style={{ animationDelay: `${100 + index++ * 35}ms` }}>
              {letter}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

export function GlassNav({ top = "top-[42px]" }: { top?: string }) {
  const active = useActiveSection(sectionIds);
  return (
    <nav className={`glass sticky ${top} z-40 mx-auto flex w-fit max-w-full items-center !rounded-full p-1`}>
      {sectionIds.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          className="relative flex min-h-11 items-center rounded-full px-[clamp(0.25rem,calc(10vw_-_1.75rem),0.5rem)] text-[0.8125rem] font-medium text-[var(--fg)] sm:px-4 sm:text-[0.9375rem]"
        >
          {active === id && (
            <motion.span
              layoutId="glass-nav"
              className="absolute inset-0 rounded-full bg-[var(--nav-on)]"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          <span className="relative">{vc.sections[id]}</span>
        </a>
      ))}
    </nav>
  );
}

export function Led({ state }: { state: "on" | "bad" | "off" | "hot" }) {
  const color =
    state === "bad" ? "var(--bad)" : state === "off" ? "var(--led-off)" : state === "hot" ? "var(--hot)" : "var(--ok)";
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 rounded-full transition-all duration-200"
      style={{ background: color, boxShadow: state === "off" ? "none" : `0 1px 8px ${color}` }}
    />
  );
}

export function useCables(root: RefObject<HTMLElement>, count: number) {
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const origin = el.getBoundingClientRect();
      const center = (name: string) => {
        const r = el.querySelector(`[data-jack="${name}"]`)!.getBoundingClientRect();
        return { x: r.left - origin.left + r.width / 2, y: r.top - origin.top + r.height / 2 };
      };
      setPaths(
        Array.from({ length: count }, (_, i) => {
          const a = center(`out-${i}`);
          const b = center(`in-${i + 1}`);
          const sag = Math.min(110, Math.abs(b.x - a.x) * 0.4 + 14);
          return `M${a.x} ${a.y} C${a.x} ${a.y + sag} ${b.x} ${b.y + sag} ${b.x} ${b.y}`;
        })
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [root, count]);

  return paths;
}

export function useSequencer(stages: number, stopAt: number | null, running: boolean) {
  const [state, setState] = useState({ step: -1, cycle: 0 });

  useEffect(() => {
    if (!running) {
      setState((s) => ({ ...s, step: -1 }));
      return;
    }
    const last = stopAt ?? stages - 1;
    let i = 0;
    setState((s) => ({ step: 0, cycle: s.cycle + 1 }));
    const id = setInterval(() => {
      i += 1;
      if (i > last + 2) i = 0;
      const step = i > last ? -1 : i;
      setState((s) => ({ step, cycle: i === 0 ? s.cycle + 1 : s.cycle }));
    }, STEP_MS);
    return () => clearInterval(id);
  }, [stages, stopAt, running]);

  return state;
}

export function CableLayer({
  paths,
  alive,
  step,
  cycle,
}: {
  paths: string[];
  alive: (i: number) => boolean;
  step: number;
  cycle: number;
}) {
  const reduce = useReducedMotion();
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
      {paths.map((d, i) => {
        const color = alive(i) ? cableColors[i] : "var(--dead)";
        return (
          <g key={i} fill="none" strokeLinecap="round">
            <motion.path d={d} strokeWidth={16} initial={{ pathLength: 0, opacity: 0.22, stroke: color }} animate={{ pathLength: 1, stroke: color }} transition={{ pathLength: reduce ? { duration: 0 } : { duration: 0.8, delay: 0.3 + i * 0.18, ease: easeOut } }} />
            <motion.path d={d} strokeWidth={5} initial={{ pathLength: 0, stroke: color }} animate={{ pathLength: 1, stroke: color }} transition={{ pathLength: reduce ? { duration: 0 } : { duration: 0.8, delay: 0.3 + i * 0.18, ease: easeOut } }} />
            {step === i && alive(i) && (
              <motion.path
                key={cycle}
                d={d}
                stroke="#ffffff"
                strokeWidth={4}
                initial={{ pathLength: 0.14, pathOffset: 0, opacity: 1 }}
                animate={{ pathOffset: 1, opacity: [1, 1, 0] }}
                transition={{ duration: STEP_MS / 1000, ease: "linear" }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function ReadingsPanel({ chain, className = "" }: { chain: ReturnType<typeof useChain>; className?: string }) {
  return (
    <Glass className={`p-6 lg:p-8 ${className}`}>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          <h3 className="vd text-3xl font-bold leading-none lg:text-4xl">{vc.demo.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-snug text-[var(--fg2)]">{vc.demo.note}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-8">
          {chain.records.map((record, i) => (
            <label key={i} className="block">
              <span className="flex items-center justify-between text-sm font-semibold">
                {vc.demo.record(i + 1)}
                <Led state={record.ok ? "on" : "bad"} />
              </span>
              <input
                value={record.reading}
                inputMode="decimal"
                onChange={(e) => chain.change(i, e.target.value)}
                className="glass-field mt-1 w-full px-3 py-2 font-mono text-base tabular-nums"
              />
              <span className="mt-1 block font-mono text-sm text-[var(--fg2)]">{record.signed}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-5 flex min-h-11 flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className={`font-semibold ${chain.broken ? "text-[var(--bad-text)]" : "text-[var(--ok-text)]"}`}>
          {chain.broken ? vc.demo.bad(chain.firstBroken + 1) : vc.demo.ok}
        </p>
        {chain.broken && (
          <button type="button" onClick={chain.reset} className="cta min-h-11 rounded-full px-5 font-semibold">
            {vc.demo.reset}
          </button>
        )}
      </div>
    </Glass>
  );
}

export function Tile({
  project,
  className = "",
  delay = 0,
  priority = false,
}: {
  project: (typeof vc.projects)[number];
  className?: string;
  delay?: number;
  priority?: boolean;
}) {
  return (
    <Glass className={`p-5 lg:p-6 ${className}`} delay={delay}>
      {!project.minor && (
        <div className="mb-5 overflow-hidden rounded-[calc(var(--glass-r)-8px)]">
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.6, ease: easeOut }}>
            <Shot src={project.image} alt={`${project.title} screenshot`} priority={priority} />
          </motion.div>
        </div>
      )}
      <h3 className="vd text-3xl font-bold leading-none lg:text-4xl">{project.title}</h3>
      <p className="mt-1 font-semibold">{project.kind}</p>
      <p className="mt-3 leading-relaxed text-[var(--fg2)]">{project.line}</p>
      <p className="mt-3 font-mono text-sm text-[var(--fg2)]">{project.stack.join(", ")}</p>
      {project.live && (
        <a href={project.live} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
          {vc.actions.live}
        </a>
      )}
    </Glass>
  );
}
