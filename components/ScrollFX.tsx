"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type Variants,
} from "framer-motion";

const EASE_DRS = [0.16, 1, 0.3, 1] as const;

/** Keep a number inside [min, max) — used to loop the marquee seamlessly. */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/* ── Scroll progress rail ───────────────────────────────────────────── */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-ember"
    />
  );
}

/* ── Word-by-word mask reveal ───────────────────────────────────────── */

const wordWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE_DRS } },
};

export function RevealText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.span
      variants={wordWrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-90px" }}
      className={`inline-flex flex-wrap ${className}`}
    >
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="overflow-hidden pb-[0.06em] pr-[0.22em]">
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ── Count-up ───────────────────────────────────────────────────────── */

export function Counter({ value }: { value: string }) {
  // "8.53" → 8.53 with 2 decimals; "12+" → 12 with a "+" suffix.
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const decimals = match?.[1].includes(".") ? match[1].split(".")[1].length : 0;

  const ref = useRef<HTMLSpanElement>(null);
  // Vertical only: a side margin would hide counters sitting close to the page edge.
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const reduceMotion = useReducedMotion();
  const countable = Boolean(match);

  // The markup always holds the real value; the count-up only overwrites it once running.
  useEffect(() => {
    const el = ref.current;
    if (!el || !countable || reduceMotion) return;
    const show = (v: number) => {
      el.textContent = v.toFixed(decimals) + suffix;
    };
    if (!inView) {
      show(0);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE_DRS,
      onUpdate: show,
      onComplete: () => {
        el.textContent = value;
      },
    });
    return () => controls.stop();
  }, [inView, countable, target, decimals, suffix, value, reduceMotion]);

  if (!match) return <span>{value}</span>;
  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}

/* ── Parallax wrapper ───────────────────────────────────────────────── */

export function Parallax({
  children,
  distance = 60,
  className = "",
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const smoothY = useSpring(y, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      {/* Scroll-linked values ignore MotionConfig, so drop the offset after hydration instead. */}
      <motion.div style={{ y: mounted && reduceMotion ? 0 : smoothY }}>{children}</motion.div>
    </div>
  );
}

/* ── Velocity-reactive marquee ──────────────────────────────────────── */

export function VelocityTicker({
  items,
  baseVelocity = 2.4,
  className = "border-y border-carbon-500 bg-ember py-3",
  itemClassName = "text-carbon-900",
  bulletClassName = "text-carbon-900/50",
}: {
  items: string[];
  baseVelocity?: number;
  /** Wrapper styling — override to recolour the strip per design variant. */
  className?: string;
  /** Text colour/weight for each item. */
  itemClassName?: string;
  /** Colour for the ◆ separator. */
  bulletClassName?: string;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // Scroll hard and the strip accelerates; scroll up and it reverses.
  const velocityFactor = useTransform(smoothVelocity, [0, 1400], [0, 6], {
    clamp: false,
  });
  // Skew reads as the strip physically leaning under load.
  const reduceMotion = useReducedMotion();
  const skew = useTransform(
    smoothVelocity,
    [-2000, 0, 2000],
    reduceMotion ? [0, 0, 0] : [4, 0, -4],
    { clamp: true }
  );
  const smoothSkew = useSpring(skew, { stiffness: 200, damping: 30 });

  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    // This loop writes the position by hand each frame, so it needs its own stop.
    if (reduceMotion) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  const strip = [...items, ...items, ...items, ...items];

  return (
    <motion.div
      aria-hidden
      style={{ skewY: smoothSkew }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div style={{ x }} className="flex w-max will-change-transform">
        {strip.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`flex items-center gap-6 whitespace-nowrap px-6 font-display text-sm font-extrabold uppercase tracking-wide ${itemClassName}`}
          >
            {item}
            <span className={bulletClassName}>◆</span>
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
