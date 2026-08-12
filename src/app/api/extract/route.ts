import { NextResponse } from "next/server";
import { extractPayroll, gatewayHealth, PRIMARY_MODEL, SECONDARY_MODEL } from "@/engine/extraction/extract";
import { reconcile } from "@/engine/extraction/agreement";
import { createRateLimiter } from "@/lib/rate-limit";

export const maxDuration = 120;

// Best-effort abuse guard (per lambda instance): 5 extractions/hour/IP.
const rateLimited = createRateLimiter(5, 3600_000);

// POST { pdfBase64 } -> VerifiedExtraction
// The core paid-product endpoint: dual-model extraction + reconciliation.
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(ip))
      return NextResponse.json({ error: "rate limit: 5 extractions per hour during beta" }, { status: 429 });

    const { pdfBase64 } = (await request.json()) as { pdfBase64?: string };
    if (!pdfBase64 || pdfBase64.length > 30_000_000)
      return NextResponse.json({ error: "pdfBase64 required (max ~20MB)" }, { status: 400 });

    const [primary, secondary] = await Promise.all([
      extractPayroll(pdfBase64, PRIMARY_MODEL),
      extractPayroll(pdfBase64, SECONDARY_MODEL),
    ]);
    return NextResponse.json({ success: true, data: reconcile(primary, secondary) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/extract — gateway health check: confirms OIDC auth works and both
// model ids resolve in the AI Gateway catalog. Safe to hit after any deploy.
export async function GET() {
  const results = await gatewayHealth();
  const ok = results.every((r) => r.ok);
  return NextResponse.json({ ok, results }, { status: ok ? 200 : 503 });
}
