import { NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/rate-limit";
import { isValidEmail } from "@/lib/early-access";

// Early-access capture: stores the address as a Resend contact, then (only
// if the contact was recorded) sends the optional notification ping.
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

    // Bare contact only: this account predates Resend's segments/properties
    // migration, and its REST key rejects both fields ("do not exist") even
    // though the dashboard connector can create them. Signup source is
    // preserved in the analytics event and the notification email instead.
    const contact = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({ email: email.trim() }),
    }).then(
      async (r) => ({ ok: r.ok, detail: r.ok ? "" : `${r.status} ${(await r.text()).slice(0, 200)}` }),
      (e) => ({ ok: false, detail: e instanceof Error ? e.message : "fetch failed" }),
    );

    if (!contact.ok) {
      console.error("early-access contact creation failed:", contact.detail);
      return NextResponse.json({ error: "signup could not be recorded", detail: contact.detail }, { status: 502 });
    }

    // Ping only after the contact is recorded, and only when EARLY_ACCESS_NOTIFY
    // is set — failed or test-loop signups never generate email noise.
    const notifyTo = process.env.EARLY_ACCESS_NOTIFY;
    if (notifyTo)
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers,
        body: JSON.stringify({
          from: "wh347form <onboarding@resend.dev>",
          to: [notifyTo],
          subject: `Early access signup: ${email.trim()}`,
          text: `New early-access signup on wh347form.com\n\nEmail: ${email.trim()}\nSource: ${src}\nTime: ${new Date().toISOString()}`,
        }),
      }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
