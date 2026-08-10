"use client";

import posthog from "posthog-js";
import { track as vercelTrack } from "@vercel/analytics";
import { useEffect } from "react";

// Public client token for the dedicated wh347form PostHog project.
// Empty string = analytics fully disabled (pre-launch state).
export const POSTHOG_KEY = "";
const POSTHOG_HOST = "https://us.i.posthog.com";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY || posthog.__loaded) return;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false, // explicit events only — keep the data model clean
      persistence: "localStorage",
    });
  }, []);
  return <>{children}</>;
}

export function track(event: string, properties?: Record<string, unknown>) {
  vercelTrack(event, properties as Record<string, string | number | boolean | null>);
  if (POSTHOG_KEY) posthog.capture(event, properties);
}
