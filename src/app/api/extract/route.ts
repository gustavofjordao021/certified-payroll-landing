import { NextResponse } from "next/server";
import { extractPayroll, PRIMARY_MODEL, SECONDARY_MODEL } from "@/engine/extraction/extract";
import { reconcile } from "@/engine/extraction/agreement";

export const maxDuration = 120;

// Best-effort abuse guard (per lambda instance): 5 extractions/hour/IP.
const hits = new Map<string, { n: number; ts: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.ts > 3600_000) { hits.set(ip, { n: 1, ts: now }); return false; }
  h.n += 1;
  return h.n > 5;
}

// POST { pdfBase64 } -> VerifiedExtraction
// The core paid-product endpoint: dual-model extraction + reconciliation.
export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY)
      return NextResponse.json({ error: "extraction not configured" }, { status: 503 });

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
