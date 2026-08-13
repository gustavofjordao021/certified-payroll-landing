import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Certified Payroll from ADP Reports: WH-347 the Fast Way",
  description:
    "Turn an ADP payroll register into a certified payroll WH-347 and California eCPR XML without retyping worker rows. Free generator plus AI upload beta.",
  alternates: { canonical: "https://www.wh347form.com/for/adp" },
};

export default function Page() {
  return (
    <main>
      <span className="badge">For ADP users</span>
      <h1>From an ADP payroll register to a filed WH-347</h1>
      <p className="lede">
        Depending on which ADP product and tier you run, certified payroll
        reporting may be an add-on, a professional-services request, or simply
        not included. If your Friday reality is copying numbers from an ADP
        register into the federal form, this page is for you.
      </p>

      <h2>The weekly loop, shortened</h2>
      <p>
        Download the payroll register (or wage detail report) for the work
        week as a PDF, then upload it to the{" "}
        <Link href="/try">extraction beta</Link>. Two independent AI reads
        transcribe every worker row — daily hours, rate, gross, fringe — and
        cross-check each other plus the arithmetic. Rows that agree are
        confirmed; anything uncertain is flagged for you to verify, never
        silently guessed. One click sends the result into the{" "}
        <Link href="/wh-347-generator">free WH-347 generator</Link>, where you
        download the official form — and California&rsquo;s DIR eCPR XML if
        the job needs it.
      </p>

      <h2>Why not just submit the ADP report?</h2>
      <p>
        Agencies want the certified payroll format: the WH-347 grid (or its
        exact equivalent) plus the signed Statement of Compliance. A payroll
        register proves what you paid, but it isn&rsquo;t the sworn weekly
        filing the Davis-Bacon Act requires —{" "}
        <Link href="/certified-payroll-report">
          what a certified payroll report actually is
        </Link>
        . The register is the raw material; the WH-347 is the deliverable.
      </p>

      <h2>Things ADP data gets you 90% of the way on</h2>
      <p>
        Daily hours and rates come straight across. What usually needs your
        judgment: work classifications must match the project&rsquo;s wage
        determination rather than ADP&rsquo;s job codes, and prevailing-wage
        fringe must be shown against the determination&rsquo;s fringe rate —{" "}
        <Link href="/prevailing-wage-payroll">base vs fringe explained</Link>.
      </p>

      <div>
        <Link className="cta" href="/try">
          Upload an ADP payroll PDF
        </Link>
        <Link className="cta secondary" href="/wh-347-generator">
          Or use the free generator
        </Link>
      </div>

      <footer>
        General information, not legal or tax advice. ADP is a trademark of
        ADP, Inc.; wh347form.com is not affiliated with or endorsed by ADP.
      </footer>
    </main>
  );
}
