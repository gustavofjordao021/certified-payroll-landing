import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Is a Certified Payroll Report? (WH-347 Explained)",
  description:
    "Certified payroll reports explained: who must file form WH-347, what goes in each column, when it's due, and the fastest way to produce one every week.",
  alternates: { canonical: "https://www.wh347form.com/certified-payroll-report" },
};

export default function Page() {
  return (
    <main>
      <span className="badge">Plain-English explainer</span>
      <h1>What is a certified payroll report?</h1>
      <p className="lede">
        A certified payroll report is the weekly wage report contractors must
        file on government-funded construction projects to prove every worker
        was paid the legally required prevailing wage. On federal projects it is
        form <strong>WH-347</strong>, filed under the Davis-Bacon Act; many
        states require their own version on top.
      </p>

      <h2>Who has to file one</h2>
      <p>
        Every contractor and subcontractor on a federally funded or assisted
        construction contract covered by Davis-Bacon — generally contracts over
        $2,000 — files weekly, for each week workers are on the project. Many
        states (California, New York, Washington, and others) impose parallel
        requirements on state-funded public works, sometimes through their own
        portals and formats.
      </p>

      <h2>What goes in it</h2>
      <p>
        For each worker on the project that week: name and an identifying
        number, work classification (the trade, e.g. &ldquo;Electrician —
        Journeyman&rdquo;), hours worked <em>each day</em> with overtime broken
        out, the hourly rate of pay, gross earnings, deductions, net pay, and
        fringe benefit information. The second page is a signed Statement of
        Compliance — an officer certifies under penalty of law that the wages
        shown are true and meet the applicable wage determination.
      </p>

      <h2>When it is due</h2>
      <p>
        Weekly. On federal work the certified payroll must be delivered within
        seven days after the regular pay date for the payroll week. The
        obligation continues for every week of work on the project — and under
        several state regimes you must file even for weeks with no work
        performed.
      </p>

      <h2>Why it is painful</h2>
      <p>
        The data already exists in your payroll system — but WH-347 wants it
        re-arranged: hours per day (payroll registers usually show weekly
        totals), pay split by project and classification, and fringe benefits
        expressed against the wage determination. Most offices re-type it into a
        template every Friday.
      </p>

      <h2>Three ways to produce one</h2>
      <div className="grid">
        <div className="card">
          <h3>By hand</h3>
          <p>The blank WH-347 PDF or an Excel template, filled row by row. Free; slow; every typo is signed under penalty of perjury.</p>
        </div>
        <div className="card">
          <h3>Free generator</h3>
          <p>
            Our <Link href="/wh-347-generator">free WH-347 generator</Link> fills
            the form in your browser — no signup, nothing uploaded, overtime
            split automatically.
          </p>
        </div>
        <div className="card">
          <h3>Automated weekly</h3>
          <p>
            Upload the payroll report you already have; get back a checked
            WH-347 and state formats (California DIR eCPR XML first) every week.
            That is what we are building.
          </p>
        </div>
      </div>

      <div>
        <Link className="cta" href="/wh-347-generator">
          Generate a WH-347 free
        </Link>
        <a className="cta secondary" href="mailto:hello@wh347form.com?subject=Early access">
          Get early access
        </a>
      </div>

      <footer>
        General information, not legal advice. See the U.S. Department of
        Labor&rsquo;s WH-347 instructions for authoritative guidance.
      </footer>
    </main>
  );
}
