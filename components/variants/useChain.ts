import { useEffect, useMemo, useState } from "react";
import { sampleReadings } from "@/lib/variantContent";

const fnv1a = (text: string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
};

const chain = (readings: string[]) => {
  let previous = "00000000";
  return readings.map((reading) => (previous = fnv1a(previous + reading)));
};

const signedAtCapture = chain(sampleReadings);

export function useChain() {
  const [readings, setReadings] = useState(sampleReadings);

  const records = useMemo(() => {
    const computed = chain(readings);
    return readings.map((reading, i) => ({
      reading,
      signed: signedAtCapture[i],
      ok: computed[i] === signedAtCapture[i],
    }));
  }, [readings]);

  const firstBroken = records.findIndex((r) => !r.ok);

  return {
    records,
    firstBroken,
    broken: firstBroken !== -1,
    change: (index: number, value: string) =>
      setReadings((all) => all.map((r, i) => (i === index ? value : r))),
    reset: () => setReadings(sampleReadings),
  };
}

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Set<string>();
    let clicked: string | null = null;
    // Sections can share a row; the link just clicked wins, otherwise the first in page order.
    const update = () => setActive(clicked && visible.has(clicked) ? clicked : ids.find((id) => visible.has(id)) ?? null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target.id) : visible.delete(entry.target.id)));
        update();
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const onClick = (e: MouseEvent) => {
      const href = (e.target as HTMLElement).closest?.('a[href^="#"]')?.getAttribute("href");
      if (href && ids.includes(href.slice(1))) {
        clicked = href.slice(1);
        update();
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, [ids]);

  return active;
}
