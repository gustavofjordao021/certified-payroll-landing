import { generateText } from "ai";
import { PayrollExtraction, PayrollExtractionSchema } from "../types";

// Models are routed through the Vercel AI Gateway ("creator/model" strings).
// Auth: VERCEL_OIDC_TOKEN is auto-injected on Vercel deployments — no API key
// anywhere (same topology as Calendara CLND-354; do NOT add AI_GATEWAY_API_KEY
// to prod/preview env or attribution silently breaks). Override the model ids
// via env if the gateway catalog names differ.
export const PRIMARY_MODEL = process.env.EXTRACT_PRIMARY_MODEL ?? "anthropic/claude-haiku-4.5";
export const SECONDARY_MODEL = process.env.EXTRACT_SECONDARY_MODEL ?? "anthropic/claude-sonnet-5";

const PROMPT = `You are extracting data from a payroll document for certified payroll (WH-347) preparation. Accuracy is legally critical: NEVER guess a value that is not visibly present — use null instead.

Return ONLY a JSON object, no prose, with this shape:
{
  "company": string|null,
  "employees": [
    {
      "name": string,
      "classification": string|null,
      "daily_hours": [n,n,n,n,n,n,n]|null,
      "reg_hours": number|null,
      "ot_hours": number|null,
      "hourly_rate": number|null,
      "gross_pay": number|null,
      "fringe_total": number|null
    }
  ]
}
Rules: include every employee row. daily_hours is Mon..Sun; null if the document only shows weekly totals; 0 for blank days when a daily grid exists. hourly_rate is the base rate, not the overtime rate. Compute nothing; transcribe only.`;

export async function extractPayroll(
  pdfBase64: string,
  model: string = PRIMARY_MODEL,
): Promise<PayrollExtraction> {
  const { text } = await generateText({
    model,
    maxOutputTokens: 8000,
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: pdfBase64, mediaType: "application/pdf" },
          { type: "text", text: PROMPT },
        ],
      },
    ],
  });
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("extraction returned no JSON");
  return PayrollExtractionSchema.parse(JSON.parse(match[0]));
}

// Tiny self-test used by the health endpoint: verifies gateway auth + model ids
// without burning meaningful tokens.
export async function gatewayHealth(): Promise<{ model: string; ok: boolean; error?: string }[]> {
  const results = [];
  for (const model of [PRIMARY_MODEL, SECONDARY_MODEL]) {
    try {
      await generateText({ model, maxOutputTokens: 8, prompt: "Reply with the word ok." });
      results.push({ model, ok: true });
    } catch (e) {
      results.push({ model, ok: false, error: e instanceof Error ? e.message.slice(0, 200) : "unknown" });
    }
  }
  return results;
}
