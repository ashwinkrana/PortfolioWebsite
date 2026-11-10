"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { RevealText } from "@/components/ScrollFX";
import { education, experience, profile, skills, stats } from "@/lib/content";
import { featured, projects } from "@/lib/projects";

const serif = "font-[family-name:var(--font-v6-serif)]";
const EASE = [0.16, 1, 0.3, 1] as const;

const facts = [
  `CGPA ${stats[0].value}`,
  `Class of ${stats[2].value}`,
  `${stats[1].value} engineers led`,
  `${stats[3].value} services running`,
];

const contents = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

/**
 * Variant 06 — the Editorial Dusk world (v1) carried through Impeccable's
 * craft floor. Same gradient, same serif voice; the glass-card scaffold is
 * gone in favour of a broadsheet: a masthead, hairline rules, and running
 * text doing the work that boxes used to.
 */
export default function DuskBroadsheet() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  /*
   * The static scrim below handles contrast within the photo itself, but a
   * pre-baked gradient can only blend "hero into body" at one fixed point —
   * anyone with a shorter viewport hits that point as soon as they start
   * scrolling, and it reads as a cut. Tying the whole photo's opacity to
   * actual scroll progress through the section makes the dissolve start the
   * instant scrolling does, on any screen.
   */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const photoOpacity = useTransform(scrollYProgress, [0, 0.85], reduce ? [1, 1] : [1, 0]);

  return (
    <main className="relative overflow-hidden">
      {/* ── Cover ────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden"
      >
        {/* Full-bleed photo, already lit for this exact palette. Fades out
            with scroll progress so it dissolves into the page colour behind
            it rather than ending at a hard section edge. */}
        <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ opacity: photoOpacity }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduce ? 1 : 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 9, ease: EASE }}
          >
            <Image
              src="/hero-dusk.png"
              alt="Ashwin, outdoors at dusk"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[58%_82%]"
            />
          </motion.div>
          {/* Scrims — legibility for the type sitting on top, not decoration.
              Plain rgba here, not the bg-[var(--bg)]/NN Tailwind shorthand:
              arbitrary CSS-variable colours don't carry an opacity modifier. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(23,14,39,1) 0%, rgba(23,14,39,0.9) 12%, rgba(23,14,39,0.45) 46%, rgba(23,14,39,0) 78%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(23,14,39,0.6) 0%, rgba(23,14,39,0) 32%)",
            }}
          />
        </motion.div>

        {/* Masthead row */}
        <div className="relative mx-auto w-full max-w-6xl px-5 pt-16 sm:px-8 sm:pt-10 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-baseline">
            <span className={`${serif} text-xl italic tracking-tight`}>
              {profile.name}
            </span>
            <div className="font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.18em] text-[var(--muted)] sm:text-right">
              <p>{profile.location}</p>
              <p>{profile.status}</p>
            </div>
          </div>
        </div>

        {/* Headline, anchored to the foot of the frame */}
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <h1 className={`${serif} max-w-4xl text-[clamp(2.75rem,7.4vw,5.5rem)] font-light leading-[1.05] tracking-[-0.02em]`}>
            <RevealText text={`I build full-stack products —`} />
            <br />
            <RevealText
              text="then I keep them running."
              className={`${serif} italic text-[var(--accent)]`}
            />
          </h1>

          <p className="mt-7 max-w-md text-base leading-relaxed text-[var(--muted)]">
            Computer science undergrad, {profile.location}. {facts.join(" · ")}.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href={`mailto:${profile.email}`}
              data-cursor="link"
              className="rounded-full bg-[var(--fg)] px-6 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--bg)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book a call ↗
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--fg)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
            >
              GitHub ↗
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--fg)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </section>

      {/* Contents — its own strip, back on the flat page colour. */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Contents"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--line)] py-5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--dim)]"
        >
          <span className="text-[var(--muted)]">Contents</span>
          {contents.map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="transition-colors hover:text-[var(--accent)]"
            >
              {c.label}
            </a>
          ))}
        </nav>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <Section id="about">
        <Reveal>
          <p
            className={`max-w-[62ch] text-xl leading-relaxed text-[var(--muted)] first-letter:float-left first-letter:mr-3 first-letter:text-[4.5rem] first-letter:italic first-letter:leading-[0.8] first-letter:text-[var(--accent)] ${serif} first-letter:font-[family-name:var(--font-v6-serif)]`}
          >
            {profile.line}
          </p>
        </Reveal>
      </Section>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <Section id="experience">
        <Heading>Experience</Heading>
        <div className="mt-8 border-b border-[var(--line)]">
          {experience.map((role) => (
            <article key={role.id} className="border-t border-[var(--line)] py-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className={`${serif} text-2xl font-normal`}>
                  {role.title}
                  <span className="text-[var(--dim)]"> — {role.org}</span>
                </h3>
                <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                  {role.period}
                </span>
              </div>
              {role.location && (
                <p className="mt-1 text-sm text-[var(--dim)]">{role.location}</p>
              )}
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--muted)]">
                {role.body}
              </p>
              <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--dim)]">
                {role.meta.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Work ─────────────────────────────────────────────────────── */}
      <Section id="work">
        <Heading>Work</Heading>

        {/* Featured — Mohar */}
        <Reveal>
          <article className="mt-8 border-t border-[var(--line-strong)] pt-8">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
              {featured.context} · {featured.role}
            </p>
            <h3 className={`${serif} mt-3 text-[clamp(2.2rem,5.6vw,3.75rem)] font-light leading-none`}>
              {featured.name}
            </h3>
            <p className={`${serif} mt-2 text-lg italic text-[var(--muted)]`}>
              {featured.subtitle}
            </p>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <blockquote
                  className={`${serif} border-l border-[var(--accent)] pl-5 text-xl italic leading-snug text-[var(--fg)]`}
                >
                  &ldquo;{featured.body[1]}&rdquo;
                </blockquote>
                <div className="mt-6 space-y-4">
                  {featured.body.map((p) => (
                    <p key={p.slice(0, 20)} className="max-w-[62ch] text-sm leading-relaxed text-[var(--muted)]">
                      {p}
                    </p>
                  ))}
                </div>
                <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--dim)]">
                  {featured.stack.join(" · ")}
                </p>
              </div>

              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={`${featured.name} — ${featured.subtitle}`}
                  className="w-full border border-[var(--line)]"
                />
                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 divide-x divide-[var(--line)]">
                  {featured.points.map((p, i) => (
                    <div key={p.k} className={i === 0 ? "" : "pl-8"}>
                      <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
                        {p.k}
                      </dt>
                      <dd className={`${serif} mt-1.5 text-base`}>{p.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Roster */}
        <div className="mt-4 border-b border-[var(--line)]">
          {projects.map((p) => (
            <a
              key={p.id}
              href={p.live ?? "#"}
              target={p.live ? "_blank" : undefined}
              rel={p.live ? "noopener noreferrer" : undefined}
              data-cursor="link"
              className="group relative block border-t border-[var(--line)] py-7 transition-colors"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-5 -right-5 origin-left scale-x-0 bg-[var(--fg)]/[0.04] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
              <div className="relative flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
                    {p.index}
                  </span>
                  <h4 className={`${serif} text-2xl font-normal`}>{p.title}</h4>
                  <span className="font-mono text-[0.625rem] italic text-[var(--dim)]">
                    {p.discipline}
                  </span>
                </div>
                <span className="flex items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
                  {p.year}
                  <span className="text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </span>
              </div>
              <p className="relative mt-3 max-w-[62ch] text-sm leading-relaxed text-[var(--muted)]">
                {p.summary}
              </p>
              <p className="relative mt-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
                {p.stack.join(" · ")}
              </p>
            </a>
          ))}
        </div>
      </Section>

      {/* ── Toolkit ──────────────────────────────────────────────────── */}
      <Section id="toolkit">
        <Heading>Toolkit</Heading>
        <dl className="mt-8 border-b border-[var(--line)]">
          {skills.map((row) => (
            <div
              key={row.group}
              className="grid gap-x-6 gap-y-2 border-t border-[var(--line)] py-5 sm:grid-cols-[10rem_1fr] sm:items-baseline"
            >
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
                {row.group}
              </dt>
              <dd className="text-lg text-[var(--fg)]">{row.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── Education ────────────────────────────────────────────────── */}
      <Section id="education">
        <Heading>Education</Heading>
        <Reveal>
          <article className="mt-8 border-t border-[var(--line)] pt-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className={`${serif} text-2xl font-normal`}>{education.degree}</h3>
              <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                {education.period}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--dim)]">
              {education.school} · {education.location}
            </p>
            <p className={`${serif} mt-4 text-xl italic text-[var(--muted)]`}>
              {education.result}
            </p>
            <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--dim)]">
              {education.coursework.join(" · ")}
            </p>
            <p className="mt-5 border-t border-[var(--line)] pt-5 text-sm text-[var(--dim)]">
              {education.prior.title} — {education.prior.school} · {education.prior.period}
            </p>
          </article>
        </Reveal>
      </Section>

      {/* ── Contact / Colophon ───────────────────────────────────────── */}
      <section id="contact" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:px-12">
        <div className="border-t border-[var(--line-strong)] pt-10">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
            Let&apos;s build something
          </p>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="link"
            className={`${serif} mt-4 block text-[clamp(2.6rem,9vw,6rem)] italic font-light leading-none transition-colors hover:text-[var(--accent)]`}
          >
            Say hello.
          </a>
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--line)] pt-6 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-[var(--fg)]">
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--fg)]">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--fg)]">
            LinkedIn
          </a>
          <span className="ml-auto">© {new Date().getFullYear()} {profile.name}</span>
        </div>
      </section>
    </main>
  );
}

/* ── Local primitives ─────────────────────────────────────────────── */

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-16 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
      {children}
    </section>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className={`${serif} text-[clamp(1.75rem,4vw,2.5rem)] font-light tracking-[-0.02em]`}>
        {children}
      </h2>
    </Reveal>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
