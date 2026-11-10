"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Counter } from "@/components/ScrollFX";
import { education, experience, profile, skills, stats } from "@/lib/content";
import { featured, projects } from "@/lib/projects";

const serif = "font-[family-name:var(--font-v1-serif)]";
const EASE = [0.16, 1, 0.3, 1] as const;

export default function EditorialDusk() {
  const reduce = useReducedMotion();

  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22, filter: reduce ? "none" : "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: EASE },
    },
  };

  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  return (
    <main className="relative overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 pb-24 pt-28 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.span
            variants={rise}
            className="rounded-full border border-[var(--glass-line)] bg-[var(--glass)] px-4 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-[var(--muted)] backdrop-blur-md"
          >
            {profile.location}
          </motion.span>

          <motion.h1
            variants={rise}
            className={`${serif} mt-8 text-[clamp(2.6rem,7vw,5.5rem)] font-light leading-[1.05] tracking-[-0.02em]`}
          >
            Hey there — I&apos;m {profile.first},
            <br />
            <span className="italic text-[var(--accent)]">a full-stack developer</span>
            <br />
            based in Delhi NCR.
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-8 max-w-xl text-base leading-relaxed text-[var(--muted)]"
          >
            {profile.line}
          </motion.p>

          <motion.div variants={rise} className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
              className="rounded-full border border-[var(--glass-line)] bg-[var(--glass)] px-6 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--fg)] backdrop-blur-md transition-colors hover:border-[var(--accent)]"
            >
              GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* Status pill */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 flex items-center gap-3 rounded-full border border-[var(--glass-line)] bg-[var(--glass)] px-5 py-2.5 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            {profile.status}
          </span>
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <Section>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--glass-line)] bg-[var(--glass-line)] backdrop-blur-md md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--glass)] px-6 py-8 text-center">
              <p className={`${serif} text-4xl font-light lg:text-5xl`}>
                <Counter value={s.value} />
              </p>
              <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--dim)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <Section>
        <Heading>Experience</Heading>
        <div className="mt-10 space-y-4">
          {experience.map((role) => (
            <Reveal key={role.id}>
              <article className="rounded-2xl border border-[var(--glass-line)] bg-[var(--glass)] p-7 backdrop-blur-md sm:p-9">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className={`${serif} text-2xl font-normal`}>{role.title}</h3>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                    {role.period}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--dim)]">
                  {role.org}
                  {role.location ? ` · ${role.location}` : ""}
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                  {role.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {role.meta.map((m) => (
                    <Tag key={m}>{m}</Tag>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Featured ─────────────────────────────────────────────────── */}
      <Section>
        <Heading>Selected work</Heading>
        <Reveal>
          <article className="mt-10 grid gap-8 rounded-3xl border border-[var(--glass-line)] bg-[var(--glass)] p-7 backdrop-blur-md sm:p-10 lg:grid-cols-2">
            <div>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                {featured.context}
              </span>
              <h3 className={`${serif} mt-3 text-[clamp(2.4rem,6vw,4rem)] font-light leading-none`}>
                {featured.name}
              </h3>
              <p className={`${serif} mt-3 text-lg italic text-[var(--muted)]`}>
                {featured.subtitle}
              </p>
              <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--dim)]">
                {featured.role}
              </p>
              <div className="mt-6 space-y-4 border-t border-[var(--line)] pt-6">
                {featured.body.map((p) => (
                  <p key={p.slice(0, 20)} className="text-sm leading-relaxed text-[var(--muted)]">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {featured.stack.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={`${featured.name} — ${featured.subtitle}`}
                className="w-full rounded-2xl border border-[var(--line)]"
              />
              <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--glass-line)] bg-[var(--glass-line)]">
                {featured.points.map((p) => (
                  <div key={p.k} className="bg-[var(--glass)] px-4 py-4">
                    <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-[var(--dim)]">
                      {p.k}
                    </dt>
                    <dd className={`${serif} mt-1.5 text-sm`}>{p.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </Reveal>

        {/* Roster */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <Reveal key={p.id}>
              <a
                href={p.live ?? "#"}
                target={p.live ? "_blank" : undefined}
                rel={p.live ? "noopener noreferrer" : undefined}
                data-cursor="link"
                className="group flex h-full flex-col rounded-2xl border border-[var(--glass-line)] bg-[var(--glass)] p-6 backdrop-blur-md transition-colors hover:border-[var(--accent)]"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--dim)]">
                    {p.index}
                  </span>
                  {p.year && (
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--dim)]">
                      {p.year}
                    </span>
                  )}
                </div>
                <h3 className={`${serif} mt-3 text-2xl font-normal`}>{p.title}</h3>
                <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                  {p.discipline}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                  {p.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <Section>
        <Heading>Toolkit</Heading>
        <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-[var(--glass-line)] bg-[var(--glass-line)]">
          {skills.map((row) => (
            <div
              key={row.group}
              className="grid gap-3 bg-[var(--glass)] px-6 py-6 sm:grid-cols-4 sm:items-baseline"
            >
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--dim)]">
                {row.group}
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-2 sm:col-span-3">
                {row.items.map((i) => (
                  <span key={i} className={`${serif} text-lg`}>
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Education ────────────────────────────────────────────────── */}
      <Section>
        <Heading>Education</Heading>
        <Reveal>
          <div className="mt-10 rounded-2xl border border-[var(--glass-line)] bg-[var(--glass)] p-7 backdrop-blur-md sm:p-9">
            <h3 className={`${serif} text-2xl font-normal`}>{education.degree}</h3>
            <p className="mt-2 text-sm text-[var(--dim)]">
              {education.school} · {education.location}
            </p>
            <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--accent)]">
              {education.period}
            </p>
            <p className={`${serif} mt-5 text-xl`}>{education.result}</p>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--line)] pt-6">
              {education.coursework.map((c) => (
                <Tag key={c}>{c}</Tag>
              ))}
            </div>
            <p className="mt-6 text-sm text-[var(--dim)]">
              {education.prior.title} — {education.prior.school} · {education.prior.period}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-28 text-center">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-[var(--dim)]">
          Let&apos;s build something
        </p>
        <a
          href={`mailto:${profile.email}`}
          data-cursor="link"
          className={`${serif} mt-6 block text-[clamp(3rem,12vw,8rem)] font-light leading-none transition-colors hover:text-[var(--accent)]`}
        >
          Say <span className="italic">hello</span>
        </a>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[var(--dim)]">
          <a href={`mailto:${profile.email}`} className="hover:text-[var(--fg)]">
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
            LinkedIn
          </a>
          <span>© {new Date().getFullYear()} {profile.name}</span>
        </div>
      </section>
    </main>
  );
}

/* ── Local primitives ─────────────────────────────────────────────── */

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">{children}</section>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className="font-[family-name:var(--font-v1-serif)] text-[clamp(1.8rem,4vw,2.75rem)] font-light tracking-[-0.02em]">
        {children}
      </h2>
    </Reveal>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 20, filter: reduce ? "none" : "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
      {children}
    </span>
  );
}
