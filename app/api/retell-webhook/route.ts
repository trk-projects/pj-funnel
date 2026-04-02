import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const RETELL_WEBHOOK_SECRET = process.env.RETELL_WEBHOOK_SECRET;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER;
const FUNNEL_URL = process.env.NEXT_PUBLIC_FUNNEL_URL ?? "";

// Disconnection reasons that mean the person actually had a conversation
const ANSWERED_REASONS = new Set(["user_hangup", "agent_hangup", "call_transfer", "max_duration_reached"]);

async function sendSMS(to: string, body: string): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_SMS_NUMBER) return;

  const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({ From: TWILIO_SMS_NUMBER, To: to, Body: body }).toString(),
    }
  );
}

function buildNurtureText(name: string, service: string, location: string): string {
  const link = FUNNEL_URL ? ` Book here: ${FUNNEL_URL}` : "";
  return `Hi ${name}, this is PJ Home Care! We just tried calling about your ${service} quote for ${location}.${link} — or just reply to this text and we'll get back to you fast.`;
}

function buildConfirmationText(name: string): string {
  return `Hi ${name}, PJ Home Care here! We tried calling to confirm your upcoming inspection — you're all set! Questions? Just reply to this text.`;
}

function verifySignature(rawBody: string, signature: string): boolean {
  if (!RETELL_WEBHOOK_SECRET) return true; // skip verification if secret not set
  const expected = createHmac("sha256", RETELL_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return signature === expected;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify Retell webhook signature
  const signature = req.headers.get("x-retell-signature") ?? "";
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only act on call_ended events
  if (payload.event !== "call_ended") {
    return NextResponse.json({ ok: true });
  }

  const call = payload.call as Record<string, unknown> | undefined;
  if (!call) return NextResponse.json({ ok: true });

  const disconnectionReason = (call.disconnection_reason as string) ?? "";
  const metadata = (call.metadata as Record<string, string>) ?? {};
  const { call_type, customer_name, service, location, to_number } = metadata;

  // Only send SMS if the call was not answered / had no real conversation
  if (ANSWERED_REASONS.has(disconnectionReason)) {
    return NextResponse.json({ ok: true, action: "call_was_answered" });
  }

  if (!to_number) {
    return NextResponse.json({ ok: true, action: "no_number_in_metadata" });
  }

  const name = customer_name || "there";

  if (call_type === "nurture") {
    await sendSMS(to_number, buildNurtureText(name, service ?? "your service", location ?? "your area")).catch(() => {});
  } else if (call_type === "confirmation") {
    await sendSMS(to_number, buildConfirmationText(name)).catch(() => {});
  }

  return NextResponse.json({ ok: true, action: "sms_sent" });
}
