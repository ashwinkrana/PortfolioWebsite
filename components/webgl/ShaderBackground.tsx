"use client"; // Owns a WebGL canvas and its browser-only lifecycle.

import { useEffect, useRef, useState } from "react";
import type { BackgroundEngine } from "./backgroundEngine";

export default function ShaderBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<BackgroundEngine | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("./backgroundEngine").then(({ createBackgroundEngine }) => {
      if (cancelled || !canvas.current) return;
      engine.current = createBackgroundEngine(canvas.current, reduce, () => setVisible(false));
      if (engine.current) setVisible(true);
    });

    return () => {
      cancelled = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "linear-gradient(135deg, #f7d6c8, #cdeaf0 55%, #f7d0e0)" }}
    >
      <canvas
        ref={canvas}
        className={`h-full w-full transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
