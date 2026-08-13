import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Certified Payroll from Gusto: WH-347 for Public Works Jobs",
  description:
    "Gusto runs your payroll but doesn't file certified payroll for you. How to turn Gusto payroll reports into a WH-347 and California eCPR XML in minutes, free.",
  alternates: { canonical: "https://www.wh347form.com/for/gusto" },
};

export default function Page() {
  return (
    <main>
      <span className="badge">For Gusto users</span>
      <h1>Running payroll in Gusto, but the job wants a WH-347?</h1>
      <p className="lede">
        Gusto is great at paying your crew. Certified payroll is a different
        artifact: a weekly, sworn wage report in the federal WH-347 format
        that government-funded projects require. If you&rsquo;ve just won your
        first public works contract, here is the missing piece.
      </p>

      <h2>What the project actually wants from you</h2>
      <p>
        Every week workers are on a covered job, the contracting agency (or
        your GC) expects the WH-347 grid — each worker&rsquo;s classification,
        daily hours, rate, gross, deductions — plus the signed Statement of
        Compliance.{" "}
        <Link href="/certified-payroll-report">Full explainer here.</Link>{" "}
        Miss weeks or file late and it&rsquo;s the kind of paperwork problem
        that holds up payment.
      </p>

      <h2>From Gusto report to filed form</h2>
      <p>
        Export the payroll journal or a payroll report covering the work week
        as a PDF, then upload it to the{" "}
        <Link href="/try">extraction beta</Link> — AI transcribes the worker
        rows into the official form, flags anything uncertain for your review,
        and hands off to the <Link href="/wh-347-generator">free
        generator</Link> for the download. Hours split into straight time and
        overtime after 40 automatically. Working a California public works
        job? The generator also produces the{" "}
        <Link href="/california-dir-ecpr">DIR eCPR</Link> XML for upload.
      </p>

      <h2>The two gotchas for Gusto-run crews</h2>
      <p>
        First, classifications: the form wants the wage-determination
        classification (&ldquo;Electrician — Journeyman&rdquo;), not the role
        name in your payroll system. Second, prevailing wage is base{" "}
        <em>plus fringe</em> — if you pay fringe in cash it belongs in the
        rate math, and if you pay into benefit plans it&rsquo;s credited
        separately. <Link href="/prevailing-wage-payroll">How base vs
        fringe works.</Link>
      </p>

      <div>
        <Link className="cta" href="/try">
          Upload a Gusto payroll PDF
        </Link>
        <Link className="cta secondary" href="/wh-347-generator">
          Or use the free generator
        </Link>
      </div>

      <footer>
        General information, not legal or tax advice. Gusto is a trademark of
        Gusto, Inc.; wh347form.com is not affiliated with or endorsed by
        Gusto.
      </footer>
    </main>
  );
}
