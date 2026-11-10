import { education, experience, profile, skills, stats } from "./content";
import { featured, projects } from "./projects";

/** Every string used by variants 8, 9 and 10. Facts come from content.ts and projects.ts. */

const projectLines: Record<string, string> = {
  flare:
    "Direct messages, servers and role-gated channels, with presence, read receipts and peer-to-peer voice over WebRTC.",
  homelab:
    "A dozen services on hardware I own, reachable over a broadband line that allows no inbound connections. Setup, storage and repairs are all mine.",
  chronos:
    "Built for my own semester: a timetable engine for rotating lab groups and subject-wise maths against the 75% requirement.",
  "cultural-council":
    "The college cultural council site and the Melange 2023 fest microsite, built and deployed end to end.",
  "cesta-site":
    "Portfolio, blog, services and team sections on an SCSS build pipeline.",
};

export const vc = {
  name: profile.name,
  first: profile.first,
  last: profile.last,
  ask: "Looking for a software engineering internship, summer 2027.",
  line: profile.line,
  location: profile.location,
  readouts: stats,
  pipeline: "One reading, five stages.",
  email: profile.email,
  github: profile.github,
  linkedin: profile.linkedin,
  actions: {
    work: "See the work",
    email: "Email me",
    github: "GitHub",
    linkedin: "LinkedIn",
    live: "Open live site",
  },
  sections: {
    work: "Work",
    experience: "Experience",
    toolkit: "Toolkit",
    education: "Education",
    contact: "Contact",
  },
  mohar: {
    name: featured.name,
    subtitle: featured.subtitle,
    context: featured.context,
    role: featured.role,
    image: featured.image,
    stack: featured.stack,
    body: featured.body,
    points: featured.points,
    pitch:
      "Offline inspections of weighing scales, where any record altered after capture gets caught.",
    stages: [
      { key: "Capture", text: "An inspector records a scale reading in the field, with no internet." },
      { key: "Sign", text: "The reading is digitally signed on the device." },
      { key: "Chain", text: "Each record is chained to the one before it." },
      { key: "Sync", text: "The server re-verifies each record and stores it append-only." },
      { key: "Verify", text: "A checker rules pass or fail against Legal Metrology tolerances." },
    ],
  },
  demo: {
    title: "Change a reading. Watch it get caught.",
    note: "Sample readings and a simplified hash, running in this page to show the idea.",
    ok: "All records match their signatures.",
    bad: (n: number) =>
      `Record ${n} changed after signing. It and every later record now fail verification.`,
    reset: "Restore readings",
    record: (n: number) => `Record ${n}`,
    unit: "kg",
    signed: "Signed hash",
    passed: "Verified",
    failed: "Failed",
  },
  projects: projects.map((p) => ({
    id: p.id,
    title: p.title.replace("–", "-"),
    kind: p.discipline,
    line: projectLines[p.id],
    stack: p.stack,
    image: p.image,
    live: p.live,
    minor: Boolean(p.minor),
  })),
  roles: experience.map((r) => ({
    id: r.id,
    title: r.title,
    org: r.location ? `${r.org}, ${r.location}` : r.org,
    period: r.period.replace(" — ", " to "),
    body: r.body,
  })),
  toolkit: skills,
  education: {
    degree: education.degree,
    school: `${education.school}, ${education.location}`,
    period: "2024 to 2028 (expected)",
    result: "CGPA 8.53 / 10, First Division",
    coursework: education.coursework,
    prior: `${education.prior.title}, ${education.prior.school}, ${education.prior.period}`,
  },
};

/** Variant 12: the page about Ashwin. Every fact traces back to content.ts or projects.ts. */
export const daylight = {
  skipLink: "Skip to work",
  statement: "I build full-stack products, then actually keep them running.",
  roles: ["Full-stack developer", "Server operator", "Hackathon team lead", "Creative head"],
  photoAlt: "Ashwin Kumar looking out at a sunset",
  ticker: ["Open to SWE internships", "Summer 2027", "Delhi NCR", "Full-stack"],
  aboutTitle: "The short version.",
  sides: [
    { title: "I build.", body: "Full-stack products, including a real-time chat platform with servers, channels and voice.", color: "var(--c4)" },
    { title: "I keep it running.", big: "12+", bigLabel: "services on my own server", body: "Setup, storage and repairs are all mine.", color: "var(--c2)" },
    { title: "I lead.", big: "6", bigLabel: "person team", body: "Team lead and lead developer at Smart India Hackathon 2026.", color: "var(--c3)" },
    { title: "I design.", body: "A full year as Creative Head at CESTA: posters, social graphics and event branding.", color: "var(--c1)" },
  ],
  workTitle: "Things I've built.",
  work: [
    vc.projects[0],
    {
      id: "mohar",
      title: vc.mohar.name,
      kind: "Tamper-evident field verification",
      line: vc.mohar.pitch,
      stack: vc.mohar.stack,
      image: vc.mohar.image,
      live: undefined,
      minor: false,
    },
    // cestasite.vercel.app returned 404 at launch; restore the link once the deployment is back.
    ...vc.projects.slice(1).map((p) => (p.id === "cesta-site" ? { ...p, live: undefined } : p)),
  ],
  storyTitle: "How I got here.",
  story: [
    { when: "2023-24", title: "Cultural Council site", body: "Built and deployed the council site and the Melange 2023 fest microsite." },
    { when: "2024", title: "Started B.Tech at Delhi Technical Campus", body: "Computer Science and Engineering, expected 2028." },
    { when: "2025 to now", title: "Personal Linux Server", body: "A dozen services on hardware I own, instead of paying for hosting." },
    { when: vc.roles[1].period, title: vc.roles[1].title, org: vc.roles[1].org, body: vc.roles[1].body },
    { when: "2026", title: "Team lead, Smart India Hackathon", body: "Led a team of 6 building Mohar, offline inspections where any altered record gets caught." },
    { when: vc.roles[0].period, title: vc.roles[0].title, org: vc.roles[0].org, body: vc.roles[0].body },
    { when: "Summer 2027", title: "Your team, hopefully.", body: vc.ask },
  ],
  toolkitTitle: "What I work with.",
  contact: "Let's build something.",
};

export const sampleReadings =["5.002", "9.998", "19.996", "49.991"];

export const sectionIds = ["work", "experience", "toolkit", "education", "contact"] as const;
