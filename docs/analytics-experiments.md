# Analytics and experiment instrumentation

The application uses the existing Vercel Web Analytics integration as its only analytics destination. No payroll contents, names, employee identifiers, filenames, wage values, or exact file sizes are included in event payloads. Custom events retain the repository's original names and low-volume conversion-event pattern.

## Experiment configuration

Experiment flags and variants live in `src/lib/experiments.ts`.

- `homepagePositioning`: enabled, with `control` and `review_first` variants.
- `pricingIntent`: disabled until baseline traffic and downstream events are verified in development or staging.

The trust/sample CTA, post-extraction review-value treatment, pricing-intent UI, and segment survey remain gated by the brief's requirement to verify the complete baseline event chain first. For local OIDC authentication, link the Vercel project and run `vercel env pull .env.local` to obtain a temporary `VERCEL_OIDC_TOKEN`. Do not enable later experiments until a successful extraction-to-download journey has been confirmed in development or staging.

Homepage positioning is assigned randomly once per browser session and stored in `sessionStorage`. The stored variant is included automatically on every explicit event as `experiment_variant`. If storage or configuration fails, the control variant is used.

## Events

Vercel automatically records page views for `/`, `/try`, and the generator. Explicit events are reserved for user actions and outcomes:

| Event | Event-specific property | Automatic property |
|---|---|---|
| `primary_cta_clicked` | `cta_id` | `experiment_variant` |
| `manual_generator_clicked` | `source` | `experiment_variant` |
| `input_method_selected` | `method` (`provider:input_type`) | `experiment_variant` |
| `extract_uploaded` | `upload_context` (`sample_or_real:file_type:size_bucket:input_type:provider`) | `experiment_variant` |
| `extract_completed` | `outcome` (`workers:fields:warnings:duration`) | `experiment_variant` |
| `extract_failed` | `failure` (`stage:error_code`) | `experiment_variant` |
| `extract_sent_to_generator` | `rows` | `experiment_variant` |
| `field_corrected` | `field_category` | `experiment_variant` |
| `wh347_pdf_downloaded` | `workers` | `experiment_variant` |

Existing early-access and California eCPR events also flow only to Vercel Analytics.

## Development verification

In non-production builds, every Vercel event is mirrored to a browser-only `wh347:analytics` custom event. This does not send data to another service. It makes the complete payload inspectable while testing:

```js
window.addEventListener("wh347:analytics", (event) => console.log(event.detail))
```

Verify the baseline journey in development or staging:

1. Load `/` and confirm Vercel's built-in page view plus a stable session variant on subsequent custom events.
2. Click the relevant hero CTA and confirm `primary_cta_clicked`; confirm the manual event when the generator route is selected.
3. On `/try`, select an input method and choose a PDF. Confirm the upload context contains a size bucket and never a filename.
4. Complete one successful sample journey and one forced failure. Confirm `extract_completed` and `extract_failed` contain only compact non-sensitive summaries.
5. Continue into the generator, edit one extracted field, and download. Confirm one correction event per field category followed by the original `wh347_pdf_downloaded` event.

Use Vercel's built-in page views and the compact conversion events together to calculate the funnel. The composite upload context preserves input/provider segmentation while keeping each custom event within the standard Pro two-property limit.
