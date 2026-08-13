import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "WH-347 Form (Rev. Jan 2025): Download the Official PDF Free",
  description:
    "Download the official DOL form WH-347 (Rev. January 2025) as a blank PDF, or fill it out free in your browser with automatic overtime splitting. No signup, no watermark, no pay-to-download.",
  alternates: { canonical: "https://www.wh347form.com/wh-347-form" },
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
            { "@type": "Question", name: "Where can I download form WH-347?", acceptedAnswer: { "@type": "Answer", text: "The official WH-347 (Rev. January 2025) is published by the U.S. Department of Labor. You can download the blank PDF free at wh347form.com/wh347-official.pdf or from dol.gov - no signup or payment is ever required for the form itself." } },
            { "@type": "Question", name: "Is there a free fillable WH-347?", acceptedAnswer: { "@type": "Answer", text: "Yes. The free generator at wh347form.com fills the official WH-347 in your browser - workers, daily hours, rates - with overtime after 40 hours split automatically. Nothing is uploaded or stored, and the download is free with no watermark." } },
            { "@type": "Question", name: "What is form WH-347 used for?", acceptedAnswer: { "@type": "Answer", text: "WH-347 is the federal certified payroll report. Contractors and subcontractors on Davis-Bacon covered government construction projects file it weekly to show each worker's classification, daily hours, pay rate, gross wages, deductions, and fringe benefits, with a signed Statement of Compliance." } }
          ]
        }) }}
      />

      <span className="badge">Official form</span>
      <h1>Form WH-347 — download the official PDF, or fill it free</h1>
      <p className="lede">
        WH-347 is the U.S. Department of Labor&rsquo;s certified payroll form
        (current revision: January 2025), required weekly from contractors on
        federally funded construction projects. The form itself is public and
        free — don&rsquo;t pay a form site to download it. Get the blank PDF
        below, or skip the typing and fill it in your browser.
      </p>

      <div>
        <Link className="cta" href="/wh-347-generator">
          Fill it out free online
        </Link>
        <a className="cta secondary" href="/wh347-official.pdf" download>
          Download the blank PDF
        </a>
      </div>

      <p style={{ marginTop: 24 }}>
        <Image src="/wh347-hero.png" alt="Form WH-347 (Rev. January 2025) filled in — federal certified payroll report" width={760} height={520} style={{ maxWidth: "100%", height: "auto", border: "1px solid var(--line, #ddd)", borderRadius: 8 }} />
      </p>

      <h2>What&rsquo;s on the form</h2>
      <p>
        Page one is the payroll grid: each worker&rsquo;s name and ID,
        classification, hours worked each day split into straight time and
        overtime, rate of pay, gross earned, deductions, and net paid. Page two
        is the Statement of Compliance — the sworn signature page. The DOL
        estimates 55 minutes per submission done by hand;{" "}
        <Link href="/how-to-fill-out-wh-347">
          here is every column explained
        </Link>
        , including where filings get rejected.
      </p>

      <h2>Filing basics</h2>
      <p>
        Due weekly, within seven days of the pay date, for every week workers
        are on a covered project —{" "}
        <Link href="/certified-payroll-report">
          the full certified payroll explainer
        </Link>
        . State regimes stack on top: California requires electronic filing
        with the DIR (<Link href="/california-dir-ecpr">eCPR</Link>), Texas
        enforces through the awarding body (
        <Link href="/certified-payroll-texas">Texas guide</Link>).
      </p>

      <h2>Skip the manual work</h2>
      <p>
        The <Link href="/wh-347-generator">free generator</Link> fills this
        exact form in your browser with the overtime split done for you — and
        the <Link href="/try">upload beta</Link> reads the payroll report you
        already have (QuickBooks, ADP, Gusto) and fills it from that.
      </p>

      <footer>
        Form WH-347 is published by the U.S. Department of Labor and is in the
        public domain. This site is not affiliated with the DOL. General
        information, not legal advice.
      </footer>
    </main>
  );
}
