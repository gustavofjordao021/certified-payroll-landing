import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "California DIR eCPR: How to Submit Certified Payroll (Contractor Guide)",
  description:
    "How California DIR certified payroll (eCPR) works for small contractors: PWCR registration, weekly filing, iForm vs XML upload, and no-work weeks — explained in plain English.",
  alternates: { canonical: "https://www.wh347form.com/california-dir-ecpr" },
};

export default function Page() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Do I have to file certified payroll in California for weeks with no work?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Yes. On California public works projects, a certified payroll report is due for each week of the project, including non-performance weeks where no work was performed.\"}}, {\"@type\": \"Question\", \"name\": \"What is the eCPR XML upload?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Instead of typing each worker into the DIR's web form, contractors can upload an XML file in the DIR's eCPR format covering the whole week's payroll for a project, submitted under their own DIR portal login.\"}}, {\"@type\": \"Question\", \"name\": \"Do I need to register with the DIR before working on public works?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Yes. An active Public Works Contractor Registration (PWCR) with the California DIR is required before bidding or working on covered public works projects.\"}}]}" }}
      />
      <span className="badge">California guide</span>
      <h1>California DIR certified payroll (eCPR), explained</h1>
      <p className="lede">
        If you work on a public works project in California, you file certified
        payroll with the Department of Industrial Relations — electronically,
        every week, for every project. Here is how the eCPR system actually
        works, in plain English.
      </p>

      <h2>Who has to file</h2>
      <p>
        Any contractor or subcontractor on a California public works project
        subject to prevailing wage. Before you can even bid or work, you need an
        active Public Works Contractor Registration (PWCR) with the DIR. Once
        you are on the job, certified payroll reports are due for each week a
        worker is employed on the project — <strong>including weeks where no
        work was performed</strong> (those are filed as &ldquo;non-performance&rdquo;
        payrolls).
      </p>

      <h2>The two ways to submit an eCPR</h2>
      <p>
        Submissions go through the DIR&rsquo;s online portal at
        services.dir.ca.gov/pw. You have two options:
      </p>
      <div className="grid">
        <div className="card">
          <h3>1. Manual iForm</h3>
          <p>
            Select your project, choose Submit → Manual, and type each
            employee&rsquo;s hours, classifications, rates, and deductions into
            the DIR&rsquo;s web form — every week, worker by worker. Fine for a
            two-person crew; painful beyond that.
          </p>
        </div>
        <div className="card">
          <h3>2. XML upload</h3>
          <p>
            Choose Submit → XML and upload a file in the DIR&rsquo;s eCPR XML
            format. One upload covers the whole week&rsquo;s payroll for the
            project. This is the route payroll tools use — you generate the XML
            once and submit it under your own DIR login.
          </p>
        </div>
      </div>

      <h2>What trips contractors up</h2>
      <p>
        The usual failure points: missing non-performance weeks (the filing
        requirement does not pause when the crew is elsewhere), wage
        classifications that do not match the applicable prevailing wage
        determination, fringe benefit amounts that fall short of the required
        rate, and overtime that is not split correctly after 8 hours per day or
        40 per week. Each of these is checkable before you submit — which is
        exactly what software should be doing for you.
      </p>

      <h2>The fast way</h2>
      <p>
        We are building exactly that: upload the payroll report you already have
        (Gusto, ADP, QuickBooks, or a crew timesheet), get back a checked WH-347
        PDF and a DIR-compatible eCPR XML you upload straight to the portal.
        Nothing is ever silently guessed — uncertain values are flagged for your
        confirmation before anything is filed.
      </p>
      <div>
        <Link className="cta" href="/wh-347-generator">
          Try the free WH-347 generator
        </Link>
        <Link className="cta secondary" href="/wh-347-generator">
          Download eCPR XML (beta) — in the generator
        </Link>
      </div>

      <footer>
        This guide is general information, not legal advice. Requirements are
        set by the California DIR — always confirm details for your project at
        dir.ca.gov.
      </footer>
    </main>
  );
}
