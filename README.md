# Ashwin Rana — Portfolio

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Structure

| Path | Purpose |
| --- | --- |
| `tailwind.config.ts` | Design tokens — `carbon` (#111112), `acid` (#D2FF00), fluid display scale, motion curves |
| `app/globals.css` | Base layer, grain texture, `.label` telemetry style, reduced-motion guard |
| `app/layout.tsx` | Fonts (Archivo / Inter / JetBrains Mono) + metadata |
| `app/page.tsx` | Hero, ticker, roster, capabilities, footer |
| `components/TechHoverReveal.tsx` | Cursor-tracking hover reveal (spring: stiffness 150, damping 15, mass 0.1) |
| `components/RotatingObject.tsx` | CSS-3D placeholder for the hero WebGL slot |
| `lib/projects.ts` | Roster data — swap `image` fields for assets in `/public` |

## Before launch

1. Replace the Unsplash placeholders in `lib/projects.ts` with real work (put files in `/public/work/`, then drop the `images.remotePatterns` entry from `next.config.mjs`).
2. Point the GitHub / LinkedIn hrefs in `app/page.tsx` at real profiles.
3. Update `metadataBase` in `app/layout.tsx` to the production domain and add `/public/og.png`.

## Deploy

Push to GitHub → import on Vercel. Framework preset auto-detects Next.js; no env vars required.
