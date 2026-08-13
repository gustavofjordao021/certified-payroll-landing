import Link from "next/link";
import Image from "next/image";
import { vertical } from "@/verticals/certified-payroll";
import { EarlyAccessLink } from "./early-access-link";

export default function Home() {
  return (
    <main className="wide">
      <div className="hero">
        <div className="hero-copy">
          <span className="badge">For subcontractors on public works jobs</span>
          <h1>Certified payroll, filed from the payroll you already ran.</h1>
          <p className="lede">{vertical.positioning}</p>
          <div className="chips">
            <span className="chip">100% free</span>
            <span className="chip">No signup</span>
            <span className="chip">Nothing leaves your browser</span>
            <span className="chip">Official DOL form — Rev. Jan 2025</span>
          </div>
          <div>
            <Link className="cta" href="/wh-347-generator">
              Generate a free WH-347
            </Link>
            <Link className="cta secondary" href="/try">
              Upload payroll instead
            </Link>
          </div>
          <div className="statebar">
            <span>Covers:</span>
            <span className="statechip">Federal WH-347</span>
            <Link className="statechip" href="/california-dir-ecpr">California eCPR</Link>
            <Link className="statechip" href="/certified-payroll-texas">Texas</Link>
          </div>
        </div>
        <Link href="/wh-347-generator" className="form-card" aria-label="Example of a filled WH-347 form">
          <Image
            src="/wh347-hero.png"
            alt="Official DOL WH-347 certified payroll form, filled automatically"
            width={1320}
            height={1020}
            priority
          />
          <span className="form-card-caption">The actual DOL form, filled for you</span>
        </Link>
      </div>

      <div className="statstrip">
        <div>
          <strong>55 minutes</strong>
          <span>DOL&rsquo;s own time estimate per WH-347 (printed on the form)</span>
        </div>
        <div>
          <strong>~2 minutes</strong>
          <span>with the free generator — overtime split automatically</span>
        </div>
        <div>
          <strong>Every week</strong>
          <span>per project, signed under penalty of perjury — worth getting right</span>
        </div>
      </div>

      <h2>How it works</h2>
      <div className="grid">
        <div className="card">
          <h3>1. Upload what you have</h3>
          <p>Payroll register, journal, or crew timesheet — PDF, export, or photo.</p>
        </div>
        <div className="card">
          <h3>2. We read and check it (<Link href="/try">try the beta</Link>)</h3>
          <p>
            Two independent AI reads plus arithmetic checks. Rows that match
            auto-fill; anything uncertain is flagged for a one-click confirm —
            nothing is ever silently guessed.
          </p>
        </div>
        <div className="card">
          <h3>3. Download the filing</h3>
          <p>
            The official WH-347 PDF ready to sign — free, today. California
            DIR eCPR XML export is live in beta inside the free generator.
          </p>
        </div>
      </div>

      <h2>Guides</h2>
      <div className="grid">
        <div className="card">
          <h3><Link href="/wh-347-form">The WH-347 form (official PDF)</Link></h3>
          <p>Download the blank Rev. Jan 2025 form free, or fill it online.</p>
        </div>
        <div className="card">
          <h3><Link href="/certified-payroll-report">What is a certified payroll report?</Link></h3>
          <p>WH-347 explained: who files, what goes in it, and when it&rsquo;s due.</p>
        </div>
        <div className="card">
          <h3><Link href="/california-dir-ecpr">California DIR eCPR guide</Link></h3>
          <p>PWCR, weekly filings, no-work weeks, and iForm vs XML upload.</p>
        </div>
        <div className="card">
          <h3><Link href="/how-to-fill-out-wh-347">How to fill out WH-347</Link></h3>
          <p>Every column explained, and where filings get rejected.</p>
        </div>
        <div className="card">
          <h3><Link href="/certified-payroll-excel-template">Excel template vs generator</Link></h3>
          <p>Why paid WH-347 spreadsheets exist and the free alternative.</p>
        </div>
        <div className="card">
          <h3><Link href="/prevailing-wage-payroll">Prevailing wage payroll</Link></h3>
          <p>Base vs fringe, the overtime trap, and classification splits.</p>
        </div>
        <div className="card">
          <h3><Link href="/certified-payroll-texas">Certified payroll in Texas</Link></h3>
          <p>Federal WH-347 vs Government Code 2258, and who you file with.</p>
        </div>
        <div className="card">
          <h3><Link href="/for/quickbooks">Certified payroll from QuickBooks</Link></h3>
          <p>Export the report you already run; skip the Friday retyping.</p>
        </div>
        <div className="card">
          <h3><Link href="/for/adp">From ADP registers to WH-347</Link></h3>
          <p>Payroll register in, official form (and eCPR XML) out.</p>
        </div>
        <div className="card">
          <h3><Link href="/for/gusto">Gusto users: your first public works job</Link></h3>
          <p>What the agency wants that Gusto doesn&rsquo;t produce.</p>
        </div>
        <div className="card">
          <h3><Link href="/lcptracker-alternatives">LCPtracker alternatives</Link></h3>
          <p>What you can actually replace when the portal is mandated.</p>
        </div>
      </div>

      <div className="closer">
        <h2>This Friday&rsquo;s payroll is already due next week.</h2>
        <div>
          <Link className="cta" href="/wh-347-generator">
            Generate a free WH-347
          </Link>
          <EarlyAccessLink className="cta secondary" source="landing">
            Get early access to weekly automation
          </EarlyAccessLink>
        </div>
      </div>

      <footer>
        WH347form.com — certified payroll automation. Free generator, no signup.
      </footer>
    </main>
  );
}
