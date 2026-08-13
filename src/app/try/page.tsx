"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { VerifiedExtraction, VerifiedRow } from "@/engine/types";
import { track } from "@/lib/analytics";

// The product demo: upload a payroll PDF -> dual-model extraction -> verify
// screen. Rows where both models agree and checksums pass show green; anything
// uncertain is flagged for review. Nothing is ever silently guessed.
export default function TryPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifiedExtraction | null>(null);

  async function onFile(file: File, isSample = false) {
    setBusy(true);
    setError(null);
    setResult(null);
    track("extract_uploaded", { size_kb: Math.round(file.size / 1024), sample: isSample });
    try {
      const buf = await file.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i += 0x8000)
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      const pdfBase64 = btoa(binary);

      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pdfBase64 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `extraction failed (${res.status})`);
      const data = json.data as VerifiedExtraction;
      setResult(data);
      track("extract_completed", {
        rows: data.rows.length,
        review_rows: data.rows.filter((r) => r.status === "review").length,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function useInGenerator() {
    if (!result) return;
    localStorage.setItem("wh347_prefill", JSON.stringify(result.rows.map((r) => r.row)));
    track("extract_sent_to_generator", { rows: result.rows.length });
    router.push("/wh-347-generator");
  }

  return (
    <main>
      <span className="badge">Beta</span>
      <h1>Upload a payroll report. Watch it become a WH-347.</h1>
      <p className="lede">
        Drop in a payroll register, journal, or crew timesheet (PDF). Two
        independent AI reads extract every worker row; rows that agree and pass
        arithmetic checks are confirmed, anything uncertain is flagged for your
        review. Files are processed in memory and not stored.
      </p>

      <form className="gen" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>Payroll document (PDF, up to ~15&nbsp;MB)</legend>
          <input
            type="file"
            accept="application/pdf"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
          <p style={{ fontSize: "0.85rem", margin: "10px 0 0" }}>
            Not ready to upload your own payroll?{" "}
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                const blob = await fetch("/sample-payroll.pdf").then((r) => r.blob());
                void onFile(new File([blob], "sample-payroll.pdf", { type: "application/pdf" }), true);
              }}
              style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "inherit", textDecoration: "underline", cursor: "pointer" }}
            >
              run the sample crew timesheet
            </button>{" "}
            (synthetic data) and watch the verify screen work first.{" "}
            <a href="/sample-payroll.pdf" target="_blank" rel="noopener">See the sample PDF.</a>
          </p>
        </fieldset>
      </form>

      {busy && <p className="lede">Reading your document with two models&hellip; usually 10&ndash;30 seconds.</p>}
      {error && (
        <p className="lede" style={{ color: "#8a2f2f" }}>
          {error.includes("not configured")
            ? "The extraction service isn't switched on yet — we're in closed beta. Email hello@wh347form.com for access."
            : error}
        </p>
      )}

      {result && (
        <>
          <h2>
            {result.company ? `${result.company} — ` : ""}
            {result.rows.length} worker{result.rows.length === 1 ? "" : "s"} found
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.85rem", background: "#fff" }}>
              <thead>
                <tr>
                  {["", "Name", "Classification", "Daily (Mon–Sun)", "Reg", "OT", "Rate", "Gross", "Fringe"].map((h) => (
                    <th key={h} style={{ border: "1px solid var(--line)", padding: "6px 8px", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r: VerifiedRow, i) => (
                  <tr key={i} style={{ background: r.status === "confirmed" ? "#eef7ef" : "#fdf6e3" }}>
                    <td style={{ border: "1px solid var(--line)", padding: "6px 8px" }} title={[...r.disagreements.map((d) => `models disagree on ${d.field}`), ...r.checksumFailures].join("; ") || "confirmed by both models"}>
                      {r.status === "confirmed" ? "✓" : "review"}
                    </td>
                    <td style={{ border: "1px solid var(--line)", padding: "6px 8px" }}>{r.row.name}</td>
                    <td style={{ border: "1px solid var(--line)", padding: "6px 8px" }}>{r.row.classification ?? "—"}</td>
                    <td style={{ border: "1px solid var(--line)", padding: "6px 8px" }}>{r.row.daily_hours ? r.row.daily_hours.map((h) => h ?? 0).join(" ") : "weekly totals only"}</td>
                    <td style={{ border: "1px solid var(--line)", padding: "6px 8px" }}>{r.row.reg_hours ?? "—"}</td>
                    <td style={{ border: "1px solid var(--line)", padding: "6px 8px" }}>{r.row.ot_hours ?? "—"}</td>
                    <td style={{ border: "1px solid var(--line)", padding: "6px 8px" }}>{r.row.hourly_rate != null ? `$${r.row.hourly_rate.toFixed(2)}` : "—"}</td>
                    <td style={{ border: "1px solid var(--line)", padding: "6px 8px" }}>{r.row.gross_pay != null ? `$${r.row.gross_pay.toFixed(2)}` : "—"}</td>
                    <td style={{ border: "1px solid var(--line)", padding: "6px 8px" }}>{r.row.fringe_total != null ? `$${r.row.fringe_total.toFixed(2)}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.rows.some((r) => r.status === "review") && (
            <p className="lede" style={{ fontSize: "0.9rem" }}>
              Yellow rows: the two AI reads disagreed or an arithmetic check
              failed — hover the &ldquo;review&rdquo; cell to see why, and
              correct them in the generator before downloading.
            </p>
          )}
          <button className="cta" onClick={useInGenerator}>
            Open in the WH-347 generator →
          </button>
        </>
      )}

      <footer>
        Closed beta. Documents are processed transiently for extraction and not
        retained. Questions: hello@wh347form.com
      </footer>
    </main>
  );
}
