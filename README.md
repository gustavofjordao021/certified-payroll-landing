# FormFriday (working title) — MVP scaffold

Certified payroll, filed from the payroll you already ran. First vertical of a
recurring-compliance-filing engine. Research + validation evidence lives in
`../research/opportunity-scout/` (demand data, competitive map, extraction
spike with accuracy numbers).

## Architecture — the one rule

**`src/engine/` never imports from `src/verticals/`.** The engine is the
platform (shared across all future verticals); a vertical is a skin. Vertical
2 (DQ files / DOT compliance) must be creatable by adding a sibling directory
under `verticals/` + funnel pages — zero engine rewrites.

```
src/engine/               the platform
  extraction/extract.ts   Claude PDF extraction, transcribe-only contract (spike-validated)
  extraction/agreement.ts dual-model disagreement detection -> confirmed/review rows
  validation/checksums.ts deterministic arithmetic net (catches day-grid misreads)
  render/payroll-report.ts WH-347-format PDF + Statement of Compliance (pdf-lib)
  schedule/recurrence.ts  filing cadences + due dates (the retention core)
src/verticals/certified-payroll/  the skin: positioning, outputs, funnel pages
src/app/
  page.tsx                landing (positioning validated against keyword data)
  wh-347-generator/       FREE lead magnet, fully client-side ("wh 347 form" 1,300/mo)
  api/extract/route.ts    paid-product core: upload -> verified rows
```

## Status (scaffold, 2026-08-06)

Working: landing page · free WH-347 generator (client-side PDF download) ·
`/api/extract` dual-model pipeline (needs `ANTHROPIC_API_KEY`).

Next, in order:
1. Verify screen UI consuming `VerifiedExtraction` (green auto-fill / yellow confirm rows)
2. Official WH-347 AcroForm fill (DOL fillable PDF as template) replacing the v0 layout
3. California DIR eCPR XML serializer (spec: dir.ca.gov eCPR user guide; XML upload path — user submits via their own DIR login, no integration)
4. Projects + weekly recurrence loop (schedule/recurrence.ts -> real model + reminders)
5. Auth + Stripe ($49 / $99 / $149 project tiers) — reuse Calendara's Supabase/Stripe patterns

## Run

```bash
npm install
ANTHROPIC_API_KEY=sk-... npm run dev
```

## Decisions already made (see research/)

- v1 scope: federal WH-347 + California DIR only (keyword data: NY long-tail is dead)
- Verify screen is a core feature, not polish (real scans: 42–67% cross-model agreement)
- Never silently guess: abstention contract in the extraction prompt is load-bearing
- Paid acquisition is out ($56–76 CPC fails the math) — funnel is free tools + state guides
