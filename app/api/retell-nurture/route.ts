import { NextRequest, NextResponse } from "next/server";

const RETELL_API_KEY      = process.env.RETELL_API_KEY;
const RETELL_FROM_NUMBER  = process.env.RETELL_FROM_NUMBER;
const RETELL_AGENT_ID     = process.env.RETELL_NURTURE_AGENT_ID;

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

function toServiceLabel(service: string): string {
  if (service === "pressure") return "Pressure Washing";
  if (service === "window")   return "Window Washing";
  return "Pressure Washing and Window Cleaning";
}

export async function POST(req: NextRequest) {
  if (!RETELL_API_KEY || !RETELL_FROM_NUMBER || !RETELL_AGENT_ID) {
    return NextResponse.json({ success: false, reason: "Retell not configured" });
  }

  try {
    const { phone, name, service, location } = await req.json();

    if (!phone) return NextResponse.json({ success: false, reason: "No phone" });

    // Schedule 2 minutes after the lead bounces
    const scheduledTime = Math.floor(Date.now() / 1000) + 2 * 60;

    const res = await fetch("https://api.retellai.com/v2/create-phone-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RETELL_API_KEY}`,
      },
      body: JSON.stringify({
        from_number: RETELL_FROM_NUMBER,
        to_number: toE164(phone),
        override_agent_id: RETELL_AGENT_ID,
        scheduled_time: scheduledTime,
        retell_llm_dynamic_variables: {
          customer_name: name?.split(" ")[0] ?? "",
          service:        toServiceLabel(service ?? ""),
          location:       location ?? "",
          booking_status: "not_booked",
        },
      }),
    });

    if (!res.ok) {
      console.error("Retell nurture call error:", await res.text());
      return NextResponse.json({ success: false });
    }

    const json = await res.json();
    return NextResponse.json({ success: true, callId: json.call_id });
  } catch (error) {
    console.error("retell-nurture error:", error);
    return NextResponse.json({ success: false });
  }
}
