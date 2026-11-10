"use client"; // Measures jack positions for the cables and runs the live tamper demo.

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Shot from "@/components/variants/Shot";
import { useActiveSection, useChain } from "@/components/variants/useChain";
import { sectionIds, vc } from "@/lib/variantContent";

const display = "font-[family-name:var(--font-v8-display)]";
const cableColors = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];

function Screw({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-2.5 w-2.5 rounded-full bg-[#a4a7a2] shadow-[inset_0_1px_1px_rgba(0,0,0,0.45)] ${className}`}
    />
  );
}

function Module({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`relative scroll-mt-28 rounded-[3px] bg-[var(--plate)] p-6 shadow-[0_6px_14px_rgba(0,0,0,0.4)] lg:p-8 ${className}`}
    >
      <Screw className="left-2 top-2" />
      <Screw className="right-2 top-2" />
      <Screw className="bottom-2 left-2" />
      <Screw className="bottom-2 right-2" />
      {children}
    </div>
  );
}

function Led({ on, bad = false }: { on: boolean; bad?: boolean }) {
  const color = bad ? "var(--bad)" : on ? "var(--ok)" : "#9a9d98";
  return (
    <span
      aria-hidden
      className="inline-block h-3 w-3 rounded-full transition-colors duration-200"
      style={{ background: color, boxShadow: on || bad ? `0 1px 6px ${color}` : "none" }}
    />
  );
}

function Key({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${display} inline-flex min-h-12 items-center rounded-[3px] px-6 text-xl font-semibold uppercase tracking-wide shadow-[0_3px_0_rgba(0,0,0,0.45)] transition-transform duration-100 active:translate-y-[3px] active:shadow-none ${
        primary ? "bg-[var(--ink)] text-[var(--plate)]" : "bg-[#f1f2ee] text-[var(--ink)]"
      }`}
    >
      {children}
    </a>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={`${display} text-5xl font-bold uppercase leading-none lg:text-6xl`}>{children}</h2>
  );
}

function SignalPath({ broken }: { broken: boolean }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    const root = box.current;
    if (!root) return;
    const measure = () => {
      const origin = root.getBoundingClientRect();
      const center = (name: string) => {
        const r = root.querySelector(`[data-jack="${name}"]`)!.getBoundingClientRect();
        return { x: r.left - origin.left + r.width / 2, y: r.top - origin.top + r.height / 2 };
      };
      setPaths(
        [0, 1, 2, 3].map((i) => {
          const a = center(`out-${i}`);
          const b = center(`in-${i + 1}`);
          // Sag grows with the horizontal span so longer cables hang lower, capped to stay in the gap.
          const sag = Math.min(110, Math.abs(b.x - a.x) * 0.4 + 14);
          return `M${a.x} ${a.y} C${a.x} ${a.y + sag} ${b.x} ${b.y + sag} ${b.x} ${b.y}`;
        })
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const cableAlive = (i: number) => !broken || i < 2;

  return (
    <div ref={box} className="relative grid grid-cols-1 gap-1.5 lg:mb-24 lg:grid-cols-5">
      {vc.mohar.stages.map((stage, i) => (
        <Module key={stage.key} className="!p-4 lg:!pb-16 lg:!pt-6">
          <div className="flex items-center justify-between pl-12 lg:pl-0">
            <h3 className={`${display} text-3xl font-bold uppercase`}>{stage.key}</h3>
            <Led on={!broken || i < 2} bad={broken && i === 4} />
          </div>
          <p className="mt-2 pb-8 pl-12 text-[0.9375rem] leading-snug text-[var(--ink-2)] lg:pb-0 lg:pl-0">
            {stage.text}
          </p>
          {i > 0 && (
            <span
              aria-hidden
              data-jack={`in-${i}`}
              className="absolute left-5 top-5 h-6 w-6 rounded-full bg-[var(--ink)] ring-[3px] ring-[#9a9d98] lg:bottom-5 lg:left-auto lg:right-5 lg:top-auto"
            />
          )}
          {i < 4 && (
            <span
              aria-hidden
              data-jack={`out-${i}`}
              className="absolute bottom-5 left-5 h-6 w-6 rounded-full bg-[var(--ink)] ring-[3px] ring-[#9a9d98]"
            />
          )}
        </Module>
      ))}
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible">
        {paths.map((d, i) => (
          <g key={i} fill="none" strokeLinecap="round">
            <path d={d} stroke="rgba(0,0,0,0.3)" strokeWidth={5} transform="translate(0 4)" />
            <motion.path
              d={d}
              strokeWidth={5}
              initial={{ pathLength: 0, stroke: cableColors[i] }}
              animate={{ pathLength: 1, stroke: cableAlive(i) ? cableColors[i] : "var(--dead)" }}
              transition={{
                pathLength: reduce
                  ? { duration: 0 }
                  : { duration: 0.7, delay: 0.25 + i * 0.18, ease: [0.16, 1, 0.3, 1] },
                stroke: { duration: 0.2 },
              }}
            />
            {!reduce && cableAlive(i) && (
              <motion.path
                d={d}
                stroke="#ffffff"
                strokeWidth={3}
                initial={{ pathLength: 0.07, pathOffset: 0, opacity: 0 }}
                animate={{ pathOffset: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.1, delay: 1.4 + i * 1.1, repeat: Infinity, repeatDelay: 3.4, ease: "linear" }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function Readings({ chain }: { chain: ReturnType<typeof useChain> }) {
  return (
    <Module>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          <h3 className={`${display} text-4xl font-bold uppercase leading-none`}>{vc.demo.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-snug text-[var(--ink-2)]">{vc.demo.note}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-8">
          {chain.records.map((record, i) => (
            <label key={i} className="block">
              <span className="flex items-center justify-between text-sm font-semibold">
                {vc.demo.record(i + 1)}
                <Led on={record.ok} bad={!record.ok} />
              </span>
              <input
                value={record.reading}
                inputMode="decimal"
                onChange={(e) => chain.change(i, e.target.value)}
                className="mt-1 w-full rounded-[3px] border border-[var(--ink-2)] bg-[#f1f2ee] px-2 py-2 font-mono text-base tabular-nums"
              />
              <span className="mt-1 block font-mono text-sm text-[var(--ink-2)]">{record.signed}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className={`font-semibold ${chain.broken ? "text-[var(--bad)]" : "text-[#157a3a]"}`}>
          {chain.broken ? vc.demo.bad(chain.firstBroken + 1) : vc.demo.ok}
        </p>
        {chain.broken && (
          <button
            type="button"
            onClick={chain.reset}
            className={`${display} min-h-11 rounded-[3px] bg-[var(--ink)] px-4 text-lg font-semibold uppercase tracking-wide text-[var(--plate)]`}
          >
            {vc.demo.reset}
          </button>
        )}
      </div>
    </Module>
  );
}

export default function SignalPathPage() {
  const chain = useChain();
  const active = useActiveSection(sectionIds);
  const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

  return (
    <main className="px-1.5 pb-1.5 pt-[33px]">
      <nav className="sticky top-[33px] z-40 -mx-1.5 flex items-center justify-between gap-4 overflow-x-auto bg-[var(--rail)] px-4 text-[var(--plate)] lg:px-6">
        <a href="#top" className={`${display} hidden min-h-11 shrink-0 py-2 text-xl font-bold uppercase md:block`}>
          {vc.name}
        </a>
        <div className="flex w-full justify-between gap-2 md:w-auto md:justify-end md:gap-5">
          {sectionIds.map((id) => (
            <a key={id} href={`#${id}`} className="flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium">
              <span
                aria-hidden
                className={`hidden h-2 w-2 rounded-full transition-colors md:block ${active === id ? "bg-[var(--c1)]" : "bg-[#4a4e52]"}`}
              />
              {vc.sections[id]}
            </a>
          ))}
        </div>
      </nav>

      <section id="top" className="grid gap-1.5 pt-1.5 lg:grid-cols-12">
        <Module className="flex flex-col justify-between gap-10 lg:col-span-4">
          <div>
            <h1 className={`${display} text-[clamp(4rem,8vw,6rem)] font-bold uppercase leading-[0.88]`}>
              {vc.first}
              <br />
              {vc.last}
            </h1>
            <p className="mt-6 text-2xl font-medium leading-tight">{vc.ask}</p>
            <p className="mt-4 max-w-md text-lg leading-snug text-[var(--ink-2)]">{vc.line}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Key href="#work" primary>{vc.actions.work}</Key>
            <Key href={`mailto:${vc.email}`}>{vc.actions.email}</Key>
          </div>
        </Module>

        <div className="lg:col-span-8">
          <div className="mb-3 px-1 pt-3 text-[var(--plate)] lg:mb-4">
            <h2 className={`${display} text-5xl font-bold uppercase leading-none`}>{vc.mohar.name}</h2>
            <p className="mt-1 text-lg">{vc.mohar.pitch}</p>
          </div>
          <SignalPath broken={chain.broken} />
          <div className="mt-1.5 lg:mt-0">
            <Readings chain={chain} />
          </div>
        </div>
      </section>

      <section id="work" className="mt-1.5 grid scroll-mt-24 gap-1.5 lg:grid-cols-12">
        <Module className="lg:col-span-12">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Shot src={vc.mohar.image} alt={`${vc.mohar.name}: ${vc.mohar.subtitle}`} className="rounded-[3px]" />
            </div>
            <div className="lg:col-span-6">
              <Heading>{vc.mohar.subtitle}</Heading>
              <p className="mt-3 font-semibold">{vc.mohar.context}. {vc.mohar.role}.</p>
              <div className="mt-4 space-y-3 leading-relaxed text-[var(--ink-2)]">
                {vc.mohar.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
              </div>
              <p className="mt-4 font-mono text-sm">{vc.mohar.stack.join(", ")}</p>
            </div>
          </div>
        </Module>

        {vc.projects.map((project, i) => (
          <Module key={project.id} className={spans[i]}>
            {!project.minor && (
              <Shot src={project.image} alt={`${project.title} screenshot`} className="mb-5 rounded-[3px]" />
            )}
            <h3 className={`${display} text-4xl font-bold uppercase leading-none`}>{project.title}</h3>
            <p className="mt-1 font-semibold">{project.kind}</p>
            <p className="mt-3 leading-relaxed text-[var(--ink-2)]">{project.line}</p>
            <p className="mt-3 font-mono text-sm">{project.stack.join(", ")}</p>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold underline underline-offset-4">
                {vc.actions.live}
              </a>
            )}
          </Module>
        ))}
      </section>

      <section className="mt-1.5 grid gap-1.5 lg:grid-cols-12">
        <Module id="experience" className="lg:col-span-7">
          <Heading>{vc.sections.experience}</Heading>
          <div className="mt-6 space-y-8">
            {vc.roles.map((role) => (
              <article key={role.id}>
                <h3 className={`${display} text-3xl font-bold uppercase leading-none`}>{role.title}</h3>
                <p className="mt-1 font-semibold">{role.org}. {role.period}.</p>
                <p className="mt-2 max-w-[65ch] leading-relaxed text-[var(--ink-2)]">{role.body}</p>
              </article>
            ))}
          </div>
        </Module>
        <div className="grid gap-1.5 lg:col-span-5">
          <Module id="toolkit">
            <Heading>{vc.sections.toolkit}</Heading>
            <dl className="mt-5 space-y-3">
              {vc.toolkit.map((g) => (
                <div key={g.group} className="grid grid-cols-[6.5rem_1fr] gap-2">
                  <dt className="font-semibold">{g.group}</dt>
                  <dd className="text-[var(--ink-2)]">{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Module>
          <Module id="education">
            <Heading>{vc.sections.education}</Heading>
            <h3 className="mt-4 text-xl font-semibold leading-snug">{vc.education.degree}</h3>
            <p className="mt-1 text-[var(--ink-2)]">{vc.education.school}. {vc.education.period}.</p>
            <p className="mt-2 font-semibold">{vc.education.result}</p>
            <p className="mt-2 text-[var(--ink-2)]">{vc.education.coursework.join(", ")}</p>
            <p className="mt-2 text-sm text-[var(--ink-2)]">{vc.education.prior}</p>
          </Module>
        </div>
      </section>

      <Module id="contact" className="mt-1.5 !bg-[var(--c4)]">
        <Heading>{vc.ask}</Heading>
        <a
          href={`mailto:${vc.email}`}
          className={`${display} mt-6 block break-all text-[clamp(2.5rem,7.6vw,6rem)] font-bold leading-none underline decoration-4 underline-offset-8`}
        >
          {vc.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-3">
          <Key href={vc.github} primary>{vc.actions.github}</Key>
          <Key href={vc.linkedin} primary>{vc.actions.linkedin}</Key>
        </div>
      </Module>
    </main>
  );
}
