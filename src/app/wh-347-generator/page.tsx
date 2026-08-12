"use client";

import { useEffect, useState } from "react";
import { renderOfficialWH347 } from "@/engine/render/wh347-official";
import { serializeEcpr, ecprEmployeeFromRow } from "@/engine/serialize/ecpr-xml";
import type { EmployeeRow } from "@/engine/types";
import { formWorkersToRows } from "@/lib/form-to-rows";
import { track } from "@/lib/analytics";

// Free WH-347 generator — the funnel lead magnet ("wh 347 form": 1,300
// searches/mo). Fully client-side: no signup, no upload, nothing leaves the
// browser. The paid product is this, automated weekly from an uploaded
// payroll report.
const emptyEmp = () => ({
  name: "", classification: "", daily: ["", "", "", "", "", "", ""], rate: "", fringe: "",
  // California eCPR extras (only used when the CA toggle is on)
  ssn: "", street: "", city: "", stateCode: "CA", zip: "",
});
type Emp = ReturnType<typeof emptyEmp>;

const emptyCa = () => ({
  projectID: "", licenseType: "CSLB" as "CSLB" | "PL" | "OTHER", licenseNum: "",
  pwcr: "", fein: "", email: "", insuranceNum: "",
  street: "", city: "", stateCode: "CA", zip: "",
});

export default function Generator() {
  const [meta, setMeta] = useState({ contractor: "", address: "", projectName: "", projectLocation: "", payrollNumber: "1", weekEnding: "" });
  const [emps, setEmps] = useState<Emp[]>([emptyEmp()]);
  const [busy, setBusy] = useState(false);
  const [caOpen, setCaOpen] = useState(false);
  const [ca, setCa] = useState(emptyCa());
  const [xmlError, setXmlError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wh347_prefill");
      if (!raw) return;
      localStorage.removeItem("wh347_prefill");
      const rows = JSON.parse(raw) as EmployeeRow[];
      if (!Array.isArray(rows) || !rows.length) return;
      setEmps(rows.map((r) => ({
        ...emptyEmp(),
        name: r.name ?? "",
        classification: r.classification ?? "",
        daily: (r.daily_hours ?? Array(7).fill(null)).map((h) => (h ? String(h) : "")),
        rate: r.hourly_rate != null ? String(r.hourly_rate) : "",
        fringe: r.fringe_total != null ? String(r.fringe_total) : "",
      })));
    } catch {}
  }, []);

  const setEmp = (i: number, patch: Partial<Emp>) =>
    setEmps(emps.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  async function generate() {
    setBusy(true);
    try {
      const rows = formWorkersToRows(emps);
      const template = await fetch("/wh347-official.pdf").then((r) => r.arrayBuffer());
      const bytes = await renderOfficialWH347(template, meta, rows);
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

  function downloadXml() {
    setXmlError(null);
    try {
      const named = emps.filter((e) => e.name.trim());
      const rows = formWorkersToRows(emps);
      const employees = rows.map((r, i) =>
        ecprEmployeeFromRow(
          r,
          { ssn: named[i].ssn, address: { street: named[i].street, city: named[i].city, state: named[i].stateCode, zip: named[i].zip } },
          meta.weekEnding,
        ),
      );
      const xml = serializeEcpr({
        contractor: {
          name: meta.contractor,
          licenseType: ca.licenseType,
          licenseNum: ca.licenseNum,
          pwcr: ca.pwcr,
          fein: ca.fein,
          address: { street: ca.street, city: ca.city, state: ca.stateCode, zip: ca.zip },
          insuranceNum: ca.insuranceNum,
          email: ca.email,
        },
        project: { projectID: ca.projectID, projectName: meta.projectName },
        forWeekEnding: meta.weekEnding,
        statementOfNP: employees.length === 0,
        employees,
      });
      const blob = new Blob([xml], { type: "application/xml" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `ecpr-${meta.weekEnding || "payroll"}.xml`;
      a.click();
      URL.revokeObjectURL(a.href);
      track("ecpr_xml_downloaded", { workers: employees.length });
    } catch (e) {
      setXmlError(e instanceof Error ? e.message : "Could not build the eCPR XML");
    }
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <main>
      <h1>Free WH-347 certified payroll generator</h1>
      <p className="lede">
        Fill in the week, download the PDF. Runs entirely in your browser —
        nothing is uploaded or stored. Overtime after 40 hours is split
        automatically. Working a California public-works job? Toggle on the
        DIR eCPR section to also download the upload-ready XML.
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

        <fieldset>
          <legend>
            <label style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={caOpen} onChange={(e) => setCaOpen(e.target.checked)} style={{ marginRight: 6 }} />
              California DIR eCPR XML (beta)
            </label>
          </legend>
          {caOpen && (
            <>
              <p style={{ fontSize: "0.85rem", margin: "4px 0 10px", color: "#555" }}>
                DIR&rsquo;s electronic submission needs a few fields the WH-347
                doesn&rsquo;t: your PWCR, license, FEIN, and each worker&rsquo;s
                SSN and address. Everything stays in your browser — the XML is
                built locally and downloaded, never uploaded.
              </p>
              <div className="row">
                <input required={caOpen} placeholder="DIR Project ID" value={ca.projectID} onChange={(e) => setCa({ ...ca, projectID: e.target.value })} />
                <select value={ca.licenseType} onChange={(e) => setCa({ ...ca, licenseType: e.target.value as typeof ca.licenseType })}>
                  <option value="CSLB">CSLB license</option>
                  <option value="PL">PL license</option>
                  <option value="OTHER">Other license</option>
                </select>
                <input placeholder="License number" value={ca.licenseNum} onChange={(e) => setCa({ ...ca, licenseNum: e.target.value })} />
              </div>
              <div className="row">
                <input placeholder="PWCR registration #" value={ca.pwcr} onChange={(e) => setCa({ ...ca, pwcr: e.target.value })} />
                <input placeholder="FEIN" value={ca.fein} onChange={(e) => setCa({ ...ca, fein: e.target.value })} />
                <input placeholder="Workers' comp insurance #" value={ca.insuranceNum} onChange={(e) => setCa({ ...ca, insuranceNum: e.target.value })} />
                <input placeholder="Contractor email" type="email" value={ca.email} onChange={(e) => setCa({ ...ca, email: e.target.value })} />
              </div>
              <div className="row">
                <input placeholder="Business street" value={ca.street} onChange={(e) => setCa({ ...ca, street: e.target.value })} />
                <input placeholder="City" value={ca.city} onChange={(e) => setCa({ ...ca, city: e.target.value })} />
                <input placeholder="State" style={{ maxWidth: 70 }} value={ca.stateCode} onChange={(e) => setCa({ ...ca, stateCode: e.target.value })} />
                <input placeholder="ZIP" style={{ maxWidth: 100 }} value={ca.zip} onChange={(e) => setCa({ ...ca, zip: e.target.value })} />
              </div>
            </>
          )}
        </fieldset>

        {emps.map((emp, i) => (
          <fieldset key={i}>
            <legend>Worker {i + 1}</legend>
            <div className="row">
              <input placeholder="Full name" value={emp.name} onChange={(e) => setEmp(i, { name: e.target.value })} />
              <input placeholder="Work classification (e.g. Electrician - Journeyman)" value={emp.classification} onChange={(e) => setEmp(i, { classification: e.target.value })} />
            </div>
            <div className="row">
              {days.map((d, di) => (
                <input key={d} placeholder={d} inputMode="decimal" value={emp.daily[di]} onChange={(e) => setEmp(i, { daily: emp.daily.map((v, k) => (k === di ? e.target.value : v)) })} />
              ))}
            </div>
            <div className="row">
              <input placeholder="Base hourly rate ($)" inputMode="decimal" value={emp.rate} onChange={(e) => setEmp(i, { rate: e.target.value })} />
              <input placeholder="Fringe total ($, optional)" inputMode="decimal" value={emp.fringe} onChange={(e) => setEmp(i, { fringe: e.target.value })} />
            </div>
            {caOpen && (
              <div className="row">
                <input placeholder="SSN (eCPR only)" value={emp.ssn} onChange={(e) => setEmp(i, { ssn: e.target.value })} />
                <input placeholder="Home street" value={emp.street} onChange={(e) => setEmp(i, { street: e.target.value })} />
                <input placeholder="City" value={emp.city} onChange={(e) => setEmp(i, { city: e.target.value })} />
                <input placeholder="State" style={{ maxWidth: 70 }} value={emp.stateCode} onChange={(e) => setEmp(i, { stateCode: e.target.value })} />
                <input placeholder="ZIP" style={{ maxWidth: 100 }} value={emp.zip} onChange={(e) => setEmp(i, { zip: e.target.value })} />
              </div>
            )}
          </fieldset>
        ))}

        <div>
          <button type="button" className="cta secondary" style={{ marginLeft: 0 }} onClick={() => setEmps([...emps, emptyEmp()])}>
            + Add worker
          </button>
          <button className="cta" style={{ marginLeft: 12 }} disabled={busy}>
            {busy ? "Generating…" : "Download WH-347 PDF"}
          </button>
          {caOpen && (
            <button type="button" className="cta secondary" style={{ marginLeft: 12 }} onClick={downloadXml}>
              Download eCPR XML
            </button>
          )}
        </div>
        {xmlError && (
          <p style={{ color: "#8a2f2f", fontSize: "0.9rem" }}>eCPR XML: {xmlError}</p>
        )}
      </form>
      <footer>
        Want this filled automatically from your payroll report every week?{" "}
        <a href="mailto:hello@wh347form.com?subject=Early access" onClick={() => track("early_access_clicked", { source: "generator" })}>Get early access.</a>
      </footer>
    </main>
  );
}
