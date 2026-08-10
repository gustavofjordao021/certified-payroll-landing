import { PayrollExtraction, PayrollExtractionSchema } from "../types";

// Model tiers validated by the extraction spike: Haiku is near-perfect on
// digital registers (~$0.006/doc); Sonnet resolved every synthetic case
// including daily grids and scan-style docs (~$0.03/doc).
export const PRIMARY_MODEL = "claude-haiku-4-5-20251001";
export const SECONDARY_MODEL = "claude-sonnet-5";

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
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`extraction failed: ${res.status} ${JSON.stringify(json.error ?? json).slice(0, 200)}`);

  type Block = { text?: string; thinking?: string };
  const text = (json.content as Block[]).map((c) => c.text ?? c.thinking ?? "").join("");
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("extraction returned no JSON");
  return PayrollExtractionSchema.parse(JSON.parse(match[0]));
}
