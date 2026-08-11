import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Fill Out Form WH-347, Column by Column (2026)",
  description:
    "A practical walkthrough of every field on the WH-347 certified payroll form — worker rows, daily hours, overtime, fringe benefits, and the Statement of Compliance.",
  alternates: { canonical: "https://www.wh347form.com/how-to-fill-out-wh-347" },
};

export default function Page() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Do I put full Social Security numbers on the WH-347?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"No. Use the worker's name plus an identifying number, typically the last four digits of the SSN, on submitted copies.\"}}, {\"@type\": \"Question\", \"name\": \"How is overtime shown on the WH-347?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Column 4 has separate rows for overtime and straight time per day; overtime is paid at no less than 1.5 times the base rate, and weekly totals go in column 5.\"}}, {\"@type\": \"Question\", \"name\": \"When is the WH-347 due?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Weekly, within seven days after the regular pay date for the payroll week, for every week workers are employed on the covered project.\"}}]}" }}
      />
      <span className="badge">Step-by-step</span>
      <h1>How to fill out form WH-347, column by column</h1>
      <p className="lede">
        The WH-347 is one page of payroll grid plus one page of sworn statement.
        Here is what goes where, and the spots where filings actually get
        rejected. (Or skip the manual work — the{" "}
        <Link href="/wh-347-generator">free generator</Link> fills the grid for
        you.)
      </p>

      <h2>The header</h2>
      <p>
        Contractor or subcontractor name (check the correct box), your address,
        the <strong>payroll number</strong> (sequential per project — payroll
        No. 1 is your first week on the job), the <strong>week ending</strong>{" "}
        date, and the project name, location, and project or contract number as
        they appear in your contract documents.
      </p>

      <h2>The worker grid</h2>
      <p>
        One row per worker, per classification. The columns:
      </p>
      <div className="grid">
        <div className="card"><h3>1 — Name & ID</h3><p>Full name plus an identifying number (typically the last four digits of the SSN — never the full SSN on the submitted copy).</p></div>
        <div className="card"><h3>2 — Withholding exemptions</h3><p>Optional; many filers leave it blank.</p></div>
        <div className="card"><h3>3 — Work classification</h3><p>The trade classification from the applicable wage determination (e.g. &ldquo;Electrician — Journeyman&rdquo;). A worker doing two trades in one week gets two rows.</p></div>
        <div className="card"><h3>4 — Hours worked each day</h3><p>The daily grid, split into overtime (top) and straight-time (bottom) rows. Daily entries must sum to column 5 — the most common arithmetic rejection.</p></div>
        <div className="card"><h3>5 — Total hours</h3><p>Weekly totals for the OT and straight-time rows.</p></div>
        <div className="card"><h3>6 — Rate of pay</h3><p>Base hourly rate, with fringe benefits shown as required (cash paid in lieu of fringes goes here as a rate addition). Overtime at no less than 1.5× the base rate.</p></div>
        <div className="card"><h3>7 — Gross amount earned</h3><p>Gross for this project; if the worker also worked private jobs that week, show project gross over total gross.</p></div>
        <div className="card"><h3>8 — Deductions</h3><p>Taxes and other permissible deductions; anything unusual must be explained.</p></div>
        <div className="card"><h3>9 — Net wages paid</h3><p>What the worker actually received for the week.</p></div>
      </div>

      <h2>Page 2 — the Statement of Compliance</h2>
      <p>
        An owner or officer signs certifying the payroll is correct and
        complete, workers were paid no less than the applicable prevailing
        wage, and fringe benefits were paid to plans or in cash (check
        paragraph 4(a) or 4(b) accordingly). This signature carries criminal
        exposure for willful falsification — which is exactly why the arithmetic
        on page 1 deserves more than a quick eyeball.
      </p>

      <h2>Deadlines</h2>
      <p>
        Weekly, delivered within seven days after the regular pay date for that
        payroll week — for every week your workers are on the covered project.
        California contractors also file electronically with the DIR — see the{" "}
        <Link href="/california-dir-ecpr">eCPR guide</Link>.
      </p>

      <div>
        <Link className="cta" href="/wh-347-generator">
          Fill it automatically — free
        </Link>
      </div>

      <footer>
        General information, not legal advice. The DOL&rsquo;s official WH-347
        instructions are the authoritative source.
      </footer>
    </main>
  );
}
