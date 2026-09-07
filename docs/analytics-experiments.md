# Analytics and experiment instrumentation

The application uses Vercel Analytics as its only analytics destination. No payroll contents, names, employee identifiers, filenames, wage values, or exact file sizes are included in event payloads.

## Experiment configuration

Experiment flags and variants live in `src/lib/experiments.ts`.

- `homepagePositioning`: enabled, with `control` and `review_first` variants.
- `pricingIntent`: disabled until baseline traffic and downstream events are verified in development or staging.

The trust/sample CTA, post-extraction review-value treatment, pricing-intent UI, and segment survey remain gated by the brief's requirement to verify the complete baseline event chain first. The local extraction health check currently requires `AI_GATEWAY_API_KEY`; do not enable those later experiments until a successful extraction-to-download journey has been confirmed in development or staging.

Homepage positioning is assigned randomly once per browser session and stored in `sessionStorage`. The stored variant is included automatically on every explicit event as `experiment_variant`. If storage or configuration fails, the control variant is used.

## Events

| Event | Properties |
|---|---|
| `landing_view` | `page_path`, `experiment_variant`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign` |
| `primary_cta_clicked` | `page_path`, `cta_id`, `experiment_variant` |
| `manual_generator_clicked` | `page_path`, `experiment_variant` |
| `sample_payroll_clicked` | `page_path`, `experiment_variant` |
| `try_page_viewed` | `source_page`, `experiment_variant` |
| `input_method_selected` | `input_type`, `payroll_provider`, `experiment_variant` |
| `file_selected` | `file_type`, `file_size_bucket`, `input_type`, `payroll_provider`, `experiment_variant` |
| `upload_started` | `file_type`, `file_size_bucket`, `input_type`, `payroll_provider`, `experiment_variant` |
| `upload_completed` | prior upload properties plus `duration_ms` |
| `extraction_completed` | `workers_detected`, `fields_detected`, `warnings_detected`, `duration_ms`, `input_type`, `payroll_provider`, `experiment_variant` |
| `extraction_failed` | `failure_stage`, `error_code`, `file_type`, `input_type`, `payroll_provider`, `experiment_variant` |
| `review_screen_viewed` | `workers_detected`, `warnings_detected`, `experiment_variant` |
| `field_corrected` | `field_category`, `input_type`, `payroll_provider`, `experiment_variant` |
| `wh347_generated` | `workers_count`, `warnings_remaining`, `experiment_variant` |
| `wh347_downloaded` | `workers_count`, `experiment_variant` |

Existing early-access and California eCPR events also flow only to Vercel Analytics.

## Development verification

In non-production builds, every Vercel event is mirrored to a browser-only `wh347:analytics` custom event. This does not send data to another service. It makes the complete payload inspectable while testing:

```js
window.addEventListener("wh347:analytics", (event) => console.log(event.detail))
```

Verify the baseline journey in development or staging:

1. Load `/` with UTM parameters and confirm one `landing_view` with a stable variant.
2. Click the relevant hero CTA and confirm `primary_cta_clicked`; confirm the manual event when the generator route is selected.
3. On `/try`, select an input method and choose a PDF. Confirm the file-size value is a bucket and the filename is absent.
4. Complete one successful sample journey and one forced failure. Confirm the success and failure event chains and ensure no payroll data appears in any payload.
5. Continue into the generator, edit one extracted field, and download. Confirm one correction event per field category, followed by generation and download events.
6. Repeat in React Strict Mode and confirm page-view effects do not double-fire.

Use Vercel's event view to calculate the funnel ratios in the implementation brief and segment them by `experiment_variant`, `input_type`, and `payroll_provider`.
