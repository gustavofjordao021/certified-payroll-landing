import { NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/rate-limit";
import { isValidEmail } from "@/lib/early-access";

// Early-access capture: stores the address as a Resend contact (segment
// "wh347form-early-access") and emails a signup notification. Both calls are
// best-effort — success is reported if either lands, so a Resend contacts
// hiccup never eats a signup silently.
const limited = createRateLimiter(10, 3600_000);

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (limited(ip)) return NextResponse.json({ error: "too many requests" }, { status: 429 });

    const { email, source } = (await request.json()) as { email?: string; source?: string };
    if (!isValidEmail(email))
      return NextResponse.json({ error: "a valid email is required" }, { status: 400 });

    const key = process.env.RESEND_API_KEY;
    if (!key) return NextResponse.json({ error: "not configured" }, { status: 503 });

    const headers = { Authorization: `Bearer ${key}`, "content-type": "application/json" };
    const src = (source ?? "unknown").slice(0, 40);

    const contact = fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: email.trim(),
        ...(process.env.RESEND_SEGMENT_ID ? { segment_ids: [process.env.RESEND_SEGMENT_ID] } : {}),
        properties: { source: src },
      }),
    }).then((r) => r.ok, () => false);

    const notify = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify({
        from: "wh347form <onboarding@resend.dev>",
        to: [process.env.EARLY_ACCESS_NOTIFY ?? "gustavo.jordao021@gmail.com"],
        subject: `Early access signup: ${email.trim()}`,
        text: `New early-access signup on wh347form.com\n\nEmail: ${email.trim()}\nSource: ${src}\nTime: ${new Date().toISOString()}`,
      }),
    }).then((r) => r.ok, () => false);

    const [contactOk, notifyOk] = await Promise.all([contact, notify]);
    if (!contactOk && !notifyOk)
      return NextResponse.json({ error: "signup could not be recorded" }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
