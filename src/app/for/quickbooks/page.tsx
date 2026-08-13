import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Certified Payroll from QuickBooks: WH-347 Without Retyping",
  description:
    "How to turn a QuickBooks payroll report into a certified payroll WH-347 (and California eCPR XML) without retyping every worker row. Free generator, AI upload beta.",
  alternates: { canonical: "https://www.wh347form.com/for/quickbooks" },
};

export default function Page() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Does QuickBooks generate form WH-347?", acceptedAnswer: { "@type": "Answer", text: "QuickBooks Online has no built-in WH-347. Some QuickBooks Desktop payroll plans offer an Excel-based certified payroll report, but many contractors still end up transferring numbers onto the official federal form by hand." } },
            { "@type": "Question", name: "How do I create a WH-347 from QuickBooks Online?", acceptedAnswer: { "@type": "Answer", text: "Run a payroll report for the work week (payroll summary by employee or payroll details), save it as a PDF, and upload it to wh347form.com/try - AI reads the worker rows into the official WH-347. Or enter the hours directly in the free generator." } },
            { "@type": "Question", name: "Can I get California eCPR XML from QuickBooks data?", acceptedAnswer: { "@type": "Answer", text: "Yes. The free wh347form.com generator has a California DIR eCPR section that builds the upload-ready XML in your browser from the same weekly data." } }
          ]
        }) }}
      />

      <span className="badge">For QuickBooks users</span>
      <h1>Certified payroll from QuickBooks, without retyping the week</h1>
      <p className="lede">
        QuickBooks already knows every number a WH-347 needs — names,
        classifications, daily hours, rates, gross pay. What it doesn&rsquo;t
        reliably give you is the federal form itself. Here is the fastest
        honest path from a QuickBooks payroll report to a submitted filing.
      </p>

      <h2>What QuickBooks does and doesn&rsquo;t do</h2>
      <p>
        QuickBooks Online has no built-in WH-347. Certain QuickBooks Desktop
        payroll plans can produce an Excel-based certified payroll report, but
        plenty of contractors on government work still find themselves copying
        numbers into the official PDF every Friday — the DOL estimates that
        form at 55 minutes per submission.
      </p>

      <h2>The fast path: export, upload, review, download</h2>
      <p>
        Run your payroll report for the work week — a payroll summary by
        employee or payroll details report works — and save it as a PDF. Then:
      </p>
      <p>
        <strong>1.</strong> Upload the PDF to the{" "}
        <Link href="/try">extraction beta</Link>. Two independent AI reads
        pull every worker row; anything the two reads disagree on is flagged
        for your review instead of guessed.{" "}
        <strong>2.</strong> Confirm the flagged cells, then open the result in
        the <Link href="/wh-347-generator">free generator</Link>.{" "}
        <strong>3.</strong> Download the official WH-347 PDF — and, for
        California public works, the DIR eCPR XML from the same screen.
      </p>
      <p>
        Prefer to type? The generator works standalone: enter each
        worker&rsquo;s daily hours and rate, and it splits overtime after 40
        hours automatically. Free, no signup, and the form is built in your
        browser.
      </p>

      <h2>What to watch when converting QuickBooks data</h2>
      <p>
        Certified payroll wants <em>daily</em> hours per worker, work
        classifications that match the wage determination (not your internal
        job titles), and the base rate and fringe shown separately —{" "}
        <Link href="/prevailing-wage-payroll">base vs fringe matters</Link>.
        If your QuickBooks report only shows weekly totals, the filing still
        needs the daily grid, so pull the report that includes daily detail.
      </p>

      <div>
        <Link className="cta" href="/try">
          Upload a QuickBooks payroll PDF
        </Link>
        <Link className="cta secondary" href="/wh-347-generator">
          Or use the free generator
        </Link>
      </div>

      <footer>
        General information, not legal or tax advice. QuickBooks is a
        trademark of Intuit Inc.; wh347form.com is not affiliated with or
        endorsed by Intuit.
      </footer>
    </main>
  );
}
