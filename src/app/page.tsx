import Link from "next/link";
import { vertical } from "@/verticals/certified-payroll";

export default function Home() {
  return (
    <main>
      <span className="badge">For subcontractors on public works jobs</span>
      <h1>
        Certified payroll, filed from the payroll you already ran.
      </h1>
      <p className="lede">{vertical.positioning}</p>
      <p className="lede">
        No re-typing hours. No switching payroll systems. We read the
        payroll report you already have — Gusto, ADP, QuickBooks, even a photo
        of the crew timesheet — checks the math, and hands you the finished
        filing.
      </p>
      <div>
        <Link className="cta" href="/wh-347-generator">
          Generate a free WH-347
        </Link>
        <a className="cta secondary" href="mailto:hello@wh347form.com?subject=Early access">
          Get early access
        </a>
      </div>

      <h2>How it works</h2>
      <div className="grid">
        <div className="card">
          <h3>1. Upload what you have</h3>
          <p>Payroll register, journal, or crew timesheet — PDF, export, or photo.</p>
        </div>
        <div className="card">
          <h3>2. We read and check it</h3>
          <p>
            Two independent AI reads plus arithmetic checks. Rows that match
            auto-fill; anything uncertain is flagged for a one-click confirm —
            nothing is ever silently guessed.
          </p>
        </div>
        <div className="card">
          <h3>3. Download the filing</h3>
          <p>
            WH-347 PDF ready to sign, and a California DIR eCPR XML you upload
            straight to the state portal. Every week, per project, with
            &ldquo;no work&rdquo; weeks handled.
          </p>
        </div>
      </div>

      <footer>
        WH347form.com — certified payroll automation. Free generator, no signup.
      </footer>
    </main>
  );
}
