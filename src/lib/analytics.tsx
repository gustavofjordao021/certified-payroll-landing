"use client";

import { inject, track as vercelTrack } from "@vercel/analytics";
import { getHomepagePositioningVariant } from "@/lib/experiments";

type AnalyticsEventProperties = {
  primary_cta_clicked: { cta_id: string };
  manual_generator_clicked: { source: string };
  input_method_selected: { method: string };
  extract_uploaded: { upload_context: string };
  extract_completed: { outcome: string };
  extract_failed: { failure: string };
  extract_sent_to_generator: { rows: number };
  field_corrected: { field_category: string };
  wh347_pdf_downloaded: { workers: number };
  ecpr_xml_downloaded: { workers: number };
  early_access_clicked: { source: string };
  early_access_submitted: { source: string };
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function track<Event extends keyof AnalyticsEventProperties>(
  event: Event,
  properties: AnalyticsEventProperties[Event],
) {
  // Mount effects in page components can run before the root Analytics
  // component initializes its queue. Inject is idempotent and guarantees
  // those first-load events are queued instead of dropped.
  if (typeof window !== "undefined") inject({ framework: "next" });
  const payload = {
    experiment_variant: getHomepagePositioningVariant(),
    ...properties,
  };
  vercelTrack(event, payload as Record<string, string | number | boolean | null>);

  // Makes the complete Vercel event payload inspectable in development.
  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent("wh347:analytics", { detail: { event, properties: payload } }));
}
