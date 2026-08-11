import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Certified Payroll in Texas: What Contractors Actually File",
  description:
    "Texas certified payroll explained: federal WH-347 on federally funded work, Texas Government Code 2258 on state and local public works, and who you actually submit to.",
  alternates: { canonical: "https://www.wh347form.com/certified-payroll-texas" },
};

export default function Page() {
  return (
    <main>
      <span className="badge">Texas guide</span>
      <h1>Certified payroll in Texas: what applies, and to whom you file</h1>
      <p className="lede">
        Texas has no statewide electronic filing portal like California&rsquo;s
        DIR — but that does not mean certified payroll is optional. What you
        file depends on who funds the job.
      </p>

      <h2>Federally funded projects: WH-347, weekly</h2>
      <p>
        Any Texas project with federal money covered by the Davis-Bacon Act
        (highways with federal aid, HUD-assisted housing, federal buildings)
        carries the standard federal requirement: weekly certified payroll on{" "}
        <Link href="/certified-payroll-report">form WH-347</Link> or its
        equivalent, submitted to the contracting agency within seven days of
        the pay date.
      </p>

      <h2>State and local public works: Government Code Chapter 2258</h2>
      <p>
        For state or locally funded public works, Texas Government Code Chapter
        2258 requires paying the prevailing wage rates adopted by the public
        body awarding the contract — and the public body enforces it, with
        penalties assessed per worker, per day for underpayment. Many Texas
        awarding bodies (cities, counties, school districts, universities)
        require certified payroll records as their evidence, and most accept or
        expect the WH-347 format even though the mandate is state-level. The
        submission goes to the awarding body itself, not to a state portal.
      </p>

      <h2>Practical upshot for Texas subs</h2>
      <p>
        You end up producing the same weekly artifact — a WH-347-format
        certified payroll — with the destination varying by project: federal
        agency, general contractor, or the city&rsquo;s compliance office. The{" "}
        <Link href="/wh-347-generator">free generator</Link> covers the form;
        the <Link href="/try">upload beta</Link> reads your payroll report and
        fills it for you.
      </p>

      <div>
        <Link className="cta" href="/wh-347-generator">
          Free WH-347 generator
        </Link>
        <Link className="cta secondary" href="/try">
          Try the upload beta
        </Link>
      </div>

      <footer>
        General information, not legal advice. Requirements are set by the
        contracting agency and Texas Government Code Chapter 2258 — confirm
        specifics in your contract documents.
      </footer>
    </main>
  );
}
