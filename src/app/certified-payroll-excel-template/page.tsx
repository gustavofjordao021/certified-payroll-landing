import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Certified Payroll Excel Template vs. Free WH-347 Generator",
  description:
    "Looking for a certified payroll Excel template? Compare templates against a free browser-based WH-347 generator that splits overtime automatically — no signup, no purchase.",
  alternates: { canonical: "https://www.wh347form.com/certified-payroll-excel-template" },
};

export default function Page() {
  return (
    <main>
      <span className="badge">Template seekers, read this first</span>
      <h1>Certified payroll Excel template — or something better, free?</h1>
      <p className="lede">
        Most searches for a certified payroll Excel template end at a paid
        download: form-filler sites and marketplaces sell WH-347 spreadsheets
        with autofill formulas for $20–60. Before you buy a spreadsheet, know
        what it can and cannot do.
      </p>

      <h2>Where templates break</h2>
      <p>
        A WH-347 template reproduces the form&rsquo;s layout — but the form is
        the easy part. The mistakes that get certified payrolls rejected (or
        worse, investigated) are in the numbers: overtime not split after 40
        hours, daily hours that do not sum to the weekly total, fringe amounts
        below the wage determination, the wrong classification for the work
        performed. A spreadsheet happily accepts all of those errors, and the
        Statement of Compliance you sign under penalty of perjury does not care
        that the formula was off by one cell.
      </p>

      <h2>The free alternative</h2>
      <p>
        Our <Link href="/wh-347-generator">WH-347 generator</Link> does what the
        paid templates do — fill the federal form from your week&rsquo;s hours —
        free, in your browser, with nothing uploaded or stored. Enter daily
        hours per worker; the regular/overtime split at 40 hours and gross pay
        arithmetic happen automatically, and the Statement of Compliance page is
        generated with it.
      </p>

      <div className="grid">
        <div className="card">
          <h3>Paid Excel template</h3>
          <p>$20–60 one-time · autofill formulas · errors pass silently · you maintain it when the form revs</p>
        </div>
        <div className="card">
          <h3>Free generator (this site)</h3>
          <p>$0 · browser-only, no signup · OT split automatic · always the current form layout</p>
        </div>
        <div className="card">
          <h3>Automated weekly (coming)</h3>
          <p>Upload your payroll report · AI reads it, checks rates and fringe · WH-347 + California eCPR XML back in minutes</p>
        </div>
      </div>

      <div>
        <Link className="cta" href="/wh-347-generator">
          Use the free generator
        </Link>
        <a className="cta secondary" href="mailto:hello@wh347form.com?subject=Early access">
          Get early access to automation
        </a>
      </div>

      <footer>
        See also: <Link href="/certified-payroll-report">What is a certified payroll report?</Link> ·{" "}
        <Link href="/california-dir-ecpr">California DIR eCPR guide</Link>
      </footer>
    </main>
  );
}
