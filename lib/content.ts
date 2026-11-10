export const profile = {
  name: "Ashwin Kumar",
  first: "Ashwin",
  last: "Kumar",
  line: "Computer science undergrad who builds full-stack products and then actually keeps them running.",
  location: "Greater Noida / Delhi NCR",
  status: "Seeking a software engineering internship for summer 2027",
  email: "ashwinkrana@gmail.com",
  github: "https://github.com/ashwinkrana",
  linkedin: "https://linkedin.com/in/ashwinkrana",
};

export const hero = {
  primaryAction: "See the work",
  secondaryAction: "GitHub",
  proof: {
    context: "Smart India Hackathon 2026",
    name: "Mohar",
    line: "Offline-first inspections where any altered record gets caught.",
  },
};

export const stats = [
  { value: "SIH", label: "Team lead, 2026" },
  { value: "12+", label: "Services running" },
  { value: "3", label: "Live deployments" },
  { value: "8.53", label: "CGPA" },
];

export type Role = {
  id: string;
  title: string;
  org: string;
  location?: string;
  period: string;
  body: string;
  meta: string[];
};

export const experience: Role[] = [
  {
    id: "rahbar",
    title: "Database Manager Intern",
    org: "Rahbar Infotech Solutions Pvt. Ltd.",
    location: "Noida",
    period: "April — May 2026",
    body: "Wrote SQL to generate reporting for internal teams and to surface errors sitting in company records. Audited and cleaned production data, correcting inconsistencies before downstream teams consumed it. Assisted on backup and recovery, and documented how the databases were structured.",
    meta: ["SQL", "Data quality", "Documentation"],
  },
  {
    id: "cesta",
    title: "Creative Head",
    org: "CESTA, Delhi Technical Campus",
    period: "Oct 2025 — Aug 2026",
    body: "Ran visual identity for the department's technical society. Posters, social graphics and event branding, delivered on schedule alongside the organising team across a full year of events.",
    meta: ["Design", "Branding"],
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "Java", "C++", "JavaScript", "C"] },
  { group: "Data", items: ["SQL", "Database design", "Data cleaning"] },
  { group: "Systems", items: ["Linux", "Docker", "Networking", "DNS", "Git"] },
  {
    group: "Design",
    items: ["Photoshop", "Illustrator", "After Effects", "Premiere Pro", "Figma"],
  },
  { group: "Spoken", items: ["English (fluent)", "Hindi (native)"] },
];

export const education = {
  degree: "B.Tech, Computer Science and Engineering",
  period: "2024 — 2028 (expected)",
  school: "Delhi Technical Campus, GGSIPU",
  location: "Greater Noida",
  result: "CGPA 8.53 / 10 — First Division",
  coursework: [
    "Data Structures",
    "OOP",
    "DBMS",
    "Java",
    "Discrete Mathematics",
    "Digital Logic and Computer Design",
  ],
  prior: {
    title: "Senior Secondary",
    school: "Seth Anandram Jaipuria School, Vasundhara, Ghaziabad",
    period: "2024",
  },
};
