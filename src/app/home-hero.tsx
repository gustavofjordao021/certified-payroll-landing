"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { track, trackOncePerPageLoad } from "@/lib/analytics";
import {
  getHomepagePositioningVariant,
  type HomepagePositioningVariant,
} from "@/lib/experiments";
import { vertical } from "@/verticals/certified-payroll";

export function HomeHero() {
  const [variant, setVariant] = useState<HomepagePositioningVariant>("control");

  useEffect(() => {
    const assigned = getHomepagePositioningVariant();
    setVariant(assigned);
    const params = new URLSearchParams(window.location.search);
    trackOncePerPageLoad("landing_view", window.location.pathname, {
      page_path: window.location.pathname,
      experiment_variant: assigned,
      referrer: document.referrer ? new URL(document.referrer).hostname : "direct",
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    });
  }, []);

  const reviewFirst = variant === "review_first";
  const primaryHref = reviewFirst ? "/try?source=homepage" : "/wh-347-generator";
  const primaryLabel = reviewFirst ? "Check my payroll" : "Generate a free WH-347";

  function trackPrimary() {
    track("primary_cta_clicked", {
      page_path: "/",
      cta_id: reviewFirst ? "hero_check_payroll" : "hero_manual_generator",
    });
    if (!reviewFirst)
      track("manual_generator_clicked", { page_path: "/" });
  }

  return (
    <div className="hero">
      <div className="hero-copy">
        <span className="badge">For subcontractors on public works jobs</span>
        <h1>
          {reviewFirst
            ? "Check your certified payroll before you submit it."
            : "Certified payroll, filed from the payroll you already ran."}
        </h1>
        <p className="lede">
          {reviewFirst
            ? "Upload the payroll you already ran in ADP, QuickBooks, Gusto, Excel, PDF, or a photo. We extract the payroll, show anything that needs your review, and prepare your WH-347."
            : vertical.positioning}
        </p>
        <div className="chips">
          <span className="chip">100% free</span>
          <span className="chip">No signup</span>
          <span className="chip">Official DOL form — Rev. Jan 2025</span>
        </div>
        <div>
          <Link className="cta" href={primaryHref} onClick={trackPrimary}>
            {primaryLabel}
          </Link>
          {reviewFirst ? (
            <Link
              className="cta secondary"
              href="/wh-347-generator"
              onClick={() => track("manual_generator_clicked", { page_path: "/" })}
            >
              Enter it manually instead
            </Link>
          ) : (
            <Link
              className="cta secondary"
              href="/try?source=homepage"
              onClick={() =>
                track("primary_cta_clicked", {
                  page_path: "/",
                  cta_id: "hero_upload_payroll",
                })
              }
            >
              Upload payroll instead
            </Link>
          )}
        </div>
        <p className="privacy-note">
          Uploaded files are processed to extract payroll data and are not retained after processing.
        </p>
        <div className="statebar">
          <span>Covers:</span>
          <span className="statechip">Federal WH-347</span>
          <Link className="statechip" href="/california-dir-ecpr">California eCPR</Link>
          <Link className="statechip" href="/certified-payroll-texas">Texas</Link>
        </div>
      </div>
      <Link
        href="/wh-347-generator"
        className="form-card"
        aria-label="Example of a filled WH-347 form"
        onClick={() => track("manual_generator_clicked", { page_path: "/" })}
      >
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
  );
}
