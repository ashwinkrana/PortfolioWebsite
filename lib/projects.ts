import type { RevealProject } from "@/components/TechHoverReveal";

/**
 * Placeholder wireframes live in /public/work/*.svg — self-contained, so the
 * hover reveal always has something to draw. Swap them for real screenshots
 * (same paths) when you have them.
 */

/** Mohar gets its own featured block above the roster. */
export const featured = {
  id: "mohar",
  name: "Mohar",
  subtitle: "Tamper-Evident Field Verification System",
  context: "Smart India Hackathon 2026",
  role: "Team Lead & Lead Developer, team of 6",
  year: "2026",
  image: "/work/mohar.svg",
  stack: ["Python", "JavaScript", "SQLite"],
  body: [
    "Built for a Ministry of Consumer Affairs problem statement: an offline-first app letting government inspectors verify weighing scales in the field with no internet.",
    "Every reading is digitally signed on-device and chained to the previous one, so the server can detect any record altered after capture. The backend re-verifies each record on sync and stores it append-only, keeping both the original and any tampered version as evidence.",
    "An automated checker rules pass/fail against the tolerances in the Legal Metrology (General) Rules, 2011.",
  ],
  points: [
    { k: "Signing", v: "On-device, per reading" },
    { k: "Integrity", v: "Hash-chained records" },
    { k: "Storage", v: "Append-only on sync" },
    { k: "Compliance", v: "LM Rules, 2011" },
  ],
};

export const projects: RevealProject[] = [
  {
    id: "flare",
    index: "02",
    title: "Flare",
    discipline: "Real-time platform",
    summary:
      "Chat platform combining WhatsApp-style direct messages with Discord-style servers and role-gated channels. JWT access and refresh tokens, presence, typing indicators, read receipts, reactions, pinned messages, invite codes, and WebRTC signalling for peer-to-peer voice.",
    stack: ["React", "Node", "Socket.IO", "MongoDB"],
    image: "/work/flare.svg",
    live: "https://flare-pied-phi.vercel.app",
  },
  {
    id: "homelab",
    index: "03",
    title: "Personal Linux Server",
    discipline: "Self-hosted infrastructure",
    summary:
      "A dozen services running on hardware I own — storage, media, credentials, DNS filtering — instead of paying for hosting. Reachable over a broadband line that doesn't support inbound connections, using tunnelling and custom subdomains. Network-wide ad and tracker filtering, plus firewall rules controlling what can reach the box. Setup, storage and repairs all mine.",
    stack: ["Linux", "Docker", "DNS", "Networking"],
    year: "2025 — NOW",
    image: "/work/homelab.svg",
  },
  {
    id: "chronos",
    index: "04",
    title: "ChronosTrack",
    discipline: "Attendance engine",
    summary:
      "Built for my own semester. Node and Express backend, signed cookie sessions, a timetable engine handling rotating lab groups, and subject-wise maths against the 75% requirement. Syncs across devices because state lives server-side.",
    stack: ["Node", "Express"],
    image: "/work/chronos.svg",
  },
  {
    id: "cultural-council",
    index: "05",
    title: "Cultural Council 23–24",
    discipline: "Society site & fest microsite",
    summary:
      "Site for the college cultural council, including the Melange 2023 fest microsite. Built and deployed end to end.",
    stack: ["HTML", "CSS", "JS"],
    year: "2023—24",
    image: "/work/cultural.svg",
    minor: true,
    live: "https://cc-main-23-24.vercel.app",
  },
  {
    id: "cesta-site",
    index: "06",
    title: "CESTA Site",
    discipline: "Multi-page society site",
    summary:
      "Portfolio, blog, services and team sections on an SCSS build pipeline, responsive throughout.",
    stack: ["SCSS", "JS"],
    image: "/work/cesta.svg",
    minor: true,
    live: "https://cestasite.vercel.app",
  },
];
