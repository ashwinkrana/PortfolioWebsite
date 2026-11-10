# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: software engineering recruiters and hiring engineers evaluating Ashwin Kumar for a summer 2027 internship. They skim quickly and need proof of real engineering within seconds.

## Product Purpose

A single-page personal portfolio. The site is about Ashwin, the person. Success means a recruiter understands who Ashwin is and what they are being asked for, sees proof of real engineering, and makes contact or opens the work.

## Positioning

A computer science undergrad who builds full-stack products and then actually keeps them running, and who also leads teams and designs. Ashwin leads every page. Projects are evidence for that; Mohar (tamper-evident field verification, built as team lead at Smart India Hackathon 2026) is one strong project among several, not the headline.

## Operating Context

Read on desktop during a resume screen, or on a phone from a link. Evaluated alongside many other student portfolios.

## Capabilities and Constraints

- Next.js 14 App Router, TypeScript, Tailwind, Framer Motion, Lenis. Single page.
- All copy lives in `lib/content.ts` and `lib/projects.ts`.
- `prefers-reduced-motion` must be honoured by every animation.
- Wording may be rewritten; every fact (projects, dates, numbers, roles) must stay true and nothing may be invented.

## Brand Commitments

- Name: Ashwin Kumar.
- Copy voice is specific and plain, as in "and then actually keeps them running".

## Evidence on Hand

- Projects: Mohar, Flare (live), Personal Linux Server, ChronosTrack, Cultural Council 23-24 (live), CESTA Site (live). Details in `lib/projects.ts`.
- Experience: Database Manager Intern at Rahbar Infotech; Creative Head at CESTA. Education: B.Tech CSE, CGPA 8.53. Details in `lib/content.ts`.
- Photos of Ashwin: `public/hero-dusk.png` and `public/portrait.png`.
- Images in `public/work/*.svg` are placeholder wireframes. Ashwin will supply real screenshots at those paths later, so layouts need image slots.
- No testimonials, employer logos, traffic numbers or uptime figures exist. Do not fabricate them.

## Product Principles

1. Proof before claims: show the engineering rather than describing it.
2. The site is about Ashwin, not any one project.
3. A recruiter must find the ask and a way to make contact without hunting.
4. Every link goes somewhere. Nothing looks clickable that is not.
