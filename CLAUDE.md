# Portfolio — project instructions

Personal portfolio for Ashwin Kumar. Next.js 14 App Router, TypeScript,
Tailwind, Framer Motion, Lenis, raw WebGL. Single page. The site is about
Ashwin, not any one project (see `PRODUCT.md`).

## Commands
- Dev: `npm run dev`
- Build: `npm run build`  ← run this, not just `tsc --noEmit`
- Types: `npx tsc --noEmit`
- Never run `npm run build` while a dev server is running from this folder:
  both write to `.next` and the dev server starts returning 404s. Stop every
  `next` process first; stopping only the `npm` parent can leave Next running.

## Architecture
- Live site: `app/(site)/page.tsx` + `app/(site)/layout.tsx` (design name
  "Daylight": bright glass over the Silk shader, Manrope, scoped palette).
- `app/layout.tsx` is deliberately minimal: metadata, Lenis, MotionConfig.
- Content lives in `lib/content.ts` and `lib/projects.ts`. Homepage wording
  lives in `lib/variantContent.ts` (`vc`, `daylight`), built from those files.
  Never hardcode copy into components — add it to lib/ and read it.
- `components/webgl/` is the Silk background: `backgroundEngine.ts` (imperative
  raw WebGL, dynamically imported), `backgroundShaders.ts` (GLSL strings),
  `ShaderBackground.tsx` (React shell + CSS fallback). Keep that separation.
  The old fluid-reveal engine is gone; `.claude/rules/frontend.md` still names it.
- Glass components (`Glass`, `GlassNav`, `Magnetic`, `RiseName`...) are in
  `components/variants/signal/kit.tsx`; the material is `glassCss.ts`.
- Design tokens for the live site are the CSS variables in
  `app/(site)/layout.tsx`. `tailwind.config.ts` (`carbon-*`, `ember-*`,
  `chalk-*`) belongs to the archived designs.
  Never introduce a raw hex or a new colour without asking.
- `app/variants/*` is the design archive (variants 1-11, 13, and `classic`, the
  previous homepage). It has its own fonts, cursor and dark theme in
  `app/variants/layout.tsx`, works in dev, and redirects to `/` in production.

## Non-negotiables
- Every WebGL mount must keep: DPR cap, delta clamp, IntersectionObserver
  pause, visibilitychange pause, full dispose(), reduced-motion path, and a
  real DOM fallback.
- `prefers-reduced-motion` must be honoured by every new animation.
- Never put opacity, filter or mask on an ancestor of a `.glass` element; it
  stops `backdrop-filter` from seeing the page behind it.
- Run `npm run build` before telling me something is done.

## Style
- I know Python and Java well; TypeScript and GLSL less so. Comment shader
  and WebGL code line by line. Skip comments on ordinary React.
- Show me a plan before writing more than ~50 lines.

## Hosting
- Built for Vercel: no configuration needed. On any other host set
  `NEXT_PUBLIC_SITE_URL` (used by metadata, robots and the sitemap) and install
  `sharp` for image optimisation.
- `/variants` redirects to `/` in production and is disallowed in robots.

## Open before launch
- `public/work/*.svg` are placeholder wireframes; replace with real screenshots.
- `cestasite.vercel.app` returned 404, so its link is removed from the homepage
  (`daylight.work` in `lib/variantContent.ts`). Restore it when the site is back.
- "3 products live" (`stats` in `lib/content.ts`, `daylight.sides`) counts that
  deployment; only two others were confirmed responding.
- `ashwinkumar.dev`, previously in the metadata, does not resolve.
