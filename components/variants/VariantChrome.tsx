import Link from "next/link";

/**
 * Fixed identifier bar shared by every design variant. Server component —
 * no interactivity, it just labels the exploration and links back to the
 * index and the live site. Colours are inherited from the variant's scoped
 * palette via CSS custom properties (--v-bar-*), so it never needs to know
 * which variant it is sitting inside.
 */
export default function VariantChrome({
  n,
  name,
}: {
  n: string;
  name: string;
}) {
  return (
    <div className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between gap-4 border-b border-[var(--v-bar-line)] bg-[var(--v-bar-bg)] px-4 py-2 backdrop-blur-md sm:px-6">
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-[var(--v-bar-dim)]">
        <span className="text-[var(--v-bar-accent)]">Variant {n}</span>
        <span className="mx-2 opacity-40">/</span>
        {name}
      </span>
      <span className="flex items-center gap-4 font-mono text-[0.625rem] uppercase tracking-[0.22em]">
        <Link
          href="/variants"
          className="text-[var(--v-bar-dim)] transition-opacity hover:opacity-60"
        >
          ← All variants
        </Link>
        <Link
          href="/"
          className="hidden text-[var(--v-bar-dim)] transition-opacity hover:opacity-60 sm:inline"
        >
          Live site
        </Link>
      </span>
    </div>
  );
}
