"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { education, experience, profile, skills, stats } from "@/lib/content";
import { featured, projects } from "@/lib/projects";

const serif = "font-[family-name:var(--font-v7-serif)]";
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Variant 07 — the Editorial Dusk world (v1) run through tasteskill.dev's
 * anti-slop rules: an asymmetric split hero instead of a centered one,
 * Cormorant Garamond instead of the LLM-default Fraunces, one eyebrow on
 * the whole page (the hero's), commas instead of middots, no em dashes,
 * and an outlined-pill motif standing in for every card the original
 * would have reached for.
 */
export default function DuskManifesto() {
  const reduce = useReducedMotion();

  const fromLeft: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -18 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
  };
  const fromRight: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : 18 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE, delay: 0.15 } },
  };

  return (
    <main className="relative overflow-hidden">
      {/* ── Hero: asymmetric split ──────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-24 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-12 lg:pt-28">
        <motion.div initial="hidden" animate="show" variants={fromLeft}>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--dim)]">
            {profile.location}
          </p>
          <h1 className={`${serif} mt-5 text-[clamp(2.4rem,5.6vw,4rem)] font-medium leading-[1.1]`}>
            Full-stack products that <em className="text-[var(--accent)]">keep running</em> long after launch.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--muted)]">
            Computer science undergrad in Delhi NCR, team lead on Smart India
            Hackathon 2026, keeping a dozen self-hosted services running.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              data-cursor="link"
              className="rounded-full bg-[var(--fg)] px-6 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--bg)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book a call
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="rounded-full border border-[var(--line-strong)] px-6 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
            >
              View GitHub
            </a>
          </div>
        </motion.div>

        {/* Specimen plate — a real asset from the work below, not a stock photo. */}
        <motion.div initial="hidden" animate="show" variants={fromRight}>
          <div className="overflow-hidden rounded-2xl border border-[var(--line-strong)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.image}
              alt={`${featured.name}, ${featured.subtitle}`}
              className="w-full"
            />
          </div>
          <p className="mt-3 text-sm text-[var(--dim)]">
            Featured work: {featured.name}, {featured.subtitle.toLowerCase()}.
          </p>
        </motion.div>
      </section>

      {/* ── About: one statement, no card ───────────────────────────── */}
      <Section>
        <Reveal>
          <p className={`${serif} max-w-3xl text-[clamp(1.4rem,2.6vw,1.9rem)] italic leading-snug text-[var(--fg)]`}>
            I am three years into a computer science degree with an{" "}
            {stats[0].value} CGPA, {profile.status.toLowerCase()}. I led six
            engineers through a national hackathon, I keep a dozen
            self-hosted services online without a hosting bill, and I
            already know what happens six months after a product ships. I
            am usually still the one running it.
          </p>
        </Reveal>
      </Section>

      {/* ── Experience: timeline rail ────────────────────────────────── */}
      <Section>
        <Heading>Experience</Heading>
        <div className="relative mt-10 border-l border-[var(--line-strong)] pl-8">
          {experience.map((role) => (
            <TimelineEntry
              key={role.id}
              period={role.period}
              title={role.title}
              subtitle={role.location ? `${role.org}, ${role.location}` : role.org}
              body={role.body}
              tags={role.meta}
            />
          ))}
        </div>
      </Section>

      {/* ── Work: spotlight + asymmetric roster ─────────────────────── */}
      <Section>
        <Heading>Work</Heading>

        <Reveal>
          <article className="mt-10 border-y border-[var(--line)] py-10">
            <h3 className={`${serif} text-[clamp(2rem,5vw,3.25rem)] italic font-medium leading-none`}>
              {featured.name}
            </h3>
            <p className="mt-3 max-w-2xl text-base text-[var(--muted)]">
              {featured.subtitle}, built for the {featured.context} as{" "}
              {featured.role.toLowerCase()}.
            </p>

            <blockquote
              className={`${serif} mt-8 max-w-2xl border-l border-[var(--accent)] pl-6 text-xl italic leading-snug text-[var(--fg)]`}
            >
              {featured.body[1]}
            </blockquote>

            <div className="mt-8 space-y-4">
              {[featured.body[0], featured.body[2]].map((p) => (
                <p key={p.slice(0, 20)} className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {[...featured.stack, ...featured.points.map((p) => `${p.k}: ${p.v}`)].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </article>
        </Reveal>

        {/* Roster — one lead entry, four in a tighter row. Five items, five cells. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} className={i === 0 ? "sm:col-span-2" : ""}>
              <a
                href={p.live ?? "#"}
                target={p.live ? "_blank" : undefined}
                rel={p.live ? "noopener noreferrer" : undefined}
                data-cursor="link"
                className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-[var(--line)] p-6 transition-colors duration-300 hover:border-[var(--accent)] sm:p-7"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className={`${serif} text-2xl italic font-medium sm:text-3xl`}>
                      {p.title}
                    </h4>
                    <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--dim)]">
                      {p.year ?? ""}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--dim)]">{p.discipline}</p>
                  <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-[var(--muted)]">
                    {p.summary}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {p.stack.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                  <span className="ml-auto text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Toolkit: chip clusters ───────────────────────────────────── */}
      <Section>
        <Heading>Toolkit</Heading>
        <div className="mt-10 space-y-8">
          {skills.map((row) => (
            <div key={row.group}>
              <p className={`${serif} text-lg italic text-[var(--muted)]`}>{row.group}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {row.items.map((i) => (
                  <Chip key={i}>{i}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Education: same rail as Experience ───────────────────────── */}
      <Section>
        <Heading>Education</Heading>
        <div className="relative mt-10 border-l border-[var(--line-strong)] pl-8">
          <TimelineEntry
            period={education.period}
            title={education.degree}
            subtitle={`${education.school}, ${education.location}`}
            body={education.result}
            tags={education.coursework}
          />
          <p className="mt-2 text-sm text-[var(--dim)]">
            {education.prior.title}, {education.prior.school}, {education.prior.period}.
          </p>
        </div>
      </Section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:px-12">
        <Reveal>
          <Heading>Contact</Heading>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="link"
            className={`${serif} mt-8 block text-[clamp(2rem,7vw,4.5rem)] italic font-medium leading-none transition-colors hover:text-[var(--accent)]`}
          >
            {profile.email}
          </a>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--dim)]">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--fg)]">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--fg)]">
              LinkedIn
            </a>
          </div>
        </Reveal>
        <p className="mt-16 border-t border-[var(--line)] pt-6 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--dim)]">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </section>
    </main>
  );
}

/* ── Local primitives ─────────────────────────────────────────────── */

function Section({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18 lg:px-12">{children}</section>;
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className={`${serif} text-[clamp(1.75rem,4vw,2.5rem)] font-medium`}>{children}</h2>
    </Reveal>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--line-strong)] px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-[var(--dim)]">
      {children}
    </span>
  );
}

function TimelineEntry({
  period,
  title,
  subtitle,
  body,
  tags,
}: {
  period: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
}) {
  return (
    <Reveal className="relative pb-12 last:pb-0">
      <span className="absolute -left-[2.125rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--dim)]">{period}</p>
      <h3 className={`${serif} mt-2 text-2xl italic font-medium`}>{title}</h3>
      <p className="mt-1 text-sm text-[var(--dim)]">{subtitle}</p>
      <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-[var(--muted)]">{body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
    </Reveal>
  );
}
