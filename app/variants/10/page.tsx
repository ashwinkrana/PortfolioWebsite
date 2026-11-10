"use client"; // Active index tab, highlighter motion and the live tamper demo.

import { motion, useReducedMotion } from "framer-motion";
import Shot from "@/components/variants/Shot";
import { useActiveSection, useChain } from "@/components/variants/useChain";
import { sectionIds, vc } from "@/lib/variantContent";

const tabs: Record<(typeof sectionIds)[number], { bg: string; fg: string }> = {
  work: { bg: "var(--t-work)", fg: "var(--ink)" },
  experience: { bg: "var(--t-experience)", fg: "#ffffff" },
  toolkit: { bg: "var(--t-toolkit)", fg: "var(--ink)" },
  education: { bg: "var(--t-education)", fg: "var(--ink)" },
  contact: { bg: "var(--t-contact)", fg: "var(--ink)" },
};

function Sheet({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative mb-3 scroll-mt-12 rounded-[2px] bg-[var(--sheet)] py-8 pl-12 pr-5 shadow-[0_8px_18px_rgba(28,32,35,0.28)] sm:pl-20 sm:pr-10 lg:py-12 lg:pl-24 lg:pr-14 ${className}`}
      style={{
        backgroundImage: "radial-gradient(rgba(28,32,35,0.16) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {["12%", "50%", "88%"].map((top) => (
        <span
          key={top}
          aria-hidden
          style={{ top }}
          className="absolute left-4 h-4 w-4 -translate-y-1/2 rounded-full bg-[var(--board)] shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] sm:left-7 sm:h-5 sm:w-5"
        />
      ))}
      {children}
    </section>
  );
}

function Highlight({ children, delay = 0.4 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="bg-no-repeat px-1 [box-decoration-break:clone]"
      style={{ backgroundImage: "linear-gradient(var(--hi), var(--hi))" }}
      initial={{ backgroundSize: "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true }}
      transition={reduce ? { duration: 0 } : { duration: 0.55, delay, ease: [0.3, 0, 0.2, 1] }}
    >
      {children}
    </motion.span>
  );
}

function TapedPrint({
  src,
  alt,
  tilt = "-rotate-1",
  priority = false,
}: {
  src: string;
  alt: string;
  tilt?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`relative bg-white p-2 shadow-[0_4px_10px_rgba(28,32,35,0.25)] ${tilt}`}>
      <span aria-hidden className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-2 bg-[#efe6a8]/80" />
      <Shot src={src} alt={alt} priority={priority} />
    </figure>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[clamp(2.75rem,5.5vw,4.5rem)] font-black leading-none tracking-[-0.03em]">{children}</h2>;
}

function Log() {
  const chain = useChain();
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold tracking-[-0.01em]">{vc.demo.title}</h3>
      <div className="mt-3 grid gap-2">
        {chain.records.map((record, i) => (
          <div key={i} className={`grid grid-cols-[1fr_7rem] items-center gap-x-4 gap-y-1 border-b border-[var(--ink)] py-2 transition-colors sm:grid-cols-[7rem_8rem_1fr_6rem] ${record.ok ? "" : "bg-[var(--hi)]"}`}>
            <label htmlFor={`v10-r${i}`} className="font-medium">{vc.demo.record(i + 1)}</label>
            <input
              id={`v10-r${i}`}
              value={record.reading}
              inputMode="decimal"
              onChange={(e) => chain.change(i, e.target.value)}
              className="w-full rounded-[2px] border border-[var(--ink-2)] bg-white px-2 py-1.5 font-mono tabular-nums"
            />
            <span className="font-mono text-sm text-[var(--ink-2)]">{record.signed}</span>
            <span className={`text-right font-bold ${record.ok ? "text-[#0d6b49]" : "text-[#b42318]"}`}>
              {record.ok ? vc.demo.passed : vc.demo.failed}
            </span>
          </div>
        ))}
      </div>
      <p aria-live="polite" className="mt-3 font-medium">{chain.broken ? vc.demo.bad(chain.firstBroken + 1) : vc.demo.ok}</p>
      <div className="flex min-h-11 flex-wrap items-center gap-x-5 text-sm text-[var(--ink-2)]">
        <span>{vc.demo.note}</span>
        {chain.broken && (
          <button type="button" onClick={chain.reset} className="min-h-11 font-bold text-[var(--ink)] underline underline-offset-4">
            {vc.demo.reset}
          </button>
        )}
      </div>
    </div>
  );
}

function Tabs() {
  const active = useActiveSection(sectionIds);
  const reduce = useReducedMotion();
  return (
    <nav aria-label="Sections" className="fixed inset-x-0 bottom-0 z-40 flex lg:bottom-auto lg:left-auto lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col lg:gap-1">
      {sectionIds.map((id) => (
        <motion.a
          key={id}
          href={`#${id}`}
          aria-current={active === id ? "true" : undefined}
          style={{ background: tabs[id].bg, color: tabs[id].fg }}
          animate={reduce ? undefined : { x: active === id ? 0 : 10 }}
          className="flex min-h-11 flex-1 items-center justify-center overflow-hidden rounded-t-[4px] px-1 text-[0.8125rem] font-bold sm:text-sm lg:w-32 lg:flex-none lg:justify-start lg:rounded-l-[4px] lg:rounded-tr-none lg:pl-3"
        >
          {vc.sections[id]}
        </motion.a>
      ))}
    </nav>
  );
}

function Button({ href, children, solid = false }: { href: string; children: React.ReactNode; solid?: boolean }) {
  return (
    <a href={href} className={`inline-flex min-h-12 items-center rounded-[2px] border-2 border-[var(--ink)] px-5 text-lg font-bold transition-transform active:translate-y-px ${solid ? "bg-[var(--ink)] text-[var(--sheet)]" : ""}`}>
      {children}
    </a>
  );
}

export default function FieldBinderPage() {
  return (
    <main className="mx-auto max-w-[1240px] px-2 pb-20 pt-11 sm:px-4 lg:pb-8 lg:pr-36">
      <Tabs />

      <Sheet>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h1 className="text-[clamp(4rem,8vw,6rem)] font-black leading-[0.9] tracking-[-0.04em]">
              {vc.first}
              <br />
              {vc.last}
            </h1>
            <p className="mt-6 text-[1.75rem] font-medium leading-[1.25] tracking-[-0.01em]">
              <Highlight>{vc.ask}</Highlight>
            </p>
            <p className="mt-4 max-w-md text-lg leading-snug text-[var(--ink-2)]">{vc.line}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="#work" solid>{vc.actions.work}</Button>
              <Button href={`mailto:${vc.email}`}>{vc.actions.email}</Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="text-5xl font-black tracking-[-0.03em]">{vc.mohar.name}</h2>
            <p className="mb-5 mt-2 text-xl leading-snug">{vc.mohar.pitch}</p>
            <TapedPrint src={vc.mohar.image} alt={`${vc.mohar.name}: ${vc.mohar.subtitle}`} tilt="rotate-[0.6deg]" priority />
          </div>
        </div>
        <Log />
      </Sheet>

      <Sheet id="work">
        <Heading>{vc.mohar.subtitle}</Heading>
        <p className="mt-4 text-xl font-medium">{vc.mohar.context}. {vc.mohar.role}.</p>
        <div className="mt-6 max-w-[65ch] space-y-4 text-lg leading-relaxed">
          {vc.mohar.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
          {vc.mohar.points.map((point) => (
            <div key={point.k}>
              <dt className="font-bold">{point.k}</dt>
              <dd className="text-[var(--ink-2)]">{point.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 font-mono text-sm">{vc.mohar.stack.join(", ")}</p>
      </Sheet>

      <Sheet>
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {vc.projects.map((project, i) => (
            <article key={project.id} className={project.minor ? "" : i === 0 ? "md:col-span-2" : ""}>
              {!project.minor && (
                <div className={i === 0 ? "mb-6 max-w-3xl" : "mb-6"}>
                  <TapedPrint src={project.image} alt={`${project.title} screenshot`} tilt={i % 2 ? "rotate-[0.8deg]" : "-rotate-[0.7deg]"} />
                </div>
              )}
              <h3 className="text-4xl font-black leading-none tracking-[-0.03em]">{project.title}</h3>
              <p className="mt-2 font-bold">{project.kind}</p>
              <p className="mt-2 max-w-[60ch] text-lg leading-relaxed text-[var(--ink-2)]">{project.line}</p>
              <p className="mt-2 font-mono text-sm">{project.stack.join(", ")}</p>
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-bold underline underline-offset-4">
                  {vc.actions.live}
                </a>
              )}
            </article>
          ))}
        </div>
      </Sheet>

      <Sheet id="experience">
        <Heading>{vc.sections.experience}</Heading>
        <div className="mt-8 space-y-10">
          {vc.roles.map((role) => (
            <article key={role.id} className="grid gap-3 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h3 className="text-3xl font-black leading-tight tracking-[-0.02em]">{role.title}</h3>
                <p className="mt-1 font-medium">{role.org}</p>
                <p className="text-[var(--ink-2)]">{role.period}</p>
              </div>
              <p className="max-w-[65ch] text-lg leading-relaxed text-[var(--ink-2)] lg:col-span-7">{role.body}</p>
            </article>
          ))}
        </div>
      </Sheet>

      <Sheet id="toolkit">
        <Heading>{vc.sections.toolkit}</Heading>
        <dl className="mt-8 columns-1 gap-10 md:columns-2">
          {vc.toolkit.map((g) => (
            <div key={g.group} className="mb-5 break-inside-avoid">
              <dt className="font-bold">{g.group}</dt>
              <dd className="text-xl leading-snug">{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Sheet>

      <Sheet id="education">
        <Heading>{vc.sections.education}</Heading>
        <h3 className="mt-7 text-2xl font-bold">{vc.education.degree}</h3>
        <p className="mt-1 text-lg">{vc.education.school}. {vc.education.period}.</p>
        <p className="mt-3 text-2xl font-black"><Highlight delay={0.1}>{vc.education.result}</Highlight></p>
        <p className="mt-4 max-w-[65ch] text-[var(--ink-2)]">{vc.education.coursework.join(", ")}</p>
        <p className="mt-2 text-sm text-[var(--ink-2)]">{vc.education.prior}</p>
      </Sheet>

      <Sheet id="contact">
        <Heading>{vc.ask}</Heading>
        <a href={`mailto:${vc.email}`} className="mt-6 block break-all text-[clamp(2rem,5.4vw,4.5rem)] font-black leading-none tracking-[-0.03em] underline decoration-4 underline-offset-8">
          {vc.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={vc.github} solid>{vc.actions.github}</Button>
          <Button href={vc.linkedin}>{vc.actions.linkedin}</Button>
        </div>
      </Sheet>
    </main>
  );
}
