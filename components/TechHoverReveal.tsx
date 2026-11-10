"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

export type RevealProject = {
  id: string;
  /** Zero-padded entry number, e.g. "01" */
  index: string;
  title: string;
  /** Short classifier, e.g. "Real-time platform" */
  discipline: string;
  /** One or two sentences of what it actually does */
  summary: string;
  stack: string[];
  /** Only rendered when the project has a meaningful date */
  year?: string;
  /** Visual asset revealed on hover — wireframe, render, screenshot */
  image: string;
  /** Deployed URL, if there is one */
  live?: string;
  href?: string;
  /** Smaller title: real work, but not what the page should lead with */
  minor?: boolean;
};

/**
 * Cursor physics. Tuned per spec: light mass + low damping means the asset
 * arrives a beat AFTER the cursor and overshoots very slightly — that lag is
 * what reads as "premium" rather than "glued to the pointer".
 */
const CURSOR_SPRING = { stiffness: 150, damping: 15, mass: 0.1 } as const;

/** Card footprint (px) — used to centre the asset on the cursor without a CSS transform clash. */
const CARD_W = 340;
const CARD_H = 230;

export default function TechHoverReveal({ project }: { project: RevealProject }) {
  const [active, setActive] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const reduceMotion = useReducedMotion();

  /**
   * Gate on the pointer itself, not on a width breakpoint — a 900px-wide
   * laptop window still has a mouse and should still get the reveal.
   */
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Raw pointer position (viewport coords), then the springs that trail it.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, CURSOR_SPRING);
  const y = useSpring(pointerY, CURSOR_SPRING);

  // Horizontal velocity → banked tilt. Flick the cursor across the row and the
  // asset leans into the movement like a car loading up on turn-in.
  const velocityX = useVelocity(x);
  const bank = useTransform(velocityX, [-1400, 0, 1400], [-14, 0, 14], { clamp: true });
  const tilt = useSpring(bank, { stiffness: 120, damping: 22, mass: 0.25 });

  const move = (clientX: number, clientY: number) => {
    pointerX.set(clientX - CARD_W / 2);
    pointerY.set(clientY - CARD_H / 2);
  };

  const handleEnter = (e: React.PointerEvent<HTMLElement>) => {
    // Touch and pen have no hover state — leave them the static thumbnail.
    if (!canHover || reduceMotion || e.pointerType === "touch") return;
    move(e.clientX, e.clientY);
    // Snap the springs to the entry point so the card never flies in from 0,0.
    x.jump(pointerX.get());
    y.jump(pointerY.get());
    setActive(true);
  };

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!active) return;
    move(e.clientX, e.clientY);
  };

  const reveal = (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none fixed left-0 top-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
        >
          <motion.div style={{ rotate: tilt }}>
            <motion.div
              initial={{ scale: 0.78, rotate: -8, filter: "blur(6px)" }}
              animate={{
                scale: 1,
                rotate: -3,
                filter: "blur(0px)",
                transition: { type: "spring", stiffness: 220, damping: 20, mass: 0.4 },
              }}
              exit={{
                scale: 0.86,
                rotate: 4,
                transition: { duration: 0.2, ease: [0.85, 0, 0.15, 1] },
              }}
              style={{ width: CARD_W, height: CARD_H }}
              className="relative overflow-hidden border border-ember/50 bg-carbon-900 shadow-lift"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
              {/* Wash keeps every asset on-brand regardless of source */}
              <span className="absolute inset-0 bg-carbon-900/30" />
              <span className="absolute inset-0 bg-ember/10 mix-blend-overlay" />

              {/* Telemetry overlay */}
              <span className="absolute left-3 top-3 bg-ember px-2 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-telemetry text-carbon-900">
                {project.index}
                {project.year ? ` / ${project.year}` : ""}
              </span>
              <span className="absolute bottom-3 left-3 font-mono text-[0.625rem] uppercase tracking-telemetry text-chalk">
                {project.discipline}
              </span>
              {/* Corner crosshairs */}
              <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-ember" />
              <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-ember" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const destination = project.live ?? project.href;

  // Only rows that go somewhere get the "group" class, so the ember wipe and
  // every group-hover style below simply never fire on a row with no link.
  const rowClass = `relative block border-t border-carbon-500 transition-colors duration-500 ease-drs ${
    destination ? "group focus-visible:bg-carbon-700 focus-visible:-outline-offset-2" : ""
  }`;

  const pointerHandlers = {
    onPointerEnter: handleEnter,
    onPointerMove: handleMove,
    onPointerLeave: () => setActive(false),
    onPointerCancel: () => setActive(false),
  };

  const row = (
    <>
        {/* Ember wipe: fills the row from the left on hover, sits under the type. */}
        {destination && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-ember transition-transform duration-[600ms] ease-drs group-hover:scale-x-100 motion-reduce:transition-none"
          />
        )}

        <div className="relative flex items-start gap-5 px-4 py-8 sm:gap-8 sm:px-6 md:py-10 lg:px-10">
          {/* Entry number */}
          <span className="mt-1 font-mono text-telemetry tracking-telemetry text-chalk-muted transition-colors duration-300 group-hover:text-carbon-900">
            {project.index}
          </span>

          {/* Touch fallback thumbnail — no hover means no reveal, so show it inline. */}
          {!canHover && (
            <span className="relative hidden h-14 w-20 shrink-0 overflow-hidden border border-carbon-500 sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
              />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p className="font-mono text-[0.6875rem] uppercase tracking-telemetry text-chalk-muted transition-colors duration-300 group-hover:text-carbon-900">
              {project.discipline}
            </p>
            <h3
              className={`mt-2 font-display font-extrabold uppercase leading-none text-chalk transition-colors duration-300 [overflow-wrap:anywhere] group-hover:text-carbon-900 ${
                project.minor ? "text-roster-minor" : "text-roster"
              }`}
            >
              {project.title}
            </h3>
            <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-chalk-muted transition-colors duration-300 group-hover:text-carbon-900">
              {project.summary}
            </p>

            {/* Stack + deployment readout */}
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="border border-carbon-500 px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-telemetry text-chalk-muted transition-colors duration-300 group-hover:border-carbon-900/25 group-hover:text-carbon-900"
                >
                  {tech}
                </span>
              ))}
              {project.live && (
                <span className="flex min-w-0 items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-telemetry text-ember transition-colors duration-300 [overflow-wrap:anywhere] group-hover:text-carbon-900">
                  <span className="h-1.5 w-1.5 animate-scanline bg-current" />
                  Live — {project.live.replace(/^https:\/\//, "")}
                </span>
              )}
            </div>
          </div>

          {project.year && (
            <span className="hidden shrink-0 self-start font-mono text-telemetry tracking-telemetry text-chalk-muted transition-colors duration-300 group-hover:text-carbon-900 sm:block">
              {project.year}
            </span>
          )}

          {/* Arrow slides out on approach */}
          {destination && (
            <span
              aria-hidden
              className="shrink-0 translate-x-0 self-start text-2xl text-chalk-muted transition-all duration-500 ease-drs group-hover:translate-x-2 group-hover:text-carbon-900"
            >
              ↗
            </span>
          )}
        </div>
    </>
  );

  return (
    <>
      {destination ? (
        <a
          href={destination}
          target={project.live ? "_blank" : undefined}
          rel={project.live ? "noopener noreferrer" : undefined}
          data-cursor="hidden"
          onFocus={() => setActive(false)}
          className={rowClass}
          {...pointerHandlers}
        >
          {row}
        </a>
      ) : (
        <div data-cursor="hidden" className={rowClass} {...pointerHandlers}>
          {row}
        </div>
      )}

      {/*
        Portalled to <body>: `position: fixed` is measured against the nearest
        ancestor with a transform/filter, and this page has plenty of those.
        Escaping the tree guarantees the card tracks the real viewport.
      */}
      {canHover && typeof document !== "undefined"
        ? createPortal(reveal, document.body)
        : null}
    </>
  );
}
