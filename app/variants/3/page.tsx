"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Counter } from "@/components/ScrollFX";
import { education, experience, profile, skills, stats } from "@/lib/content";
import { featured, projects } from "@/lib/projects";

const display = "font-display font-black uppercase";

/* Hard, quick reveal — no easing softness, matches the brutalist tone. */
function Snap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, x: reduce ? 0 : -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Ruler strip — pure decoration, the grid made literal. */
function Ruler() {
  return (
    <div
      aria-hidden
      className="flex h-4 items-end justify-between border-x border-[var(--line)] px-[1px]"
    >
      {Array.from({ length: 48 }).map((_, i) => (
        <span
          key={i}
          className={`w-px bg-[var(--line)] ${i % 6 === 0 ? "h-4" : "h-2"}`}
        />
      ))}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 border-t border-[var(--line)] sm:grid-cols-[10rem_1fr]">
      <div className="border-b border-[var(--hairline)] px-4 py-3 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--muted)] sm:border-b-0 sm:border-r sm:border-[var(--line)]">
        {label}
      </div>
      <div className="px-4 py-3 text-sm">{children}</div>
    </div>
  );
}

export default function BrutalistMono() {
  return (
    <main className="mx-auto max-w-6xl px-3 pb-20 pt-16 sm:px-5">
      <div className="border border-[var(--line)]">
        {/* ── Masthead ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] px-4 py-2 text-[0.625rem] uppercase tracking-[0.2em]">
          <span>{profile.name}</span>
          <span className="text-[var(--muted)]">{profile.location}</span>
          <span className="text-[var(--accent)]">Portfolio / V.03</span>
        </div>

        <Snap>
          <h1 className={`${display} px-3 pt-4 text-[clamp(2.5rem,15vw,10rem)] leading-[0.82] tracking-[-0.04em]`}>
            {profile.first}
            <br />
            {profile.last}
          </h1>
        </Snap>

        <div className="px-3 pb-4 pt-2">
          <Ruler />
        </div>

        <div className="grid grid-cols-1 border-t border-[var(--line)] sm:grid-cols-2">
          <p className="border-b border-[var(--line)] px-4 py-4 text-sm leading-relaxed sm:border-b-0 sm:border-r">
            {profile.line}
          </p>
          <div className="flex flex-col justify-between gap-3 px-4 py-4">
            <p className="text-[0.625rem] uppercase leading-relaxed tracking-[0.2em] text-[var(--muted)]">
              [ STATUS ] {profile.status}
            </p>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="link"
              className="w-fit border border-[var(--line)] bg-[var(--fg)] px-4 py-2 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg)]"
            >
              {profile.email} →
            </a>
          </div>
        </div>

        {/* ── Index numbers ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 border-t border-[var(--line)] md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-6 ${i % 2 === 0 ? "border-r border-[var(--line)]" : ""} ${
                i < 2 ? "border-b border-[var(--line)] md:border-b-0" : ""
              } ${i === 2 ? "md:border-r md:border-[var(--line)]" : ""}`}
            >
              <p className={`${display} text-5xl leading-none tracking-[-0.03em] lg:text-7xl`}>
                <Counter value={s.value} />
              </p>
              <p className="mt-3 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <Block index="01" title="Experience" note={`${experience.length} roles`}>
        {experience.map((role) => (
          <Snap key={role.id} className="border-t border-[var(--line)] first:border-t-0">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr]">
              <div className="border-b border-[var(--hairline)] px-4 py-5 lg:border-b-0 lg:border-r lg:border-[var(--line)]">
                <h3 className={`${display} text-xl leading-tight lg:text-2xl`}>
                  {role.title}
                </h3>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {role.org}
                  {role.location ? ` / ${role.location}` : ""}
                </p>
                <p className="mt-2 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                  {role.period}
                </p>
              </div>
              <div className="px-4 py-5">
                <p className="text-sm leading-relaxed">{role.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.meta.map((m) => (
                    <span
                      key={m}
                      className="border border-[var(--line)] px-2 py-0.5 text-[0.5625rem] uppercase tracking-[0.18em]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Snap>
        ))}
      </Block>

      {/* ── Featured ─────────────────────────────────────────────────── */}
      <Block index="02" title="Selected Work" note="01 / featured">
        <Snap className="border-t border-[var(--line)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-b border-[var(--line)] px-4 py-6 lg:border-b-0 lg:border-r">
              <p className="text-[0.625rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                {featured.context}
              </p>
              <h3 className={`${display} mt-2 text-[clamp(2.5rem,8vw,5rem)] leading-[0.85] tracking-[-0.04em]`}>
                {featured.name}
              </h3>
              <p className="mt-3 text-sm uppercase tracking-wide">{featured.subtitle}</p>
              <p className="mt-1 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                {featured.role}
              </p>
              <div className="mt-5 space-y-3 border-t border-[var(--hairline)] pt-4">
                {featured.body.map((p) => (
                  <p key={p.slice(0, 20)} className="text-sm leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {featured.stack.map((t) => (
                  <span
                    key={t}
                    className="border border-[var(--line)] px-2 py-0.5 text-[0.5625rem] uppercase tracking-[0.18em]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-4 py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={`${featured.name} — ${featured.subtitle}`}
                className="w-full border border-[var(--line)] grayscale"
              />
              <dl className="mt-4 grid grid-cols-2">
                {featured.points.map((p, i) => (
                  <div
                    key={p.k}
                    className={`border border-[var(--line)] px-3 py-3 ${i % 2 ? "border-l-0" : ""} ${
                      i < 2 ? "" : "border-t-0"
                    }`}
                  >
                    <dt className="text-[0.5625rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                      {p.k}
                    </dt>
                    <dd className="mt-1 text-xs uppercase tracking-wide">{p.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Snap>

        {projects.map((p) => (
          <Snap key={p.id} className="border-t border-[var(--line)]">
            <a
              href={p.live ?? "#"}
              target={p.live ? "_blank" : undefined}
              rel={p.live ? "noopener noreferrer" : undefined}
              data-cursor="link"
              className="group grid grid-cols-[3rem_1fr] items-start gap-3 px-4 py-6 transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)] sm:grid-cols-[4rem_1fr_10rem]"
            >
              <span className="text-[0.625rem] uppercase tracking-[0.2em]">{p.index}</span>
              <div className="min-w-0">
                <h3 className={`${display} text-2xl leading-none tracking-[-0.02em] sm:text-3xl`}>
                  {p.title}
                </h3>
                <p className="mt-1 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--muted)] group-hover:text-[var(--bg)]/70">
                  {p.discipline}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed">{p.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <span
                      key={t}
                      className="border border-current px-2 py-0.5 text-[0.5625rem] uppercase tracking-[0.18em] opacity-70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="hidden text-right text-[0.625rem] uppercase tracking-[0.2em] text-[var(--muted)] group-hover:text-[var(--bg)] sm:block">
                {p.year ?? "—"}
                <span className="mt-2 block text-lg">↗</span>
              </span>
            </a>
          </Snap>
        ))}
      </Block>

      {/* ── Toolkit ──────────────────────────────────────────────────── */}
      <Block index="03" title="Toolkit">
        {skills.map((row) => (
          <Row key={row.group} label={row.group}>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {row.items.map((i) => (
                <span key={i} className="uppercase tracking-wide">
                  {i}
                </span>
              ))}
            </div>
          </Row>
        ))}
      </Block>

      {/* ── Education ────────────────────────────────────────────────── */}
      <Block index="04" title="Education">
        <Row label="Degree">
          <span className={`${display} text-lg`}>{education.degree}</span>
        </Row>
        <Row label="Institution">
          {education.school} / {education.location}
        </Row>
        <Row label="Period">
          <span className="text-[var(--accent)]">{education.period}</span>
        </Row>
        <Row label="Result">{education.result}</Row>
        <Row label="Coursework">
          <div className="flex flex-wrap gap-2">
            {education.coursework.map((c) => (
              <span
                key={c}
                className="border border-[var(--line)] px-2 py-0.5 text-[0.5625rem] uppercase tracking-[0.18em]"
              >
                {c}
              </span>
            ))}
          </div>
        </Row>
        <Row label="Prior">
          {education.prior.title} — {education.prior.school} / {education.prior.period}
        </Row>
      </Block>

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <section className="mt-4 border border-[var(--line)] px-4 py-14 text-center">
        <p className="text-[0.625rem] uppercase tracking-[0.2em] text-[var(--muted)]">
          [ Let&apos;s build something ]
        </p>
        <a
          href={`mailto:${profile.email}`}
          data-cursor="link"
          className={`${display} mt-4 block text-[clamp(3rem,16vw,11rem)] leading-[0.8] tracking-[-0.05em] transition-colors hover:text-[var(--accent)]`}
        >
          Say Hello
        </a>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--muted)]">
          <a href={`mailto:${profile.email}`} className="hover:text-[var(--fg)]">
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
            LinkedIn
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </section>
    </main>
  );
}

function Block({
  index,
  title,
  note,
  children,
}: {
  index: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4 border border-[var(--line)]">
      <header className="flex items-end justify-between gap-4 border-b border-[var(--line)] px-4 py-3">
        <div className="flex items-baseline gap-3">
          <span className="text-[0.625rem] uppercase tracking-[0.2em] text-[var(--accent)]">
            {index}
          </span>
          <h2 className={`${display} text-2xl tracking-[-0.02em] sm:text-4xl`}>{title}</h2>
        </div>
        {note && (
          <span className="text-[0.625rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            {note}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}
