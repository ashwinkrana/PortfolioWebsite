"use client"; // Photo tilt, cycling role, scroll-pinned work pan and drawn timeline.

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Counter, Parallax, RevealText, VelocityTicker } from "@/components/ScrollFX";
import Shot from "@/components/variants/Shot";
import ShaderBackground from "@/components/webgl/ShaderBackground";
import {
  Glass,
  GlassNav,
  Led,
  Magnetic,
  RiseName,
  easeOut,
  useSettledReducedMotion,
} from "@/components/variants/signal/kit";
import { daylight, vc } from "@/lib/variantContent";

const tint = (color: string, strong = 90, soft = 66) =>
  ({
    "--glass-bg": `linear-gradient(145deg, color-mix(in srgb, ${color} ${strong}%, transparent), color-mix(in srgb, ${color} ${soft}%, transparent))`,
    "--glass-line": "rgba(255,255,255,.55)",
    "--fg2": "#0f1720",
  }) as CSSProperties;

// RevealText masks each word; tight display leading needs extra room or the mask clips g and y.
const descenderRoom = "[&_span.overflow-hidden]:-mb-[0.16em] [&_span.overflow-hidden]:pb-[0.22em]";

function RoleCycle() {
  const reduce = useSettledReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % daylight.roles.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <span className="block h-[1.3em] overflow-hidden">
      <motion.span
        className="block"
        animate={{ y: `${-index * 1.3}em` }}
        transition={reduce ? { duration: 0 } : { duration: 0.55, ease: easeOut }}
      >
        {daylight.roles.map((role) => (
          <span key={role} className="block h-[1.3em] leading-[1.3em]">
            {role}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function HeroPhoto() {
  const reduce = useSettledReducedMotion();
  const rotateX = useSpring(0, { stiffness: 140, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 140, damping: 18 });

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        rotateY.set(((e.clientX - box.left) / box.width - 0.5) * 9);
        rotateX.set(((e.clientY - box.top) / box.height - 0.5) * -9);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <Glass className="p-4" delay={0.35}>
        <div className="relative aspect-[6/5] overflow-hidden rounded-[18px]">
          <Image
            src="/hero-dusk.png"
            alt={daylight.photoAlt}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover object-[50%_60%]"
          />
          <div className="glass absolute bottom-3 left-3 w-60 max-w-[calc(100%-1.5rem)] !rounded-2xl px-4 py-2.5 text-[var(--fg)]" style={{ "--glass-blur": "22px", "--glass-bg": "linear-gradient(145deg, rgba(255,255,255,.84), rgba(255,255,255,.66))" } as CSSProperties}>
            <p className="font-bold leading-tight">{vc.name}</p>
            <div className="text-[0.9375rem] font-medium leading-tight"><RoleCycle /></div>
          </div>
        </div>
      </Glass>
    </motion.div>
  );
}

function Lift({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className={className}>
      {children}
    </motion.div>
  );
}

function Heading({ children, size = "text-[clamp(3.25rem,7.4vw,7rem)]" }: { children: string; size?: string }) {
  return (
    <h2 className={`vd ${size} font-extrabold leading-[0.95] tracking-[-0.04em] ${descenderRoom}`}>
      <RevealText text={children} />
    </h2>
  );
}

function About() {
  const spans = ["lg:col-span-5", "lg:col-span-7", "lg:col-span-7", "lg:col-span-5"];
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
      <Heading>{daylight.aboutTitle}</Heading>
      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        {daylight.sides.map((side, i) => (
          <Lift key={side.title} className={spans[i]}>
            <Glass delay={i * 0.07} className="h-full p-7 lg:p-10" style={tint(side.color)}>
              <h3 className="vd text-4xl font-extrabold leading-none tracking-[-0.03em] lg:text-6xl">{side.title}</h3>
              {side.big && (
                <p className="mt-6 flex items-baseline gap-3">
                  <span className="vd text-7xl font-extrabold leading-none tracking-[-0.04em] lg:text-9xl">
                    <Counter value={side.big} />
                  </span>
                  <span className="text-lg font-bold leading-tight lg:text-xl">{side.bigLabel}</span>
                </p>
              )}
              <p className="mt-4 max-w-[46ch] text-lg font-medium leading-snug lg:text-xl">{side.body}</p>
            </Glass>
          </Lift>
        ))}
      </div>
    </section>
  );
}

function wave(width: number, height: number, segments: number) {
  const mid = height / 2;
  const span = width / segments;
  let d = `M0 ${mid}`;
  for (let i = 0; i < segments; i++) {
    // Same control-point order on every segment keeps the tangent continuous at each join, so no kinks.
    const x = i * span;
    d += ` C${x + span * 0.35} ${mid + height * 0.36} ${x + span * 0.65} ${mid - height * 0.36} ${x + span} ${mid}`;
  }
  return d;
}

function WorkPan() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0, distance: 0 });
  const [active, setActive] = useState(0);
  const reduce = useSettledReducedMotion();
  const count = daylight.work.length;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () =>
      setSize({ width: el.scrollWidth, height: el.clientHeight, distance: Math.max(0, el.scrollWidth - window.innerWidth) });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => (reduce ? 0 : -v * size.distance));
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(count - 1, Math.floor(v * count))));

  return (
    <section ref={section} id="work" className="relative h-[560vh] stack:h-auto">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden pt-20 stack:static stack:h-auto stack:overflow-visible stack:pb-12">
        <div className="px-5 sm:px-[6vw]">
          <Heading size="text-[clamp(min(3.25rem,6.9dvh),min(7.4vw,11dvh),7rem)]">{daylight.workTitle}</Heading>
        </div>
        <motion.div
          ref={track}
          style={{ x }}
          className="relative mt-[clamp(0.25rem,2dvh,1.5rem)] flex w-max items-stretch gap-[5vw] px-5 py-[clamp(0.75rem,3.5dvh,2rem)] sm:px-[6vw] stack:grid stack:w-full stack:gap-4 stack:sm:grid-cols-2"
        >
          {size.width > 0 && (
            <svg aria-hidden width={size.width} height={size.height} className="pointer-events-none absolute left-0 top-0 z-0 stack:hidden">
              <defs>
                <linearGradient id="daylight-cable" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={size.width} y2="0">
                  <stop offset="0%" stopColor="var(--c4)" />
                  <stop offset="35%" stopColor="var(--c3)" />
                  <stop offset="70%" stopColor="var(--c2)" />
                  <stop offset="100%" stopColor="var(--c1)" />
                </linearGradient>
              </defs>
              <path d={wave(size.width, size.height, 12)} fill="none" stroke="var(--dead)" strokeOpacity={0.45} strokeWidth={2} />
              <motion.path d={wave(size.width, size.height, 12)} fill="none" stroke="url(#daylight-cable)" strokeWidth={9} strokeLinecap="round" style={{ pathLength: drawn }} />
            </svg>
          )}
          {daylight.work.map((project, i) => (
            <motion.article
              key={project.id}
              className="relative z-10 w-[82vw] max-w-[620px] sm:w-[56vw] lg:w-[40vw] stack:w-full stack:max-w-none"
              animate={{ scale: !reduce && active === i ? 1.04 : 0.97 }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
            >
              <Glass className="h-full p-4 lg:p-5" tone={active === i ? "lit" : undefined}>
                <div className="h-[clamp(4.5rem,calc(100dvh_-_35rem),26vh)] overflow-hidden rounded-[18px] lg:h-[clamp(5rem,calc(100dvh_-_30rem),32vh)] stack:h-56">
                  <Shot src={project.image} alt={`${project.title} screenshot`} className="!h-full object-cover object-center" />
                </div>
                <div className="px-2 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="vd text-[clamp(2rem,3.4vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em]">{project.title}</h3>
                    <Led state={i <= active ? "on" : "off"} />
                  </div>
                  <p className="mt-1 font-bold">{project.kind}</p>
                  <p className="mt-2 leading-snug text-[var(--fg2)]">{project.line}</p>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center font-bold underline underline-offset-4">
                      {vc.actions.live}
                    </a>
                  )}
                </div>
              </Glass>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Story() {
  const root = useRef<HTMLOListElement>(null);
  const reduce = useSettledReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.3 });

  return (
    <section id="experience" className="mx-auto max-w-[1240px] scroll-mt-28 px-5 py-24 lg:px-10">
      <Heading>{daylight.storyTitle}</Heading>
      <div className="relative mt-14">
        <div aria-hidden className="absolute bottom-0 left-2 top-0 w-1.5 rounded-full bg-[var(--dead)]/40 lg:left-1/2 lg:-ml-[3px]">
          <motion.div
            className="h-full w-full origin-top rounded-full"
            style={{ scaleY: reduce ? 1 : scaleY, background: "linear-gradient(var(--c4), var(--c3), var(--c2), var(--c1))" }}
          />
        </div>
        <ol ref={root} className="space-y-6 pl-9 lg:pl-0">
          {daylight.story.map((item, i) => {
            const last = i === daylight.story.length - 1;
            return (
              <li key={item.title} className="relative lg:grid lg:grid-cols-2 lg:gap-16">
                <span aria-hidden className="absolute -left-[33px] top-9 z-10 h-5 w-5 rounded-full border-4 border-white bg-[var(--fg)] lg:left-1/2 lg:-ml-2.5" />
                <Lift className={i % 2 ? "lg:col-start-2" : ""}>
                  <Glass className="p-6 lg:p-8" style={last ? tint("var(--c1)") : undefined}>
                    <p className="vd text-lg font-extrabold">{item.when}</p>
                    <h3 className="vd mt-1 text-3xl font-extrabold leading-tight tracking-[-0.02em] lg:text-4xl">{item.title}</h3>
                    {"org" in item && item.org && <p className="mt-1 font-semibold">{item.org}</p>}
                    <p className="mt-2 leading-relaxed text-[var(--fg2)]">{item.body}</p>
                  </Glass>
                </Lift>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <ShaderBackground />

      <a
        href="#work"
        className="sr-only z-50 rounded-full bg-[var(--fg)] px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        {daylight.skipLink}
      </a>

      <main className="relative z-10 pt-3">
        <GlassNav top="top-3" />

        <section id="top" className="mx-auto max-w-[1760px] px-5 pb-14 pt-6 lg:px-8">
          <RiseName className="vd whitespace-nowrap text-[clamp(4.5rem,23vw,9rem)] font-extrabold leading-[0.9] tracking-[-0.04em] lg:flex lg:gap-[0.2em] lg:text-[min((100vw_-_6rem)/6.62,16rem)]" />

          <div className="mt-6 grid items-start gap-10 lg:-mt-[1.1vw] lg:grid-cols-12">
            <div className="pt-4 lg:col-span-6 lg:pt-[3.5vw]">
              <p className="vd text-[clamp(2.25rem,4vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">{daylight.statement}</p>
              <p className="mt-5 text-xl font-medium leading-snug text-[var(--fg2)]">{vc.ask}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Magnetic href="#work" primary>{vc.actions.work}</Magnetic>
                <Magnetic href={`mailto:${vc.email}`}>{vc.actions.email}</Magnetic>
                <Magnetic href={vc.github}>{vc.actions.github}</Magnetic>
              </div>
            </div>
            <Parallax distance={30} className="relative z-10 lg:col-span-5 lg:col-start-8">
              <HeroPhoto />
            </Parallax>
          </div>
        </section>

        <VelocityTicker
          items={daylight.ticker}
          baseVelocity={3}
          className="bg-[var(--fg)] py-4"
          itemClassName="!text-3xl !font-extrabold !tracking-tight text-white"
          bulletClassName="text-[var(--c4)]"
        />

        <About />
        <WorkPan />
        <Story />

        <section className="mx-auto grid max-w-[1400px] gap-4 px-5 py-10 lg:grid-cols-12 lg:px-10">
          <Glass id="toolkit" className="p-7 lg:col-span-8 lg:p-10">
            <h2 className="vd text-5xl font-extrabold leading-none tracking-[-0.04em] lg:text-6xl">{daylight.toolkitTitle}</h2>
            <div className="mt-7 space-y-5">
              {vc.toolkit.map((group) => (
                <div key={group.group}>
                  <h3 className="font-bold">{group.group}</h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <motion.li
                        key={item}
                        whileHover={{ y: -3, scale: 1.05 }}
                        className="rounded-full bg-[var(--fg)] px-4 py-2 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[var(--c4)] hover:text-[var(--fg)]"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Glass>
          <Glass id="education" className="p-7 lg:col-span-4 lg:p-10" style={tint("var(--c2)")}>
            <h2 className="vd text-5xl font-extrabold leading-none tracking-[-0.04em]">{vc.sections.education}</h2>
            <h3 className="mt-6 text-2xl font-extrabold leading-tight">{vc.education.degree}</h3>
            <p className="mt-2 font-medium">{vc.education.school}</p>
            <p className="font-medium">{vc.education.period}</p>
            <p className="mt-4 text-2xl font-extrabold">{vc.education.result}</p>
            <p className="mt-4 font-medium">{vc.education.coursework.join(", ")}</p>
            <p className="mt-3 text-sm font-medium">{vc.education.prior}</p>
          </Glass>
        </section>

        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <Glass id="contact" className="p-8 lg:p-14" style={tint("var(--c4)", 94, 76)}>
            <h2 className={`vd text-[clamp(2.75rem,12vw,12rem)] font-extrabold leading-[0.92] tracking-[-0.04em] ${descenderRoom}`}>
              <RevealText text={daylight.contact} />
            </h2>
            <a href={`mailto:${vc.email}`} className="vd mt-8 block text-[calc((100vw_-_6.5rem)/12.4)] font-extrabold [overflow-wrap:anywhere] lg:text-[clamp(1.75rem,4.6vw,4.25rem)] leading-none tracking-[-0.03em] underline decoration-[3px] underline-offset-8">
              {vc.email}
            </a>
            <div className="mt-9 flex flex-wrap gap-3">
              <Magnetic href={vc.github} primary>{vc.actions.github}</Magnetic>
              <Magnetic href={vc.linkedin} primary>{vc.actions.linkedin}</Magnetic>
            </div>
          </Glass>
        </div>
        <footer className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-8 font-medium text-[var(--fg2)] lg:px-10">
          <p>&copy; {new Date().getFullYear()} {vc.name}</p>
          <p>{vc.location}</p>
        </footer>
      </main>
    </>
  );
}
