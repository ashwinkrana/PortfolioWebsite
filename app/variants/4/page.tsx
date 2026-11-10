"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { education, experience, profile, skills, stats } from "@/lib/content";
import { featured, projects } from "@/lib/projects";

/* Blinking block cursor — Framer loop, silenced under reduced-motion. */
function Caret() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.12em] bg-[var(--green)]"
      animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

/* A framed terminal pane with a title bar. */
function Pane({
  path,
  cmd,
  children,
}: {
  path: string;
  cmd?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 border border-[var(--line)] bg-[var(--panel)]">
      <div className="flex items-center gap-3 border-b border-[var(--line)] px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--green)]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--amber)]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--dim)]/50" />
        </span>
        <span className="text-[0.6875rem] text-[var(--dim)]">
          {path}
          {cmd ? ` — ${cmd}` : ""}
        </span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

function Bar({ label, value, pct }: { label: string; value: string; pct: number }) {
  const cells = 24;
  const filled = Math.round((pct / 100) * cells);
  return (
    <div className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 text-xs">
      <span className="text-[var(--dim)]">{label}</span>
      <span className="tracking-[-0.05em] text-[var(--green)]">
        [<span className="text-[var(--green)]">{"|".repeat(filled)}</span>
        <span className="text-[var(--line)]">{"|".repeat(cells - filled)}</span>]
      </span>
      <span className="text-[var(--amber)]">{value}</span>
    </div>
  );
}

const barPct: Record<string, number> = {
  CGPA: 85,
  "Engineers led": 60,
  Graduating: 70,
  "Services running": 80,
};

export default function TerminalSystems() {
  const reduce = useReducedMotion();

  const boot: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.35 } },
  };
  const bootLine: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.05 } },
  };

  return (
    <main className="mx-auto max-w-5xl px-3 pb-20 pt-16 text-sm sm:px-5">
      {/* ── Boot sequence ────────────────────────────────────────────── */}
      <motion.section
        variants={boot}
        initial="hidden"
        animate="show"
        className="mt-4 space-y-1.5 leading-relaxed"
      >
        <motion.p variants={bootLine} className="text-[var(--dim)]">
          <span className="text-[var(--green)]">visitor@portfolio</span>:~$ ./introduce --whoami
        </motion.p>
        <motion.p variants={bootLine}>
          <span className="text-[var(--amber)]">name</span> ....... {profile.name}
        </motion.p>
        <motion.p variants={bootLine}>
          <span className="text-[var(--amber)]">role</span> ....... Full-stack developer
        </motion.p>
        <motion.p variants={bootLine}>
          <span className="text-[var(--amber)]">loc</span> ........ {profile.location}
        </motion.p>
        <motion.p variants={bootLine}>
          <span className="text-[var(--amber)]">status</span> ..... <span className="text-[var(--green)]">{profile.status}</span>
        </motion.p>
        <motion.p variants={bootLine} className="pt-3 text-[var(--fg)]">
          {profile.line}
        </motion.p>
        <motion.p variants={bootLine} className="pt-4 text-[var(--dim)]">
          <span className="text-[var(--green)]">visitor@portfolio</span>:~$ <Caret />
        </motion.p>
      </motion.section>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`mailto:${profile.email}`}
          data-cursor="link"
          className="border border-[var(--green)] px-4 py-2 text-xs uppercase tracking-[0.15em] text-[var(--green)] transition-colors hover:bg-[var(--green)] hover:text-[var(--bg)]"
        >
          $ mail {profile.email}
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.15em] text-[var(--dim)] transition-colors hover:border-[var(--green)] hover:text-[var(--fg)]"
        >
          $ open github
        </a>
      </div>

      {/* ── Stats / htop ─────────────────────────────────────────────── */}
      <Pane path="~/metrics" cmd="htop">
        <div className="space-y-2">
          {stats.map((s) => (
            <Bar key={s.label} label={s.label} value={s.value} pct={barPct[s.label] ?? 50} />
          ))}
        </div>
      </Pane>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <Pane path="~/experience" cmd="cat roles.log">
        <div className="divide-y divide-[var(--line)]">
          {experience.map((role) => (
            <Wipe key={role.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base text-[var(--green)]">
                  <span className="text-[var(--dim)]">$</span> {role.title}
                </h3>
                <span className="text-[0.6875rem] text-[var(--amber)]">{role.period}</span>
              </div>
              <p className="mt-1 text-[0.6875rem] text-[var(--dim)]">
                {role.org}
                {role.location ? ` :: ${role.location}` : ""}
              </p>
              <p className="mt-3 leading-relaxed text-[var(--fg)]">{role.body}</p>
              <p className="mt-3 text-[0.6875rem] text-[var(--dim)]">
                # {role.meta.join("  ·  ")}
              </p>
            </Wipe>
          ))}
        </div>
      </Pane>

      {/* ── Featured ─────────────────────────────────────────────────── */}
      <Pane path="~/work/mohar" cmd="./verify --field">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-[0.6875rem] uppercase tracking-[0.15em] text-[var(--amber)]">
              {featured.context}
            </p>
            <h3 className="mt-1 text-3xl uppercase tracking-tight text-[var(--green)] sm:text-4xl">
              {featured.name}
            </h3>
            <p className="mt-2 text-[var(--fg)]">{featured.subtitle}</p>
            <p className="mt-1 text-[0.6875rem] text-[var(--dim)]">{featured.role}</p>
            <div className="mt-4 space-y-3 border-t border-[var(--line)] pt-4 leading-relaxed">
              {featured.body.map((p) => (
                <p key={p.slice(0, 20)}>
                  <span className="text-[var(--dim)]">&gt; </span>
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-4 text-[0.6875rem] text-[var(--dim)]">
              # {featured.stack.join("  ·  ")}
            </p>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.image}
              alt={`${featured.name} — ${featured.subtitle}`}
              className="w-full border border-[var(--line)] opacity-90"
            />
            <dl className="mt-3 space-y-1.5 text-xs">
              {featured.points.map((p) => (
                <div key={p.k} className="flex justify-between gap-3 border-b border-[var(--line)] pb-1.5">
                  <dt className="text-[var(--dim)]">{p.k}</dt>
                  <dd className="text-right text-[var(--fg)]">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Pane>

      {/* ── Roster ───────────────────────────────────────────────────── */}
      <Pane path="~/work" cmd="ls -la --sort=impact">
        <div className="divide-y divide-[var(--line)]">
          {projects.map((p) => (
            <Wipe key={p.id} className="py-4 first:pt-0 last:pb-0">
              <a
                href={p.live ?? "#"}
                target={p.live ? "_blank" : undefined}
                rel={p.live ? "noopener noreferrer" : undefined}
                data-cursor="link"
                className="group block"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base text-[var(--green)] group-hover:underline">
                    <span className="text-[var(--dim)]">{p.index}/</span> {p.title}
                  </h3>
                  <span className="text-[0.6875rem] text-[var(--dim)]">
                    {p.year ?? "drwxr-xr-x"}
                  </span>
                </div>
                <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--amber)]">
                  {p.discipline}
                </p>
                <p className="mt-2 leading-relaxed text-[var(--fg)]">{p.summary}</p>
                <p className="mt-2 text-[0.6875rem] text-[var(--dim)]">
                  # {p.stack.join("  ·  ")}
                  {p.live ? `   ↗ ${p.live.replace(/^https:\/\//, "")}` : ""}
                </p>
              </a>
            </Wipe>
          ))}
        </div>
      </Pane>

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <Pane path="~/toolkit" cmd="pkg list --installed">
        <div className="space-y-2">
          {skills.map((row) => (
            <div key={row.group} className="grid grid-cols-1 gap-1 sm:grid-cols-[8rem_1fr]">
              <span className="text-[var(--amber)]">{row.group}/</span>
              <span className="leading-relaxed text-[var(--fg)]">
                {row.items.join("  ")}
              </span>
            </div>
          ))}
        </div>
      </Pane>

      {/* ── Education ────────────────────────────────────────────────── */}
      <Pane path="~/education" cmd="cat degree.json">
        <div className="space-y-1.5">
          <Line k="degree" v={education.degree} />
          <Line k="school" v={`${education.school} :: ${education.location}`} />
          <Line k="period" v={education.period} amber />
          <Line k="result" v={education.result} green />
          <div className="pt-2">
            <span className="text-[var(--dim)]">coursework:</span>
            <p className="mt-1 leading-relaxed text-[var(--fg)]">
              {education.coursework.join("  ·  ")}
            </p>
          </div>
          <Line
            k="prior"
            v={`${education.prior.title} — ${education.prior.school} (${education.prior.period})`}
          />
        </div>
      </Pane>

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <section className="mt-8 border border-[var(--green)] bg-[var(--panel)] p-6 text-center sm:p-10">
        <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--dim)]">
          # let&apos;s build something
        </p>
        <a
          href={`mailto:${profile.email}`}
          data-cursor="link"
          className="mt-4 block text-[clamp(2.2rem,9vw,5.5rem)] uppercase leading-none tracking-tight text-[var(--green)] transition-colors hover:text-[var(--amber)]"
        >
          $ say hello
          <Caret />
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.6875rem] uppercase tracking-[0.15em] text-[var(--dim)]">
          <a href={`mailto:${profile.email}`} className="hover:text-[var(--fg)]">
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
            github
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
            linkedin
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </section>
    </main>
  );
}

function Line({
  k,
  v,
  green,
  amber,
}: {
  k: string;
  v: string;
  green?: boolean;
  amber?: boolean;
}) {
  return (
    <p className="grid grid-cols-1 gap-1 sm:grid-cols-[7rem_1fr]">
      <span className="text-[var(--dim)]">{k}:</span>
      <span className={green ? "text-[var(--green)]" : amber ? "text-[var(--amber)]" : "text-[var(--fg)]"}>
        {v}
      </span>
    </p>
  );
}

function Wipe({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, x: reduce ? 0 : -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.3, ease: "linear" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
