"use client"; // Pointer parallax across the glass deck, auto-advancing stages and live tamper demo.

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Counter, RevealText } from "@/components/ScrollFX";
import Shot from "@/components/variants/Shot";
import { useChain } from "@/components/variants/useChain";
import {
  Ambient,
  Glass,
  GlassNav,
  Led,
  Magnetic,
  ReadingsPanel,
  RiseName,
  Tile,
  easeOut,
  useSequencer,
  useSettledReducedMotion,
  type AmbientField,
} from "@/components/variants/signal/kit";
import { vc } from "@/lib/variantContent";

const fields: AmbientField[] = [
  { color: "rgba(255,122,26,.95)", className: "-left-[14%] -top-[18%] h-[95vh] w-[75vw]", x: [0, 150], y: [0, 100], duration: 18 },
  { color: "rgba(240,60,130,.9)", className: "right-[-14%] top-[4%] h-[90vh] w-[68vw]", x: [0, -140], y: [0, 130], duration: 24 },
  { color: "rgba(255,200,70,.6)", className: "bottom-[-24%] left-[16%] h-[80vh] w-[64vw]", x: [0, 140], y: [0, -110], duration: 28 },
];

function Pane({
  stage,
  index,
  open,
  bad,
  hot,
  onSelect,
  px,
  py,
}: {
  stage: (typeof vc.mohar.stages)[number];
  index: number;
  open: boolean;
  bad: boolean;
  hot: boolean;
  onSelect: () => void;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const depth = (index + 1) * 5;
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth * 0.5);

  return (
    <motion.div layout="position" style={{ x, y, zIndex: index + 1 }} className="relative -mt-3 first:mt-0">
      <Glass tone={bad ? "bad" : hot ? "lit" : undefined} className="px-5 pb-6 pt-4 lg:px-7">
        <button type="button" onClick={onSelect} aria-expanded={open} className="flex min-h-11 w-full items-center justify-between text-left">
          <span className="vd text-3xl font-black tracking-[-0.02em] lg:text-4xl">{stage.key}</span>
          <Led state={bad ? "bad" : hot ? "hot" : "on"} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="overflow-hidden text-lg leading-snug text-[var(--fg2)]"
            >
              <span className="block pt-1">{stage.text}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </Glass>
    </motion.div>
  );
}

function Deck({ chain }: { chain: ReturnType<typeof useChain> }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const reduce = useSettledReducedMotion();
  const [pinned, setPinned] = useState<number | null>(null);
  const { step } = useSequencer(5, chain.broken ? 2 : null, inView && !reduce && pinned === null);
  const px = useSpring(useMotionValue(0), { stiffness: 90, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 90, damping: 18 });
  const current = pinned ?? (step >= 0 ? step : 0);
  const stages = vc.mohar.stages.length;
  const beam = chain.broken ? Math.min(current, 2) : current;

  return (
    <div
      ref={root}
      className="relative pl-6"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - box.left) / box.width - 0.5);
        py.set((e.clientY - box.top) / box.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <div aria-hidden className="absolute bottom-4 left-1 top-4 z-0 w-[6px] rounded-full bg-white/20">
        <motion.div
          className="w-full origin-top rounded-full"
          style={{ height: "100%", background: chain.broken ? "var(--bad)" : "linear-gradient(var(--c1), var(--c2), var(--c3), var(--c4))" }}
          animate={{ scaleY: (beam + 1) / stages }}
          transition={reduce ? { duration: 0 } : { duration: 0.8, ease: easeOut }}
        />
      </div>
      {vc.mohar.stages.map((stage, i) => (
        <Pane
          key={stage.key}
          stage={stage}
          index={i}
          open={reduce || current === i}
          bad={chain.broken && i >= 2}
          hot={step === i}
          onSelect={() => setPinned((p) => (p === i ? null : i))}
          px={px}
          py={py}
        />
      ))}
    </div>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <h2 className="vd text-[clamp(2.75rem,5.5vw,4.75rem)] font-black leading-none tracking-[-0.03em]">
      <RevealText text={children} />
    </h2>
  );
}

export default function PrismDeckPage() {
  const chain = useChain();

  return (
    <>
      <Ambient fields={fields} />
      <main className="relative z-10 mx-auto max-w-[1360px] px-4 pb-6 pt-[46px] lg:px-8">
        <GlassNav />

        <section id="top" className="grid min-h-[calc(100dvh-104px)] items-center gap-10 py-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <RiseName className="vd text-[clamp(4.25rem,9vw,6rem)] font-black leading-[0.92] tracking-[-0.04em]" />
            <p className="mt-6 text-3xl font-bold leading-[1.15] tracking-[-0.02em]">{vc.ask}</p>
            <p className="mt-4 max-w-lg text-xl leading-snug text-[var(--fg)]">{vc.line}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic href="#work" primary>{vc.actions.work}</Magnetic>
              <Magnetic href={`mailto:${vc.email}`}>{vc.actions.email}</Magnetic>
            </div>
          </div>
          <div className="lg:col-span-6">
            <h2 className="vd text-5xl font-black tracking-[-0.03em]">{vc.mohar.name}</h2>
            <p className="mb-5 mt-2 text-xl leading-snug">{vc.mohar.pitch}</p>
            <Deck chain={chain} />
          </div>
        </section>

        <ReadingsPanel chain={chain} />

        <section className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {vc.readouts.map((r, i) => (
            <Glass key={r.label} delay={i * 0.07} className="p-6">
              <p className="vd text-5xl font-black tracking-[-0.03em] lg:text-6xl"><Counter value={r.value} /></p>
              <p className="mt-1 text-[var(--fg2)]">{r.label}</p>
            </Glass>
          ))}
        </section>

        <section id="work" className="grid scroll-mt-28 gap-4 pt-16 lg:grid-cols-12">
          <Glass className="p-6 lg:col-span-12 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Heading>{vc.mohar.subtitle}</Heading>
                <p className="mt-4 text-lg font-semibold">{vc.mohar.context}. {vc.mohar.role}.</p>
                <div className="mt-4 space-y-3 leading-relaxed text-[var(--fg2)]">
                  {vc.mohar.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
                </div>
                <p className="mt-4 font-mono text-sm">{vc.mohar.stack.join(", ")}</p>
              </div>
              <div className="overflow-hidden rounded-2xl lg:col-span-5 lg:self-center">
                <Shot src={vc.mohar.image} alt={`${vc.mohar.name}: ${vc.mohar.subtitle}`} />
              </div>
            </div>
          </Glass>
          <Tile project={vc.projects[1]} className="lg:col-span-5" />
          <Tile project={vc.projects[0]} className="lg:col-span-7" delay={0.06} />
          <Tile project={vc.projects[2]} className="lg:col-span-6" />
          <div className="grid gap-4 lg:col-span-6">
            <Tile project={vc.projects[3]} delay={0.06} />
            <Tile project={vc.projects[4]} delay={0.12} />
          </div>
        </section>

        <section className="grid gap-4 pt-16 lg:grid-cols-12">
          <Glass id="experience" className="p-6 lg:col-span-12 lg:p-10">
            <Heading>{vc.sections.experience}</Heading>
            <div className="mt-7 grid gap-10 lg:grid-cols-2">
              {vc.roles.map((role) => (
                <article key={role.id}>
                  <h3 className="vd text-3xl font-black tracking-[-0.02em]">{role.title}</h3>
                  <p className="mt-1 font-semibold">{role.org}</p>
                  <p className="text-[var(--fg2)]">{role.period}</p>
                  <p className="mt-3 max-w-[65ch] leading-relaxed text-[var(--fg2)]">{role.body}</p>
                </article>
              ))}
            </div>
          </Glass>
          <Glass id="toolkit" className="p-6 lg:col-span-7 lg:p-10">
            <Heading>{vc.sections.toolkit}</Heading>
            <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {vc.toolkit.map((g) => (
                <div key={g.group}>
                  <dt className="font-semibold">{g.group}</dt>
                  <dd className="text-[var(--fg2)]">{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Glass>
          <Glass id="education" className="p-6 lg:col-span-5 lg:p-10">
            <Heading>{vc.sections.education}</Heading>
            <h3 className="mt-5 text-xl font-semibold">{vc.education.degree}</h3>
            <p className="mt-1 text-[var(--fg2)]">{vc.education.school}. {vc.education.period}.</p>
            <p className="mt-3 text-xl font-semibold">{vc.education.result}</p>
            <p className="mt-2 text-[var(--fg2)]">{vc.education.coursework.join(", ")}</p>
            <p className="mt-2 text-sm text-[var(--fg2)]">{vc.education.prior}</p>
          </Glass>
        </section>

        <Glass id="contact" className="mt-4 p-6 lg:p-12">
          <Heading>{vc.ask}</Heading>
          <a href={`mailto:${vc.email}`} className="vd mt-7 block break-all text-[clamp(2.25rem,6.6vw,5.75rem)] font-black leading-none tracking-[-0.03em] text-[var(--c1)] underline decoration-[3px] underline-offset-8">
            {vc.email}
          </a>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic href={vc.github} primary>{vc.actions.github}</Magnetic>
            <Magnetic href={vc.linkedin}>{vc.actions.linkedin}</Magnetic>
          </div>
        </Glass>
      </main>
    </>
  );
}
