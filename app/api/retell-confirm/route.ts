import { NextRequest, NextResponse } from "next/server";

const RETELL_API_KEY      = process.env.RETELL_API_KEY;
const RETELL_FROM_NUMBER  = process.env.RETELL_FROM_NUMBER;
const RETELL_AGENT_ID     = process.env.RETELL_CONFIRMATION_AGENT_ID;

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

    // Fire immediately after booking (no delay — they just scheduled, great moment to call)
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
        retell_llm_dynamic_variables: {
          customer_name: name?.split(" ")[0] ?? "",
          service:        toServiceLabel(service ?? ""),
          location:       location ?? "",
          booking_status: "booked",
        },
      }),
    });

    if (!res.ok) {
      console.error("Retell confirm call error:", await res.text());
      return NextResponse.json({ success: false });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("retell-confirm error:", error);
    return NextResponse.json({ success: false });
  }
}
