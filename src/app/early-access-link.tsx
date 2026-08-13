"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

// Early-access CTA: click expands to an inline email form; submit stores the
// address (Resend) and notifies us. Falls back to the mailto if the API
// isn't configured. Events: early_access_clicked (open), early_access_submitted.
export function EarlyAccessLink({ source, children, className }: { source: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "fallback" | "error">("idle");

  if (state === "done")
    return <span className={className} style={{ cursor: "default" }}>You&rsquo;re on the list ✓</span>;

  if (state === "fallback")
    return (
      <a className={className} href="mailto:hello@wh347form.com?subject=Early access">
        Email us for early access
      </a>
    );

  if (!open)
    return (
      <a
        className={className}
        href="#early-access"
        onClick={(e) => {
          e.preventDefault();
          track("early_access_clicked", { source });
          setOpen(true);
        }}
      >
        {children}
      </a>
    );

  return (
    <form
      style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", verticalAlign: "middle" }}
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy");
        try {
          const res = await fetch("/api/early-access", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email, source }),
          });
          if (res.ok) {
            track("early_access_submitted", { source });
            setState("done");
          } else if (res.status === 503) setState("fallback");
          else setState("error");
        } catch {
          setState("error");
        }
      }}
    >
      <input
        type="email"
        required
        autoFocus
        placeholder="you@company.com"
        value={email}
        disabled={state === "busy"}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "8px 10px", border: "1px solid var(--line, #ccc)", borderRadius: 6, minWidth: 200 }}
      />
      <button className={className ?? "cta"} type="submit" disabled={state === "busy"}>
        {state === "busy" ? "Adding…" : "Notify me"}
      </button>
      {state === "error" && (
        <span style={{ fontSize: "0.85rem", color: "#8a2f2f", alignSelf: "center" }}>
          Didn&rsquo;t work — try again?
        </span>
      )}
    </form>
  );
}
