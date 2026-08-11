"use client";

import { useEffect, useState } from "react";
import { renderPayrollReport } from "@/engine/render/payroll-report";
import type { EmployeeRow } from "@/engine/types";
import { track } from "@/lib/analytics";

// Free WH-347 generator — the funnel lead magnet ("wh 347 form": 1,300
// searches/mo). Fully client-side: no signup, no upload, nothing leaves the
// browser. The paid product is this, automated weekly from an uploaded
// payroll report.
const emptyEmp = () => ({ name: "", classification: "", daily: ["", "", "", "", "", "", ""], rate: "", fringe: "" });

export default function Generator() {
  const [meta, setMeta] = useState({ contractor: "", address: "", projectName: "", projectLocation: "", payrollNumber: "1", weekEnding: "" });
  const [emps, setEmps] = useState([emptyEmp()]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wh347_prefill");
      if (!raw) return;
      localStorage.removeItem("wh347_prefill");
      const rows = JSON.parse(raw) as EmployeeRow[];
      if (!Array.isArray(rows) || !rows.length) return;
      setEmps(rows.map((r) => ({
        name: r.name ?? "",
        classification: r.classification ?? "",
        daily: (r.daily_hours ?? Array(7).fill(null)).map((h) => (h ? String(h) : "")),
        rate: r.hourly_rate != null ? String(r.hourly_rate) : "",
        fringe: r.fringe_total != null ? String(r.fringe_total) : "",
      })));
    } catch {}
  }, []);

  async function generate() {
    setBusy(true);
    try {
      const rows: EmployeeRow[] = emps
        .filter((e) => e.name.trim())
        .map((e) => {
          const daily = e.daily.map((d) => (d === "" ? 0 : Number(d) || 0));
          const total = daily.reduce((a, b) => a + b, 0);
          const reg = Math.min(total, 40);
          const ot = Math.max(0, total - 40);
          const rate = Number(e.rate) || 0;
          return {
            name: e.name,
            classification: e.classification || null,
            daily_hours: daily,
            reg_hours: reg,
            ot_hours: ot,
            hourly_rate: rate || null,
            gross_pay: rate ? +(reg * rate + ot * rate * 1.5).toFixed(2) : null,
            fringe_total: e.fringe ? Number(e.fringe) : null,
          };
        });
      const bytes = await renderPayrollReport(meta, rows);
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `wh347-payroll-${meta.payrollNumber || "1"}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
      track("wh347_pdf_downloaded", { workers: rows.length });
    } finally {
      setBusy(false);
    }
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <main>
      <h1>Free WH-347 certified payroll generator</h1>
      <p className="lede">
        Fill in the week, download the PDF. Runs entirely in your browser —
        nothing is uploaded or stored. Overtime after 40 hours is split
        automatically.
      </p>
      <form
        className="gen"
        onSubmit={(e) => {
          e.preventDefault();
          void generate();
        }}
      >
        <fieldset>
          <legend>Project</legend>
          <div className="row">
            <input required placeholder="Contractor name" value={meta.contractor} onChange={(e) => setMeta({ ...meta, contractor: e.target.value })} />
            <input placeholder="Address" value={meta.address} onChange={(e) => setMeta({ ...meta, address: e.target.value })} />
          </div>
          <div className="row">
            <input required placeholder="Project name" value={meta.projectName} onChange={(e) => setMeta({ ...meta, projectName: e.target.value })} />
            <input placeholder="Project location" value={meta.projectLocation} onChange={(e) => setMeta({ ...meta, projectLocation: e.target.value })} />
            <input placeholder="Payroll #" value={meta.payrollNumber} onChange={(e) => setMeta({ ...meta, payrollNumber: e.target.value })} />
            <input required type="date" value={meta.weekEnding} onChange={(e) => setMeta({ ...meta, weekEnding: e.target.value })} />
          </div>
        </fieldset>

        {emps.map((emp, i) => (
          <fieldset key={i}>
            <legend>Worker {i + 1}</legend>
            <div className="row">
              <input placeholder="Full name" value={emp.name} onChange={(e) => setEmps(emps.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
              <input placeholder="Work classification (e.g. Electrician - Journeyman)" value={emp.classification} onChange={(e) => setEmps(emps.map((x, j) => (j === i ? { ...x, classification: e.target.value } : x)))} />
            </div>
            <div className="row">
              {days.map((d, di) => (
                <input key={d} placeholder={d} inputMode="decimal" value={emp.daily[di]} onChange={(e) => setEmps(emps.map((x, j) => (j === i ? { ...x, daily: x.daily.map((v, k) => (k === di ? e.target.value : v)) } : x)))} />
              ))}
            </div>
            <div className="row">
              <input placeholder="Base hourly rate ($)" inputMode="decimal" value={emp.rate} onChange={(e) => setEmps(emps.map((x, j) => (j === i ? { ...x, rate: e.target.value } : x)))} />
              <input placeholder="Fringe total ($, optional)" inputMode="decimal" value={emp.fringe} onChange={(e) => setEmps(emps.map((x, j) => (j === i ? { ...x, fringe: e.target.value } : x)))} />
            </div>
          </fieldset>
        ))}

        <div>
          <button type="button" className="cta secondary" style={{ marginLeft: 0 }} onClick={() => setEmps([...emps, emptyEmp()])}>
            + Add worker
          </button>
          <button className="cta" style={{ marginLeft: 12 }} disabled={busy}>
            {busy ? "Generating…" : "Download WH-347 PDF"}
          </button>
        </div>
      </form>
      <footer>
        Want this filled automatically from your payroll report every week —
        plus the California DIR eCPR XML? <a href="mailto:hello@wh347form.com?subject=Early access" onClick={() => track("early_access_clicked", { source: "generator" })}>Get early access.</a>
      </footer>
    </main>
  );
}
