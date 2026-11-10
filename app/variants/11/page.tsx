"use client"; // Composes the animated glass rack and live tamper demo.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Counter, RevealText } from "@/components/ScrollFX";
import Shot from "@/components/variants/Shot";
import { useChain } from "@/components/variants/useChain";
import {
  Ambient,
  CableLayer,
  Glass,
  GlassNav,
  Led,
  Magnetic,
  ReadingsPanel,
  RiseName,
  Tile,
  useCables,
  useSequencer,
  type AmbientField,
} from "@/components/variants/signal/kit";
import { vc } from "@/lib/variantContent";

const fields: AmbientField[] = [
  { color: "rgba(28,199,199,.42)", className: "-left-[12%] -top-[20%] h-[80vh] w-[70vw]", x: [0, 140], y: [0, 90], duration: 19 },
  { color: "rgba(242,183,5,.26)", className: "right-[-12%] top-[8%] h-[72vh] w-[58vw]", x: [0, -150], y: [0, 120], duration: 23 },
  { color: "rgba(240,86,138,.26)", className: "bottom-[-24%] left-[24%] h-[78vh] w-[66vw]", x: [0, 120], y: [0, -110], duration: 27 },
];

function Rig({ chain }: { chain: ReturnType<typeof useChain> }) {
  const root = useRef<HTMLDivElement>(null);
  const paths = useCables(root, 4);
  const reduce = useReducedMotion();
  const inView = useInView(root);
  const { step, cycle } = useSequencer(5, chain.broken ? 2 : null, inView && !reduce);
  const alive = (i: number) => !chain.broken || i < 2;

  return (
    <div ref={root} className="relative grid grid-cols-1 gap-8 lg:mb-24 lg:grid-cols-5 lg:gap-3">
      <CableLayer paths={paths} alive={alive} step={step} cycle={cycle} />
      {vc.mohar.stages.map((stage, i) => {
        const bad = chain.broken && i >= 2;
        return (
          <Glass key={stage.key} delay={0.1 + i * 0.07} className="z-10 p-4" tone={bad ? "bad" : step === i ? "lit" : undefined}>
            <div className="pb-9 pl-12 lg:pb-12 lg:pl-0">
              <div className="flex items-center justify-between">
                <h3 className="vd text-3xl font-bold uppercase">{stage.key}</h3>
                <Led state={bad ? "bad" : step === i ? "hot" : "on"} />
              </div>
              <p className="mt-2 text-[0.9375rem] leading-snug text-[var(--fg2)]">{stage.text}</p>
            </div>
            {i > 0 && <span aria-hidden data-jack={`in-${i}`} className="jack absolute left-0 top-0 lg:bottom-0 lg:left-auto lg:right-0 lg:top-auto" />}
            {i < 4 && <span aria-hidden data-jack={`out-${i}`} className="jack absolute bottom-0 left-0" />}
          </Glass>
        );
      })}
    </div>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <h2 className="vd text-5xl font-bold uppercase leading-none lg:text-6xl">
      <RevealText text={children} />
    </h2>
  );
}

export default function AuroraRackPage() {
  const chain = useChain();
  const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

  return (
    <>
      <Ambient fields={fields}>
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_30%,rgba(255,70,60,.3),transparent)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: chain.broken ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
      </Ambient>

      <main className="relative z-10 px-3 pb-3 pt-[46px]">
        <GlassNav />

        <section id="top" className="mt-3 grid gap-3 lg:grid-cols-12">
          <Glass className="flex p-6 lg:col-span-4 lg:p-8 [&>div:last-child]:flex [&>div:last-child]:w-full [&>div:last-child]:flex-col [&>div:last-child]:justify-between [&>div:last-child]:gap-8">
            <div>
              <RiseName className="vd text-[clamp(4rem,8vw,6rem)] font-bold uppercase leading-[0.88]" />
              <p className="mt-6 text-2xl font-medium leading-tight">{vc.ask}</p>
              <p className="mt-4 max-w-md text-lg leading-snug text-[var(--fg2)]">{vc.line}</p>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              {vc.readouts.map((r) => (
                <div key={r.label}>
                  <dd className="vd text-5xl font-bold leading-none"><Counter value={r.value} /></dd>
                  <dt className="mt-1 text-sm text-[var(--fg2)]">{r.label}</dt>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3">
              <Magnetic href="#work" primary>{vc.actions.work}</Magnetic>
              <Magnetic href={`mailto:${vc.email}`}>{vc.actions.email}</Magnetic>
            </div>
          </Glass>

          <div className="lg:col-span-8">
            <div className="mb-3 px-1 pt-2 lg:mb-4">
              <h2 className="vd text-5xl font-bold uppercase leading-none">{vc.mohar.name}</h2>
              <p className="mt-1 text-lg">{vc.mohar.pitch}</p>
            </div>
            <Rig chain={chain} />
            <ReadingsPanel chain={chain} className="mt-3 lg:mt-0" />
          </div>
        </section>

        <section id="work" className="mt-3 grid scroll-mt-28 gap-3 lg:grid-cols-12">
          <Glass className="p-6 lg:col-span-12 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="overflow-hidden rounded-xl lg:col-span-6">
                <Shot src={vc.mohar.image} alt={`${vc.mohar.name}: ${vc.mohar.subtitle}`} />
              </div>
              <div className="lg:col-span-6">
                <Heading>{vc.mohar.subtitle}</Heading>
                <p className="mt-3 font-semibold">{vc.mohar.context}. {vc.mohar.role}.</p>
                <div className="mt-4 space-y-3 leading-relaxed text-[var(--fg2)]">
                  {vc.mohar.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
                </div>
                <p className="mt-4 font-mono text-sm">{vc.mohar.stack.join(", ")}</p>
              </div>
            </div>
          </Glass>
          {vc.projects.map((project, i) => (
            <Tile key={project.id} project={project} className={spans[i]} delay={i * 0.06} />
          ))}
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-12">
          <Glass id="experience" className="p-6 lg:col-span-7 lg:p-8">
            <Heading>{vc.sections.experience}</Heading>
            <div className="mt-6 space-y-8">
              {vc.roles.map((role) => (
                <article key={role.id}>
                  <h3 className="vd text-3xl font-bold uppercase leading-none">{role.title}</h3>
                  <p className="mt-1 font-semibold">{role.org}. {role.period}.</p>
                  <p className="mt-2 max-w-[65ch] leading-relaxed text-[var(--fg2)]">{role.body}</p>
                </article>
              ))}
            </div>
          </Glass>
          <div className="grid gap-3 lg:col-span-5">
            <Glass id="toolkit" className="p-6 lg:p-8">
              <Heading>{vc.sections.toolkit}</Heading>
              <dl className="mt-5 space-y-3">
                {vc.toolkit.map((g) => (
                  <div key={g.group} className="grid grid-cols-[6.5rem_1fr] gap-2">
                    <dt className="font-semibold">{g.group}</dt>
                    <dd className="text-[var(--fg2)]">{g.items.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </Glass>
            <Glass id="education" className="p-6 lg:p-8">
              <Heading>{vc.sections.education}</Heading>
              <h3 className="mt-4 text-xl font-semibold leading-snug">{vc.education.degree}</h3>
              <p className="mt-1 text-[var(--fg2)]">{vc.education.school}. {vc.education.period}.</p>
              <p className="mt-2 font-semibold">{vc.education.result}</p>
              <p className="mt-2 text-[var(--fg2)]">{vc.education.coursework.join(", ")}</p>
              <p className="mt-2 text-sm text-[var(--fg2)]">{vc.education.prior}</p>
            </Glass>
          </div>
        </section>

        <Glass id="contact" className="mt-3 p-6 lg:p-10">
          <Heading>{vc.ask}</Heading>
          <a href={`mailto:${vc.email}`} className="vd mt-6 block break-all text-[clamp(2.5rem,7.6vw,6rem)] font-bold leading-none text-[var(--c1)] underline decoration-[3px] underline-offset-8">
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
