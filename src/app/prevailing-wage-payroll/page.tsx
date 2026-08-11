import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prevailing Wage Payroll: How It Actually Works",
  description:
    "Running payroll on a prevailing wage job: wage determinations, base rate vs fringe, overtime, cash-in-lieu, classification splits, and the weekly certified payroll it all feeds.",
  alternates: { canonical: "https://www.wh347form.com/prevailing-wage-payroll" },
};

export default function Page() {
  return (
    <main>
      <span className="badge">Payroll mechanics</span>
      <h1>Prevailing wage payroll, without the mystery</h1>
      <p className="lede">
        On a public works job you do not pick the wage — the wage determination
        does. Here is how that changes the payroll you run every week, and why
        the certified payroll report exists to prove you did it right.
      </p>

      <h2>The wage determination sets two numbers</h2>
      <p>
        For each work classification, the applicable determination lists a{" "}
        <strong>base hourly rate</strong> and a <strong>fringe benefit
        rate</strong>. You must deliver both: fringes as contributions to bona
        fide plans (health, pension, training), as cash added to the hourly
        rate, or a mix. Where payrolls go wrong: paying the base rate correctly
        but shorting the fringe, or paying cash-in-lieu without showing it as a
        rate addition.
      </p>

      <h2>Overtime has a trap in it</h2>
      <p>
        Overtime is at least 1.5&times; the <strong>base</strong> rate — fringe
        benefits generally do not get multiplied. Payroll systems that lump
        base and fringe into one rate quietly overpay OT, or worse, underpay it
        when configured backwards. Federal work uses over-40/week; several
        states (California among them) also require daily overtime after 8
        hours.
      </p>

      <h2>One worker, several rows</h2>
      <p>
        A worker who operates equipment in the morning and finishes concrete in
        the afternoon is two classifications with two rates — split by hours,
        on the same weekly report. Same for a worker split across a public and
        a private job: the certified payroll shows project hours and project
        gross against total gross.
      </p>

      <h2>Where it all lands: the weekly certified payroll</h2>
      <p>
        Every one of these rules surfaces on the{" "}
        <Link href="/certified-payroll-report">certified payroll report</Link>{" "}
        — daily hours, classification, rate, fringe, gross — signed under
        penalty of perjury. Our{" "}
        <Link href="/wh-347-generator">free WH-347 generator</Link> handles the
        overtime split; the <Link href="/try">upload beta</Link> reads the
        payroll report you already ran and checks the arithmetic before you
        sign.
      </p>

      <div>
        <Link className="cta" href="/try">
          Upload a payroll report (beta)
        </Link>
        <Link className="cta secondary" href="/wh-347-generator">
          Free WH-347 generator
        </Link>
      </div>

      <footer>
        General information, not legal advice. Wage determinations and overtime
        rules vary by project and state — always confirm against your contract
        documents.
      </footer>
    </main>
  );
}
