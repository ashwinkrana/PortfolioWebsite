"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import {
  Counter,
  Parallax,
  RevealText,
  VelocityTicker,
} from "@/components/ScrollFX";
import { education, experience, profile, skills, stats } from "@/lib/content";
import { featured, projects } from "@/lib/projects";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function KineticCarbon() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const nameX = useTransform(heroP, [0, 1], ["0%", reduce ? "0%" : "-14%"]);
  const subX = useTransform(heroP, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  return (
    <main className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col justify-center gap-6 py-32"
      >
        <div className="gutter flex items-center justify-between">
          <span className="label">Portfolio / V.05</span>
          <span className="label hidden sm:block">{profile.location}</span>
        </div>

        <motion.h1
          style={{ x: nameX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="gutter font-display text-[clamp(3.5rem,19vw,16rem)] font-black uppercase leading-[0.78] tracking-[-0.05em]"
        >
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 }}
              className="block text-chalk"
            >
              {profile.first}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: EASE, delay: 0.2 }}
              className="block text-ember"
            >
              {profile.last}
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          style={{ x: subX }}
          className="gutter max-w-xl self-end text-right text-lg leading-relaxed text-chalk-muted"
        >
          {profile.line}
        </motion.p>

        <div className="gutter mt-6 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2.5 border border-ember/40 bg-carbon-700/40 px-4 py-2">
            <span className="h-1.5 w-1.5 animate-scanline bg-ember" />
            <span className="label text-ember">{profile.status}</span>
          </span>
        </div>
      </section>

      <VelocityTicker
        baseVelocity={3.4}
        items={[profile.first.toUpperCase(), profile.last.toUpperCase(), "FULL-STACK", "SYSTEMS", "DELHI NCR", "AVAILABLE"]}
      />

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-px border-y border-carbon-500 bg-carbon-500 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
            className="bg-carbon px-5 py-10 lg:px-8 lg:py-14"
          >
            <p className="font-display text-5xl font-black leading-none tracking-tight text-chalk lg:text-7xl">
              <Counter value={s.value} />
            </p>
            <p className="label mt-3">{s.label}</p>
          </motion.div>
        ))}
      </section>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <section className="gutter py-20 sm:py-28">
        <Head index="01" title="Experience" />
        <div className="border-b border-carbon-500">
          {experience.map((role, i) => (
            <motion.article
              key={role.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
              className="grid grid-cols-1 gap-6 border-t border-carbon-500 py-10 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-5">
                <h3 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-chalk lg:text-5xl">
                  {role.title}
                </h3>
                <p className="mt-3 text-sm text-chalk-muted">
                  {role.org}
                  {role.location ? ` · ${role.location}` : ""}
                </p>
                <p className="label mt-3 text-ember">{role.period}</p>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <p className="max-w-2xl text-base leading-relaxed text-chalk-muted">
                  {role.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {role.meta.map((m) => (
                    <span
                      key={m}
                      className="border border-carbon-500 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-telemetry text-chalk-dim"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────── */}
      <section className="gutter py-20 sm:py-28">
        <Head index="02" title="Selected Work" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Parallax distance={30}>
              <div className="relative overflow-hidden border border-carbon-500 bg-carbon-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={`${featured.name} — ${featured.subtitle}`}
                  className="w-full"
                />
                <span className="absolute left-4 top-4 bg-ember px-2 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-telemetry text-carbon-900">
                  01 / Featured
                </span>
              </div>
            </Parallax>
            <dl className="mt-px grid grid-cols-2 gap-px border border-carbon-500 bg-carbon-500">
              {featured.points.map((p) => (
                <div key={p.k} className="bg-carbon px-4 py-4">
                  <dt className="label text-[0.5625rem]">{p.k}</dt>
                  <dd className="mt-2 font-display text-sm font-bold uppercase tracking-wide text-chalk">
                    {p.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6">
            <p className="label text-ember">{featured.context}</p>
            <h3 className="mt-4 font-display text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-[0.85] tracking-tight text-chalk">
              {featured.name}
            </h3>
            <p className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-chalk-muted">
              <RevealText text={featured.subtitle} />
            </p>
            <p className="label mt-4">{featured.role}</p>
            <div className="mt-8 space-y-5 border-t border-carbon-500 pt-8">
              {featured.body.map((p) => (
                <p key={p.slice(0, 24)} className="max-w-2xl text-base leading-relaxed text-chalk-muted">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {featured.stack.map((t) => (
                <span
                  key={t}
                  className="border border-carbon-500 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-telemetry text-chalk-dim"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Work strip ───────────────────────────────────────────────── */}
      <WorkStrip />

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <section className="gutter py-20 sm:py-28">
        <Head index="04" title="Toolkit" />
        <div className="border-b border-carbon-500">
          {skills.map((row, i) => (
            <motion.div
              key={row.group}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
              className="grid grid-cols-1 gap-4 border-t border-carbon-500 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-8"
            >
              <span className="label sm:col-span-3">{row.group}</span>
              <div className="flex flex-wrap gap-x-6 gap-y-3 sm:col-span-9">
                {row.items.map((item) => (
                  <span
                    key={item}
                    className="font-display text-xl font-black uppercase tracking-wide text-chalk transition-colors duration-300 hover:text-ember lg:text-2xl"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Education ────────────────────────────────────────────────── */}
      <section className="gutter py-20 sm:py-28">
        <Head index="05" title="Education" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="grid grid-cols-1 gap-8 border-t border-carbon-500 py-10 lg:grid-cols-12 lg:gap-10"
        >
          <div className="lg:col-span-5">
            <h3 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-chalk lg:text-4xl">
              {education.degree}
            </h3>
            <p className="mt-3 text-sm text-chalk-muted">
              {education.school} · {education.location}
            </p>
            <p className="label mt-3 text-ember">{education.period}</p>
            <p className="mt-6 font-display text-xl font-black uppercase tracking-tight text-chalk">
              {education.result}
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <span className="label">Coursework</span>
            <div className="mt-4 flex flex-wrap gap-2">
              {education.coursework.map((c) => (
                <span
                  key={c}
                  className="border border-carbon-500 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-telemetry text-chalk-dim"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-10 border-t border-carbon-500 pt-6">
              <span className="label">{education.prior.title}</span>
              <p className="mt-3 text-sm text-chalk-muted">
                {education.prior.school} · {education.prior.period}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <section className="gutter flex flex-col items-center py-28 text-center">
        <span className="label">Let&apos;s build something</span>
        <Magnetic>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="link"
            className="mt-6 block font-display text-[clamp(3.5rem,16vw,14rem)] font-black uppercase leading-[0.8] tracking-tight text-chalk transition-colors duration-300 hover:text-ember"
          >
            Say Hello
          </a>
        </Magnetic>
        <div className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href={`mailto:${profile.email}`} className="label hover:text-ember">
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="label hover:text-ember">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="label hover:text-ember">
            LinkedIn
          </a>
          <span className="label">© {new Date().getFullYear()} {profile.name}</span>
        </div>
      </section>

      <VelocityTicker
        baseVelocity={3.4}
        items={["Open to SWE internships", "Summer 2027", "Delhi NCR", "Full-stack", "Available now"]}
      />
    </main>
  );
}

/* ── Section head ─────────────────────────────────────────────────── */

function Head({ index, title }: { index: string; title: string }) {
  return (
    <header className="mb-8 flex items-baseline gap-4 border-b border-carbon-500 pb-6">
      <span className="label text-ember">{index}</span>
      <h2 className="font-display text-4xl font-black uppercase tracking-tight text-chalk sm:text-6xl">
        <RevealText text={title} />
      </h2>
    </header>
  );
}

/* ── Horizontal work strip ───────────────────────────────────────── */

function WorkStrip() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);

  if (reduce) {
    return (
      <section className="gutter py-20">
        <Head index="03" title="Roster" />
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <RosterCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="gutter">
          <Head index="03" title="Roster" />
        </div>
        <motion.div style={{ x }} className="flex gap-6 pl-4 sm:pl-6 lg:pl-10">
          {projects.map((p) => (
            <div key={p.id} className="w-[82vw] shrink-0 sm:w-[440px]">
              <RosterCard p={p} />
            </div>
          ))}
          <div className="flex w-[60vw] shrink-0 items-center sm:w-[320px]">
            <p className="font-display text-2xl font-black uppercase leading-none tracking-tight text-carbon-400">
              End of
              <br />
              roster ↗
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RosterCard({ p }: { p: (typeof projects)[number] }) {
  return (
    <a
      href={p.live ?? "#"}
      target={p.live ? "_blank" : undefined}
      rel={p.live ? "noopener noreferrer" : undefined}
      data-cursor="view"
      className="group flex h-full flex-col border border-carbon-500 bg-carbon-900 p-6 transition-colors duration-300 hover:border-ember"
    >
      <div className="relative overflow-hidden border border-carbon-500">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt="" className="aspect-[16/10] w-full object-cover" />
        <span className="absolute left-3 top-3 bg-ember px-2 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-telemetry text-carbon-900">
          {p.index}
          {p.year ? ` / ${p.year}` : ""}
        </span>
      </div>
      <h3 className="mt-5 font-display text-3xl font-black uppercase leading-none tracking-tight text-chalk">
        {p.title}
      </h3>
      <p className="label mt-2 text-ember">{p.discipline}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-chalk-muted">{p.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {p.stack.map((t) => (
          <span
            key={t}
            className="border border-carbon-500 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-telemetry text-chalk-dim"
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

/* ── Magnetic wrapper ────────────────────────────────────────────── */

function Magnetic({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.12);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.18);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
