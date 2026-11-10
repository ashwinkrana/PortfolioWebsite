"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Counter } from "@/components/ScrollFX";
import { education, experience, profile, skills, stats } from "@/lib/content";
import { featured, projects } from "@/lib/projects";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Rounded card, lifts a touch on hover. */
function Card({
  children,
  className = "",
  tone = "card",
  lift = true,
  href,
  external,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "card" | "lilac" | "mint" | "peach" | "sky" | "ink";
  lift?: boolean;
  href?: string;
  external?: boolean;
}) {
  const reduce = useReducedMotion();
  const tones: Record<string, string> = {
    card: "bg-[var(--card)] text-[var(--ink)]",
    lilac: "bg-[var(--lilac)] text-[var(--lilac-ink)]",
    mint: "bg-[var(--mint)] text-[var(--mint-ink)]",
    peach: "bg-[var(--peach)] text-[var(--peach-ink)]",
    sky: "bg-[var(--sky)] text-[var(--sky-ink)]",
    ink: "bg-[var(--ink-card)] text-[#f1efe9]",
  };
  const shared = {
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: EASE },
    whileHover: lift && !reduce ? { y: -6 } : undefined,
    className: `rounded-[1.75rem] p-6 sm:p-8 ${tones[tone]} ${className}`,
  } as const;

  if (href) {
    return (
      <motion.a
        {...shared}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-cursor="link"
      >
        {children}
      </motion.a>
    );
  }
  return <motion.div {...shared}>{children}</motion.div>;
}

function Chip({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        dark
          ? "bg-white/10 text-current"
          : "bg-[var(--bg)] text-[var(--muted)]"
      }`}
    >
      {children}
    </span>
  );
}

export default function BentoLight() {
  const reduce = useReducedMotion();
  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6">
      {/* ── Wordmark ─────────────────────────────────────────────────── */}
      <motion.header
        variants={stagger}
        initial="hidden"
        animate="show"
        className="pt-6"
      >
        <motion.p
          variants={item}
          className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]"
        >
          {profile.name} — {profile.location}
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-2 text-[clamp(3rem,15vw,11rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em]"
        >
          Portfolio
        </motion.h1>
      </motion.header>

      {/* ── Hero bento ───────────────────────────────────────────────── */}
      <section className="mt-6 grid gap-3 sm:grid-cols-6">
        <Card tone="lilac" className="sm:col-span-2 sm:row-span-2" lift={false}>
          <div className="flex h-full flex-col justify-between gap-6">
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              About me
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portrait.png"
              alt={profile.name}
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <div>
              <p className="text-3xl font-semibold leading-tight tracking-tight">
                I&apos;m {profile.first} {profile.last}
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-2 inline-block text-sm underline underline-offset-4"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </Card>

        <Card className="sm:col-span-4" lift={false}>
          <p className="text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            {profile.line}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Chip>Full-stack</Chip>
            <Chip>Systems</Chip>
            <Chip>SQL &amp; data</Chip>
            <Chip>Design</Chip>
          </div>
        </Card>

        {stats.map((s, i) => (
          <Card
            key={s.label}
            tone={(["mint", "peach", "sky", "ink"] as const)[i]}
            className="sm:col-span-1"
          >
            <p className="text-4xl font-bold tracking-tight">
              <Counter value={s.value} />
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] opacity-80">
              {s.label}
            </p>
          </Card>
        ))}
      </section>

      {/* ── Status ───────────────────────────────────────────────────── */}
      <section className="mt-3">
        <Card tone="ink" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" lift={false}>
          <span className="flex items-center gap-3 text-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--mint)]" />
            {profile.status}
          </span>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="link"
            className="w-fit rounded-full bg-[#f1efe9] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--ink)]"
          >
            Get in touch ↗
          </a>
        </Card>
      </section>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <SectionTitle>Experience</SectionTitle>
      <section className="grid gap-3 sm:grid-cols-2">
        {experience.map((role) => (
          <Card key={role.id}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold tracking-tight">{role.title}</h3>
              <span className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                {role.period}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {role.org}
              {role.location ? ` · ${role.location}` : ""}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              {role.body}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {role.meta.map((m) => (
                <Chip key={m}>{m}</Chip>
              ))}
            </div>
          </Card>
        ))}
      </section>

      {/* ── Featured ─────────────────────────────────────────────────── */}
      <SectionTitle>Selected work</SectionTitle>
      <section className="grid gap-3">
        <Card tone="lilac" lift={false}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.2em]">
                {featured.context}
              </span>
              <h3 className="mt-2 text-[clamp(2.5rem,7vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em]">
                {featured.name}
              </h3>
              <p className="mt-2 text-lg font-medium">{featured.subtitle}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] opacity-70">
                {featured.role}
              </p>
              <div className="mt-5 space-y-3">
                {featured.body.map((p) => (
                  <p key={p.slice(0, 20)} className="text-sm leading-relaxed opacity-90">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {featured.stack.map((t) => (
                  <Chip key={t} dark>
                    {t}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={`${featured.name} — ${featured.subtitle}`}
                className="w-full rounded-2xl"
              />
              <dl className="mt-3 grid grid-cols-2 gap-2">
                {featured.points.map((p) => (
                  <div key={p.k} className="rounded-xl bg-white/40 px-4 py-3">
                    <dt className="text-[0.625rem] font-medium uppercase tracking-[0.15em] opacity-70">
                      {p.k}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">{p.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Card
              key={p.id}
              href={p.live ?? undefined}
              external={Boolean(p.live)}
              tone={(["card", "mint", "peach", "sky", "card"] as const)[i % 5]}
              className="flex h-full flex-col"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.15em] opacity-60">
                  {p.index}
                </span>
                {p.year && (
                  <span className="text-xs font-medium uppercase tracking-[0.15em] opacity-60">
                    {p.year}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] opacity-70">
                {p.discipline}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed opacity-90">
                {p.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <span key={t} className="rounded-full bg-black/10 px-2.5 py-0.5 text-[0.6875rem]">
                    {t}
                  </span>
                ))}
              </div>
              {p.live && (
                <span className="mt-3 text-xs font-semibold">
                  Live — {p.live.replace(/^https:\/\//, "")} ↗
                </span>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <SectionTitle>Toolkit</SectionTitle>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((row) => (
          <Card key={row.group} lift={false}>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              {row.group}
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {row.items.map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
          </Card>
        ))}
      </section>

      {/* ── Education ────────────────────────────────────────────────── */}
      <SectionTitle>Education</SectionTitle>
      <Card lift={false}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">{education.degree}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {education.school} · {education.location}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-[var(--muted)]">
              {education.period}
            </p>
            <p className="mt-4 text-xl font-semibold">{education.result}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Coursework
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {education.coursework.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
            <p className="mt-5 text-sm text-[var(--muted)]">
              {education.prior.title} — {education.prior.school} · {education.prior.period}
            </p>
          </div>
        </div>
      </Card>

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <section className="mt-16">
        <Card tone="ink" lift={false}>
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-70">
            Let&apos;s build something
          </p>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="link"
            className="mt-3 block text-[clamp(3rem,13vw,9rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em]"
          >
            Say hello
          </a>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-[0.15em] opacity-70">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <span>© {new Date().getFullYear()} {profile.name}</span>
          </div>
        </Card>
      </section>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.h2
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mb-4 mt-16 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]"
    >
      {children}
    </motion.h2>
  );
}
