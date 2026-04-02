"use client";

import { useEffect, useRef, useState } from "react";
import { useFunnel } from "./FunnelContext";

const CAL_BASE = "https://cal.com/trk-ai-agency/test-calendar";

export default function BookingPage() {
  const { data, nurtureCallId } = useFunnel();
  const [calLoaded, setCalLoaded] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const confirmFiredRef = useRef(false);
  const nurtureFiredRef = useRef(false);

  // Listen for Cal.com booking confirmation via postMessage
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (
        e.origin === "https://cal.com" &&
        e.data?.type === "booking_successful" &&
        !confirmFiredRef.current
      ) {
        confirmFiredRef.current = true;
        setBookingConfirmed(true);
        fetch("/api/retell-confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: data.phone,
            name: data.name,
            service: data.service,
            location: data.location,
            nurtureCallId,
          }),
        }).catch(() => { /* silent */ });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [data.phone, data.name, data.service, data.location, nurtureCallId]);

  // Fire nurture call when user leaves without booking
  useEffect(() => {
    if (!data.phone) return;

    const fireNurture = () => {
      if (confirmFiredRef.current || nurtureFiredRef.current) return;
      nurtureFiredRef.current = true;
      const payload = JSON.stringify({
        phone: data.phone,
        name: data.name,
        service: data.service,
        location: data.location,
      });
      navigator.sendBeacon("/api/retell-nurture", new Blob([payload], { type: "application/json" }));
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") fireNurture();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", fireNurture);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", fireNurture);
    };
  }, [data.phone, data.name, data.service, data.location]);

  const calUrl = `${CAL_BASE}?embed=true&theme=light&brandColor=2563eb&name=${encodeURIComponent(data.name || "")}&email=${encodeURIComponent(data.email || "")}&notes=${encodeURIComponent(`Service: ${data.service || ""} | Location: ${data.location || ""}`)}`;

  const serviceLabel =
    data.service === "pressure" ? "Pressure Washing" :
    data.service === "window"   ? "Window Washing"   : "Both Services";

  return (
    <div className="min-h-screen bg-white">

      {/* Blue header banner */}
      <div className="bg-blue-600 px-5 pt-7 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Quote request received</p>
              <p className="text-white font-bold text-lg leading-tight">
                {data.name ? `Thanks, ${data.name.split(" ")[0]}!` : "Almost there!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking confirmed banner */}
      {bookingConfirmed && (
        <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-2.5">
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-emerald-800 text-sm font-medium">
              Appointment booked! Expect a quick confirmation call from us in a couple minutes.
            </p>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="px-5 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="md:grid md:grid-cols-[300px,1fr] md:gap-10 md:items-start">

            {/* Left: info panel */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Pick a time for your free visit</h3>
              <p className="text-gray-500 text-sm mb-5">15 minutes · No cost · No commitment</p>

              {/* Summary pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {data.service && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {serviceLabel}
                  </span>
                )}
                {data.location && (
                  <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    📍 {data.location}
                  </span>
                )}
                {data.drivewaySize && (
                  <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Driveway: {data.drivewaySize}
                  </span>
                )}
                {data.windowCount && (
                  <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Windows: {data.windowCount}
                  </span>
                )}
              </div>

              {/* Desktop-only trust points */}
              <div className="hidden md:block space-y-3 mb-8">
                {[
                  { icon: "🏠", text: "Free on-site inspection" },
                  { icon: "💰", text: "Upfront quote, no surprises" },
                  { icon: "⚡", text: "Usually available within days" },
                  { icon: "✅", text: "No commitment to book" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-gray-600 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Call / text fallback */}
              <div className="hidden md:block">
                <p className="text-gray-400 text-sm mb-3">Prefer to call or text instead?</p>
                <a
                  href="tel:+18325550100"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm active:scale-[0.97] transition-all shadow-lg shadow-blue-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                  </svg>
                  Call or Text Us
                </a>
              </div>
            </div>

            {/* Right: Cal.com embed */}
            <div>
              <div className="relative rounded-2xl overflow-hidden border border-gray-200" style={{ minHeight: 680 }}>
                {!calLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-gray-500 text-sm">Loading scheduler…</p>
                  </div>
                )}
                <iframe
                  src={calUrl}
                  width="100%"
                  height="680"
                  frameBorder="0"
                  onLoad={() => setCalLoaded(true)}
                  style={{ display: calLoaded ? "block" : "none" }}
                />
              </div>

              {/* Mobile-only call button */}
              <div className="mt-6 text-center md:hidden">
                <p className="text-gray-500 text-sm mb-3">Prefer to just call or text?</p>
                <a
                  href="tel:+18325550100"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm active:scale-[0.97] transition-all shadow-lg shadow-blue-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                  </svg>
                  Call or Text Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
