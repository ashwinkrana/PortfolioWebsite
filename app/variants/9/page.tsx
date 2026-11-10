"use client"; // Scroll-linked pen carriage, in-view line drawing and the live tamper demo.

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Shot from "@/components/variants/Shot";
import { useChain } from "@/components/variants/useChain";
import { vc } from "@/lib/variantContent";

const ease = [0.65, 0, 0.35, 1] as const;

function PlotBox({
  children,
  delay = 0,
  className = "",
  pen = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  pen?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative ${className}`}>
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <motion.rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="none"
          strokeWidth={1.5}
          stroke={pen ? "var(--pen)" : "var(--ink)"}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, delay, ease }}
        />
      </svg>
      {children}
    </div>
  );
}

function Rule({ pen = false }: { pen?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`h-[1.5px] origin-left ${pen ? "bg-[var(--pen)]" : "bg-[var(--ink)]"}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={reduce ? { duration: 0 } : { duration: 1.1, ease }}
    />
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[clamp(3rem,6.5vw,5.5rem)] font-light leading-none tracking-[-0.02em]">{children}</h2>
      <div className="mt-5"><Rule /></div>
    </div>
  );
}

function PenCarriage() {
  const { scrollYProgress } = useScroll();
  const top = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div aria-hidden className="pointer-events-none fixed bottom-6 left-5 top-14 z-30 hidden w-px bg-[var(--ink)]/40 lg:block motion-reduce:!hidden">
      <motion.div className="absolute w-px origin-top bg-[var(--pen)]" style={{ height: top }} />
      <motion.span
        className="absolute -left-[5px] -mt-[5px] h-[11px] w-[11px] rounded-full border-[1.5px] border-[var(--pen)] bg-[var(--paper)]"
        style={{ top }}
      />
    </div>
  );
}

function ChainPlot() {
  const chain = useChain();
  const reduce = useReducedMotion();

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        {chain.records.map((record, i) => (
          <PlotBox key={i} delay={0.2 + i * 0.35} pen={!record.ok} className="p-4">
            {!record.ok && (
              <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
                <motion.line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="0"
                  stroke="var(--pen)"
                  strokeWidth={1.5}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.35, ease }}
                />
              </svg>
            )}
            <label className="relative block">
              <span className="flex justify-between text-base">
                {vc.demo.record(i + 1)}
                <span className={record.ok ? "" : "font-medium text-[var(--pen)]"}>
                  {record.ok ? vc.demo.passed : vc.demo.failed}
                </span>
              </span>
              <span className="mt-2 flex items-baseline gap-2">
                <input
                  value={record.reading}
                  inputMode="decimal"
                  onChange={(e) => chain.change(i, e.target.value)}
                  aria-label={`${vc.demo.record(i + 1)} reading in ${vc.demo.unit}`}
                  className="w-full border-b-[1.5px] border-[var(--ink)] bg-transparent text-3xl font-light tabular-nums outline-offset-4"
                />
                <span className="text-lg">{vc.demo.unit}</span>
              </span>
              <span className="mt-2 block font-mono text-sm text-[var(--ink-2)]">
                {vc.demo.signed} {record.signed}
              </span>
            </label>
          </PlotBox>
        ))}
      </div>
      <p aria-live="polite" className={`mt-5 text-lg ${chain.broken ? "text-[var(--pen)]" : "text-[var(--ink)]"}`}>
        {chain.broken ? vc.demo.bad(chain.firstBroken + 1) : vc.demo.ok}
      </p>
      <div className="mt-2 flex min-h-11 flex-wrap items-center gap-x-6 text-base text-[var(--ink-2)]">
        <span>{vc.demo.note}</span>
        {chain.broken && (
          <button type="button" onClick={chain.reset} className="min-h-11 text-[var(--pen)] underline underline-offset-4">
            {vc.demo.reset}
          </button>
        )}
      </div>
    </div>
  );
}

function Action({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <PlotBox delay={0.5} className="inline-block">
      <a href={href} className="inline-flex min-h-12 items-center px-6 text-xl transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]">
        {children}
      </a>
    </PlotBox>
  );
}

export default function PlottedPage() {
  const [lead, second, third, ...minor] = vc.projects;

  return (
    <main className="px-5 pb-16 pt-[33px] sm:px-8 lg:pl-20 lg:pr-12">
      <PenCarriage />

      <section className="grid min-h-[calc(100dvh-33px)] content-center gap-12 py-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h1 className="text-[clamp(4rem,9vw,6rem)] font-light leading-[0.95] tracking-[-0.03em]">
            {vc.first}
            <br />
            {vc.last}
          </h1>
          <p className="mt-8 text-[1.75rem] leading-tight">{vc.ask}</p>
          <p className="mt-4 max-w-md text-xl font-light leading-snug text-[var(--ink-2)]">{vc.line}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Action href="#work">{vc.actions.work}</Action>
            <Action href={`mailto:${vc.email}`}>{vc.actions.email}</Action>
          </div>
        </div>

        <div className="lg:col-span-7">
          <h2 className="text-5xl font-light tracking-[-0.02em]">{vc.mohar.name}</h2>
          <p className="mb-6 mt-2 text-xl font-light leading-snug">{vc.mohar.pitch}</p>
          <ChainPlot />
        </div>
      </section>

      <section id="work" className="scroll-mt-16 py-16">
        <Heading>{vc.mohar.subtitle}</Heading>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <PlotBox className="p-3 lg:col-span-7">
            <Shot src={vc.mohar.image} alt={`${vc.mohar.name}: ${vc.mohar.subtitle}`} />
          </PlotBox>
          <div className="lg:col-span-5">
            <p className="text-xl">{vc.mohar.context}</p>
            <p className="text-xl text-[var(--ink-2)]">{vc.mohar.role}</p>
            <div className="mt-5 space-y-4 text-lg font-light leading-relaxed">
              {vc.mohar.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
            </div>
            <p className="mt-5 font-mono text-sm">{vc.mohar.stack.join(", ")}</p>
          </div>
        </div>

        <ol className="mt-14 grid gap-px sm:grid-cols-5">
          {vc.mohar.stages.map((stage, i) => (
            <li key={stage.key} className="pr-5">
              <Rule pen={i === 4} />
              <h3 className="mt-3 text-3xl font-light">{stage.key}</h3>
              <p className="mt-2 pb-6 text-base leading-snug text-[var(--ink-2)]">{stage.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-16">
        {[lead, second].map((project, i) => (
          <article key={project.id} className={`mb-16 grid gap-8 lg:grid-cols-12 ${i === 1 ? "lg:[direction:rtl]" : ""}`}>
            <PlotBox className="p-3 lg:col-span-7 [direction:ltr]">
              <Shot src={project.image} alt={`${project.title} screenshot`} />
            </PlotBox>
            <div className="lg:col-span-5 lg:self-end [direction:ltr]">
              <h3 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none tracking-[-0.02em]">{project.title}</h3>
              <p className="mt-3 text-xl">{project.kind}</p>
              <p className="mt-3 text-lg font-light leading-relaxed">{project.line}</p>
              <p className="mt-3 font-mono text-sm">{project.stack.join(", ")}</p>
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-lg text-[var(--pen)] underline underline-offset-4">
                  {vc.actions.live}
                </a>
              )}
            </div>
          </article>
        ))}

        <Rule />
        <div className="grid gap-10 pt-10 lg:grid-cols-3">
          {[third, ...minor].map((project) => (
            <article key={project.id}>
              <h3 className="text-4xl font-light leading-none">{project.title}</h3>
              <p className="mt-2 text-lg">{project.kind}</p>
              <p className="mt-2 text-lg font-light leading-relaxed text-[var(--ink-2)]">{project.line}</p>
              <p className="mt-3 font-mono text-sm">{project.stack.join(", ")}</p>
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-lg text-[var(--pen)] underline underline-offset-4">
                  {vc.actions.live}
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="scroll-mt-16 py-16">
        <Heading>{vc.sections.experience}</Heading>
        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          {vc.roles.map((role) => (
            <article key={role.id}>
              <h3 className="text-4xl font-light leading-tight">{role.title}</h3>
              <p className="mt-2 text-xl">{role.org}</p>
              <p className="text-lg text-[var(--ink-2)]">{role.period}</p>
              <p className="mt-4 max-w-[65ch] text-lg font-light leading-relaxed">{role.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-16 py-16 lg:grid-cols-2">
        <div id="toolkit" className="scroll-mt-16">
          <Heading>{vc.sections.toolkit}</Heading>
          <dl className="mt-8 space-y-5">
            {vc.toolkit.map((g) => (
              <div key={g.group}>
                <dt className="text-lg text-[var(--ink-2)]">{g.group}</dt>
                <dd className="text-2xl font-light leading-snug">{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div id="education" className="scroll-mt-16">
          <Heading>{vc.sections.education}</Heading>
          <h3 className="mt-8 text-3xl font-light leading-tight">{vc.education.degree}</h3>
          <p className="mt-3 text-xl">{vc.education.school}</p>
          <p className="text-lg text-[var(--ink-2)]">{vc.education.period}</p>
          <p className="mt-4 text-2xl text-[var(--pen)]">{vc.education.result}</p>
          <p className="mt-4 text-lg font-light">{vc.education.coursework.join(", ")}</p>
          <p className="mt-4 text-base text-[var(--ink-2)]">{vc.education.prior}</p>
        </div>
      </section>

      <section id="contact" className="scroll-mt-16 pt-16">
        <Rule pen />
        <p className="mt-10 max-w-3xl text-[clamp(2rem,4vw,3.25rem)] font-light leading-tight">{vc.ask}</p>
        <a href={`mailto:${vc.email}`} className="mt-6 block break-all text-[clamp(2.25rem,6.6vw,6rem)] font-light leading-none tracking-[-0.02em] text-[var(--pen)] underline decoration-[1.5px] underline-offset-[0.15em]">
          {vc.email}
        </a>
        <div className="mt-10 flex gap-8 text-xl">
          <a href={vc.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">{vc.actions.github}</a>
          <a href={vc.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">{vc.actions.linkedin}</a>
        </div>
      </section>
    </main>
  );
}
