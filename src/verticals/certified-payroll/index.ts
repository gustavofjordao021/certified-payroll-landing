// Vertical skin: certified payroll (WH-347 + California DIR eCPR).
// Everything specific to this vertical lives here so vertical #2 (DQ files /
// DOT compliance) is a sibling directory, not a rewrite.

export const vertical = {
  id: "certified-payroll",
  name: "Certified Payroll",
  positioning:
    "Upload your payroll report — get your signed WH-347 and state certified payroll forms back in minutes, every week, for every project.",
  buyer: "Subcontractors and small GCs on public works projects",
  outputs: ["WH-347 PDF", "California DIR eCPR XML (planned)"],
  // Funnel pages, from measured keyword data (see research/opportunity-scout):
  // "wh 347 form" 1,300/mo · "dir certified payroll" 500/mo (low comp) ·
  // "certified payroll report" 500/mo
  funnelPages: [
    { slug: "wh-347-generator", title: "Free WH-347 Generator" },
    { slug: "california-dir-ecpr", title: "California DIR eCPR Guide" },
    { slug: "certified-payroll-report", title: "What is a Certified Payroll Report?" },
  ],
} as const;

// TODO(v1): California DIR eCPR XML serializer — spec at
// https://www.dir.ca.gov/public-works/ecpruserguide.pdf (XML upload path
// confirmed viable: contractor downloads XML from us, submits via their own
// DIR portal login — no per-customer integration needed).
