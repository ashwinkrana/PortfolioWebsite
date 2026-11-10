"use client";

import { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Loader from "@/components/Loader";
import TechHoverReveal from "@/components/TechHoverReveal";
import { featured, projects } from "@/lib/projects";
import {
  Counter,
  Parallax,
  RevealText,
  VelocityTicker,
} from "@/components/ScrollFX";
import { education, experience, hero, profile, skills, stats } from "@/lib/content";

/* ── Motion primitives ──────────────────────────────────────────────── */

const EASE_DRS = [0.16, 1, 0.3, 1] as const;

/** Type "launches" from below its own mask — the cinematic entrance. */
const lineWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const line: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.05, ease: EASE_DRS } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_DRS } },
};

/* ── Page ───────────────────────────────────────────────────────────── */

export default function Home() {
  // The hero holds its "hidden" pose until the curtain starts lifting, so the
  // type launch plays as the reveal — not behind it.
  const [ready, setReady] = useState(false);
  const handleLoaded = useCallback(() => setReady(true), []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Hero drifts up and dims as the roster takes over. These are scroll-linked
  // values, which MotionConfig can't stop, so reduced motion flattens the
  // ranges to "no change" instead.
  const reduceMotion = useReducedMotion();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -120]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, reduceMotion ? 1 : 0]);

  return (
    <main className="relative min-h-screen bg-carbon">
      <AnimatePresence>
        {!ready && <Loader key="loader" onDone={handleLoaded} />}
      </AnimatePresence>

      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroFade }}
        className="gutter relative flex min-h-[100svh] flex-col justify-between pb-8 pt-28 sm:pt-32"
      >
        {/* Vertical guide lines — the grid, made visible. Masked out before
            the running text starts so no line ever cuts through a sentence. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden justify-between px-4 [mask-image:linear-gradient(to_bottom,black_40%,transparent_58%)] sm:px-6 lg:flex lg:px-10"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-full w-px bg-carbon-600" />
          ))}
        </div>

        <motion.div
          variants={fade}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          className="relative flex items-center gap-4"
        >
          <span className="label">{profile.location}</span>
        </motion.div>

        {/* DOM order is the phone and screen-reader order: name, ask, tagline,
            proof. At lg the explicit row and column starts lift the proof up
            beside the name without changing that order. */}
        <div className="relative my-10 grid flex-1 grid-cols-1 content-start gap-10 lg:grid-cols-12 lg:content-between lg:gap-x-10 lg:gap-y-16">
          {/* The name, at size */}
          <motion.h1
            variants={lineWrap}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            className="font-display text-mega font-black uppercase lg:col-span-8 lg:row-start-1"
          >
            {[profile.first, profile.last].map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <motion.span
                  variants={line}
                  className={`block ${i === 1 ? "text-ember" : "text-chalk"}`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* The ask: the second thing anyone should read */}
          <motion.p
            variants={fade}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            transition={{ delay: 0.7 }}
            className="font-display text-[clamp(1.75rem,3.2vw,3rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-chalk lg:col-span-7 lg:row-start-2 lg:self-end"
          >
            {profile.status}
          </motion.p>

          <motion.div
            variants={fade}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            transition={{ delay: 0.85 }}
            className="lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:self-end"
          >
            <p className="max-w-md text-lg leading-relaxed text-chalk-muted">
              {profile.line}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex min-h-11 items-center bg-ember px-5 font-mono text-telemetry font-bold uppercase tracking-telemetry text-carbon-900 transition-transform duration-300 ease-drs hover:-translate-y-0.5"
              >
                {hero.primaryAction}
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center border border-carbon-500 px-5 font-mono text-telemetry uppercase tracking-telemetry text-chalk transition-colors hover:border-ember hover:text-ember"
              >
                {hero.secondaryAction}
              </a>
            </div>
          </motion.div>

          {/* Proof: the one project nobody else could have built */}
          <motion.a
            href="#mohar"
            variants={fade}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            transition={{ delay: 0.95 }}
            className="group block border border-ember/40 bg-carbon p-6 transition-colors hover:border-ember lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-end"
          >
            <span className="label text-ember">{hero.proof.context}</span>
            <span className="mt-4 flex items-baseline justify-between gap-4 font-display text-4xl font-black uppercase tracking-tight text-chalk">
              {hero.proof.name}
              <span aria-hidden className="text-2xl text-ember transition-transform duration-300 ease-drs group-hover:translate-y-1">
                ↓
              </span>
            </span>
            <span className="mt-3 block text-base leading-relaxed text-chalk-muted">
              {hero.proof.line}
            </span>
          </motion.a>
        </div>
      </motion.section>

      {/* ── NUMBERS ──────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-px border-y border-carbon-500 bg-carbon-500 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE_DRS, delay: i * 0.06 }}
            className="bg-carbon px-5 py-8 lg:px-8 lg:py-10"
          >
            <p className="font-display text-4xl font-black leading-none tracking-tight text-chalk lg:text-6xl">
              <Counter value={stat.value} />
            </p>
            <p className="label mt-3">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* ── FEATURED PROJECT ─────────────────────────────────────────── */}
      <section id="work" className="py-16 sm:py-24">
        <SectionHead title="Selected Work" />

        {/* The anchor is a separate element because the article below is still
            offset by its entrance animation when Lenis measures the target. */}
        <span id="mohar" aria-hidden className="block scroll-mt-20" />
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE_DRS }}
          className="gutter grid grid-cols-1 gap-10 pb-16 lg:grid-cols-12 lg:gap-12"
        >
          <div className="lg:col-span-6">
            <Parallax distance={26}>
            <div className="relative overflow-hidden border border-carbon-500 bg-carbon-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={`${featured.name} — ${featured.subtitle}`}
                className="w-full"
              />
              <span className="absolute right-4 top-4 bg-ember px-2 py-1 font-mono text-[0.6875rem] font-bold uppercase tracking-telemetry text-carbon-900">
                01 / Featured
              </span>
            </div>
            </Parallax>

            <dl className="mt-px grid grid-cols-2 gap-px border border-carbon-500 bg-carbon-500 sm:grid-cols-4 lg:grid-cols-2">
              {featured.points.map((p) => (
                <div key={p.k} className="bg-carbon px-4 py-4">
                  <dt className="label">{p.k}</dt>
                  <dd className="mt-2 font-display text-sm font-bold uppercase tracking-wide text-chalk">
                    {p.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6">
            <p className="label text-ember">{featured.context}</p>
            <h3 className="mt-4 font-display text-mega font-black uppercase leading-none tracking-tight text-chalk [font-size:clamp(3rem,8vw,6rem)]">
              {featured.name}
            </h3>
            <p className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-chalk-muted">
              <RevealText text={featured.subtitle} />
            </p>
            <p className="label mt-4">{featured.role}</p>

            <div className="mt-8 space-y-5 border-t border-carbon-500 pt-8">
              {featured.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="max-w-2xl text-base leading-relaxed text-chalk-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {featured.stack.map((tech) => (
                <span
                  key={tech}
                  className="border border-carbon-500 px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-telemetry text-chalk-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.article>

        {/* ── ROSTER ─────────────────────────────────────────────────── */}
        <div className="border-b border-carbon-500">
          {projects.map((project) => (
            <TechHoverReveal key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ───────────────────────────────────────────────── */}
      <section id="experience" className="py-16 sm:py-24">
        <SectionHead title="Experience" note={`${experience.length} Roles`} />

        <div className="border-b border-carbon-500">
          {experience.map((role, i) => (
            <motion.article
              key={role.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE_DRS, delay: i * 0.08 }}
              className="gutter grid grid-cols-1 gap-6 border-t border-carbon-500 py-10 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-4">
                <h3 className="font-display text-2xl font-extrabold uppercase leading-tight text-chalk lg:text-3xl">
                  {role.title}
                </h3>
                <p className="mt-3 text-sm text-chalk-muted">
                  {role.org}
                  {role.location ? ` · ${role.location}` : ""}
                </p>
                <p className="label mt-3 text-ember">{role.period}</p>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <p className="max-w-2xl text-base leading-relaxed text-chalk-muted">
                  {role.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {role.meta.map((m) => (
                    <span
                      key={m}
                      className="border border-carbon-500 px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-telemetry text-chalk-muted"
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

      {/* ── SKILLS ───────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <SectionHead title="Toolkit" />

        <div className="border-b border-carbon-500">
          {skills.map((row, i) => (
            <motion.div
              key={row.group}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE_DRS, delay: i * 0.05 }}
              className="gutter grid grid-cols-1 gap-4 border-t border-carbon-500 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-8"
            >
              <span className="label sm:col-span-3">{row.group}</span>
              <div className="flex flex-wrap gap-x-6 gap-y-3 sm:col-span-9">
                {row.items.map((item) => (
                  <span
                    key={item}
                    className="font-display text-lg font-bold uppercase tracking-wide text-chalk transition-colors duration-300 hover:text-ember lg:text-xl"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── EDUCATION ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <SectionHead title="Education" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_DRS }}
          className="gutter grid grid-cols-1 gap-8 border-t border-carbon-500 py-10 lg:grid-cols-12 lg:gap-10"
        >
          <div className="lg:col-span-5">
            <h3 className="font-display text-2xl font-extrabold uppercase leading-tight text-chalk lg:text-3xl">
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
                  className="border border-carbon-500 px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-telemetry text-chalk-muted"
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

      <VelocityTicker
        items={[
          "Open to SWE internships",
          "Summer 2027",
          "Delhi NCR",
          "Full-stack",
        ]}
      />
      <Footer />
    </main>
  );
}

/* ── Section header ─────────────────────────────────────────────────── */

function SectionHead({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <header className="gutter mb-4 flex items-end justify-between gap-6 pb-6">
      <h2 className="font-display text-3xl font-black uppercase tracking-tight text-chalk sm:text-6xl">
        <RevealText text={title} />
      </h2>
      {note &&<span className="label hidden whitespace-nowrap sm:block">{note}</span>}
    </header>
  );
}

/* ── Nav ────────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <nav className="gutter fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-carbon-600/70 bg-carbon/70 py-2 backdrop-blur-md">
      <a
        href="#"
        className="inline-flex min-h-11 items-center font-display text-lg font-black uppercase tracking-tight text-chalk"
      >
        AK<span className="text-ember">.</span>
      </a>
      <div className="flex items-center gap-6">
        <a href="#work" className="label inline-flex min-h-11 items-center transition-colors hover:text-ember">
          Work
        </a>
        <a
          href="#experience"
          className="label hidden min-h-11 items-center transition-colors hover:text-ember sm:inline-flex"
        >
          Experience
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex min-h-11 items-center bg-ember px-4 font-mono text-telemetry font-bold uppercase tracking-telemetry text-carbon-900 transition-transform duration-300 ease-drs hover:-translate-y-0.5"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-carbon-900 pt-20">
      <div className="gutter">
        <span className="label">Let&apos;s build something</span>

        <motion.a
          href={`mailto:${profile.email}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE_DRS }}
          className="group mt-6 block font-display text-giga font-black uppercase leading-none text-chalk transition-colors duration-500 hover:text-ember"
        >
          Say
          <br />
          <span className="outline-type transition-all duration-500 group-hover:text-ember group-hover:[-webkit-text-stroke:0]">
            Hello
          </span>
        </motion.a>

        <div className="mt-16 flex flex-col gap-8 border-t border-carbon-500 py-8 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={`mailto:${profile.email}`}
            className="font-mono text-sm text-chalk-muted transition-colors hover:text-ember"
          >
            {profile.email}
          </a>

          <div className="flex items-center gap-4">
            <Social href={profile.github} label="GitHub">
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.95.68 1.92l-.01 2.85c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
            </Social>
            <Social href={profile.linkedin} label="LinkedIn">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21h-4V9Z" />
            </Social>
          </div>
        </div>
      </div>

      {/* Edge-to-edge wordmark, cropped by the viewport */}
      <div aria-hidden className="select-none overflow-hidden">
        <p className="whitespace-nowrap px-2 font-display text-[22vw] font-black uppercase leading-[0.75] tracking-tighter text-carbon-700">
          {profile.name}
        </p>
      </div>

      <div className="gutter flex flex-col gap-2 border-t border-carbon-500 py-5 sm:flex-row sm:justify-between">
        <span className="label">© {new Date().getFullYear()} {profile.name}</span>
        <span className="label">Built with Next.js — Deployed on Vercel</span>
      </div>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center border border-carbon-500 text-chalk-muted transition-all duration-300 ease-drs hover:-translate-y-0.5 hover:border-ember hover:bg-ember hover:text-carbon-900"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        {children}
      </svg>
    </a>
  );
}
