"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { profile } from "@/lib/content";

const EASE = [0.85, 0, 0.15, 1] as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const DURATION = 1800;

/* The whole overlay lifts away as one panel. */
const shell: Variants = {
  exit: {
    y: "-100%",
    transition: { duration: 0.9, ease: EASE, delay: 0.15 },
  },
};

const content: Variants = {
  exit: { opacity: 0, transition: { duration: 0.25, ease: "linear" } },
};

const rise: Variants = {
  initial: { y: "110%" },
  animate: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT, delay: 0.1 } },
};

export default function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const reduceMotion = useReducedMotion();

  /* Lock the page while the curtain is down. */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /* Single smooth ease to 100 — no stutter, no noise. */
  useEffect(() => {
    // Dismissed from an effect rather than by rendering nothing: the server
    // can't know this preference, so its markup always includes the panel and
    // the first client render has to match it.
    if (reduceMotion) {
      onDone();
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setPct(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPct(100);
        window.setTimeout(onDone, 220);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, reduceMotion]);

  return (
    <motion.div
      variants={shell}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[100] bg-carbon-900"
      role="status"
      aria-label="Loading"
    >
      <motion.div
        variants={content}
        className="gutter flex h-full flex-col justify-between py-6"
      >
        {/* Top rail */}
        <div className="flex items-center justify-between">
          <span className="label">{profile.location}</span>
          <span className="label">2026</span>
        </div>

        {/* Centre */}
        <div className="flex flex-col items-center">
          <div className="overflow-hidden">
            <motion.p
              variants={rise}
              className="font-display text-[clamp(1.75rem,6vw,4.5rem)] font-black uppercase leading-none tracking-tight text-chalk"
            >
              {profile.name}
            </motion.p>
          </div>

          {/* Hairline rail */}
          <div className="mt-10 h-px w-[min(78vw,420px)] bg-carbon-500">
            <div
              className="h-full bg-ember transition-[width] duration-100 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-4 flex w-[min(78vw,420px)] items-center justify-between">
            <span className="label">Loading</span>
            <span className="font-mono text-telemetry tracking-telemetry text-chalk">
              {String(pct).padStart(3, "0")}
            </span>
          </div>
        </div>

        {/* Bottom rail */}
        <span className="label text-center">Design × Code</span>
      </motion.div>
    </motion.div>
  );
}
