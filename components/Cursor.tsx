"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type Variant = "default" | "link" | "view" | "hidden";

/** Ring trails with weight; dot stays glued to the pointer. */
const RING_SPRING = { stiffness: 260, damping: 26, mass: 0.4 } as const;
const DOT_SPRING = { stiffness: 900, damping: 42, mass: 0.16 } as const;

const RING = {
  default: { size: 34, border: "rgba(237,237,239,0.45)", bg: "rgba(237,237,239,0)" },
  link: { size: 64, border: "rgba(224,91,78,0.9)", bg: "rgba(224,91,78,0.12)" },
  view: { size: 88, border: "rgba(224,91,78,1)", bg: "rgba(224,91,78,1)" },
  hidden: { size: 0, border: "rgba(237,237,239,0)", bg: "rgba(237,237,239,0)" },
} as const;

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, RING_SPRING);
  const ringY = useSpring(y, RING_SPRING);
  const dotX = useSpring(x, DOT_SPRING);
  const dotY = useSpring(y, DOT_SPRING);

  /* Mouse only — never hijack a touch pointer, and leave the native cursor
     alone for anyone who has asked for less motion. */
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches && !reduceMotion);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-none");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    /* Delegation: any [data-cursor], link or button sets the context. */
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "[data-cursor],a,button"
      ) as HTMLElement | null;
      if (!el) return setVariant("default");
      const declared = el.dataset?.cursor as Variant | undefined;
      setVariant(declared ?? "link");
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ring = RING[variant];

  return (
    <>
      {/* Ring — trails, resizes by context */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center"
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border"
          animate={{
            width: ring.size * (pressed ? 0.85 : 1),
            height: ring.size * (pressed ? 0.85 : 1),
            borderColor: ring.border,
            backgroundColor: ring.bg,
            x: "-50%",
            y: "-50%",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.5 }}
        >
          <AnimatePresence>
            {variant === "view" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                className="whitespace-nowrap font-mono text-[0.5625rem] font-bold uppercase tracking-telemetry text-carbon-900"
              >
                View
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dot — 1:1 with the pointer, inverted so it reads on any background */}
      <motion.div
        aria-hidden
        style={{ x: dotX, y: dotY }}
        className="pointer-events-none fixed left-0 top-0 z-[91] mix-blend-difference"
        animate={{ opacity: visible && variant !== "view" ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="h-1.5 w-1.5 rounded-full bg-chalk"
          animate={{ scale: pressed ? 1.8 : 1, x: "-50%", y: "-50%" }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        />
      </motion.div>
    </>
  );
}
