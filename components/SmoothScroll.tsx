"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertia scrolling.
 *
 * Lenis drives the real window scroll position (it does not transform a
 * wrapper), so `position: fixed`, the custom cursor, and Framer's `useScroll`
 * all keep working exactly as they do natively.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Heavy start, long glide out — the "expensive machinery" feel.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* Same-page anchors have to route through Lenis or they snap. */
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      // The live site positions anchors with CSS scroll margins; only the archive needs this offset.
      lenis.scrollTo(target, { offset: target.closest(".site-scope") ? 0 : -80 });
      // preventDefault also cancels the URL update and the focus move, so do both by hand.
      history.pushState(null, "", hash);
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
