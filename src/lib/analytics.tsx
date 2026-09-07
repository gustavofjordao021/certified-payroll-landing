"use client";

import { inject, track as vercelTrack } from "@vercel/analytics";
import { getHomepagePositioningVariant } from "@/lib/experiments";
import type { InputType, PayrollProvider } from "@/lib/analytics-core";

type AnalyticsEventProperties = {
  landing_view: {
    page_path: string;
    referrer: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    experiment_variant?: string;
  };
  primary_cta_clicked: { page_path: string; cta_id: string };
  manual_generator_clicked: { page_path: string };
  sample_payroll_clicked: { page_path: string };
  try_page_viewed: { source_page: string };
  input_method_selected: { input_type: InputType; payroll_provider: PayrollProvider };
  file_selected: FileEventProperties;
  upload_started: FileEventProperties;
  upload_completed: FileEventProperties & { duration_ms: number };
  extraction_completed: InputContext & {
    workers_detected: number;
    fields_detected: number;
    warnings_detected: number;
    duration_ms: number;
  };
  extraction_failed: InputContext & {
    failure_stage: string;
    error_code: string;
    file_type: string;
  };
  review_screen_viewed: InputContext & {
    workers_detected: number;
    warnings_detected: number;
  };
  field_corrected: InputContext & { field_category: string };
  wh347_generated: { workers_count: number; warnings_remaining: number };
  wh347_downloaded: { workers_count: number };
  ecpr_xml_downloaded: { workers: number };
  early_access_clicked: { source: string };
  early_access_submitted: { source: string };
};

type InputContext = {
  input_type: InputType;
  payroll_provider: PayrollProvider;
};

type FileEventProperties = InputContext & {
  file_type: string;
  file_size_bucket: string;
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

const recentPageLoadEvents = new Map<string, number>();

export function trackOncePerPageLoad<Event extends "landing_view" | "try_page_viewed">(
  event: Event,
  pagePath: string,
  properties: AnalyticsEventProperties[Event],
) {
  const key = `${event}:${pagePath}`;
  const now = Date.now();
  const lastTrackedAt = recentPageLoadEvents.get(key);
  // React Strict Mode remounts effects immediately in development. Suppress
  // that duplicate while still counting a genuine return navigation later.
  if (lastTrackedAt && now - lastTrackedAt < 1_000) return;
  recentPageLoadEvents.set(key, now);
  track(event, properties);
}
