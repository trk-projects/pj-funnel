"use client";

import { useState } from "react";
import { useFunnel } from "./FunnelContext";

export default function ContactPage() {
  const { data, updateData, nextStep, prevStep, setNurtureCallId } = useFunnel();
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: { name?: string; phone?: string } = {};
    if (!data.name.trim()) errs.name = "Please enter your name";
    if (data.phone.replace(/\D/g, "").length < 10) errs.phone = "Please enter a valid 10-digit number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (json.nurtureCallId) setNurtureCallId(json.nurtureCallId);
    } catch { /* silent */ }
    setLoading(false);
    nextStep();
  };

  const summaryItems = [
    data.service  && { label: data.service === "pressure" ? "Pressure Washing" : data.service === "window" ? "Window Washing" : "Both Services" },
    data.location && { label: `📍 ${data.location}` },
    data.drivewaySize && { label: `Driveway: ${data.drivewaySize}` },
    data.windowCount  && { label: `Windows: ${data.windowCount}` },
  ].filter(Boolean) as { label: string }[];

  const inputBase = "w-full px-4 py-3.5 rounded-xl border text-gray-900 text-[15px] bg-gray-50 focus:outline-none focus:bg-white transition-colors placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-5 pt-6 pb-10">

        <button onClick={prevStep} className="flex items-center gap-1.5 text-gray-400 text-sm mb-8 active:opacity-60">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="md:grid md:grid-cols-[1fr,1.4fr] md:gap-12 md:items-start">

          {/* Left: summary panel (desktop only shows full panel, mobile shows inline pills) */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">Where should we send the quote?</h2>
              <p className="text-gray-500 text-sm mt-1.5">We&apos;ll reach out fast — usually within the hour.</p>
            </div>

            {/* Summary pills — mobile */}
            {summaryItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 md:hidden">
                {summaryItems.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {item.label}
                  </span>
                ))}
              </div>
            )}

            {/* Summary card — desktop only */}
            {summaryItems.length > 0 && (
              <div className="hidden md:block bg-blue-600 rounded-2xl p-5 text-white mb-6">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">Your Request</p>
                <div className="space-y-2">
                  {summaryItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-white text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop trust bullets */}
            <div className="hidden md:block space-y-3">
              {[
                { icon: "⚡", text: "Fast response — usually within the hour" },
                { icon: "🔒", text: "Your info stays private, never shared" },
                { icon: "✅", text: "No commitment required" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-gray-600 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your name <span className="text-blue-500">*</span></label>
              <input type="text" inputMode="text" autoComplete="name" placeholder="John Smith" value={data.name}
                onChange={(e) => { updateData({ name: e.target.value }); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }}
                className={`${inputBase} ${errors.name ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-blue-500"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone number <span className="text-blue-500">*</span></label>
              <input type="tel" inputMode="tel" autoComplete="tel" placeholder="(832) 555-0100" value={data.phone}
                onChange={(e) => { updateData({ phone: formatPhone(e.target.value) }); if (errors.phone) setErrors(p => ({ ...p, phone: undefined })); }}
                className={`${inputBase} ${errors.phone ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-blue-500"}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
              <input type="email" inputMode="email" autoComplete="email" placeholder="john@email.com" value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                className={`${inputBase} border-gray-200 focus:border-blue-500`}
              />
            </div>

            {/* Privacy */}
            <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-100">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-gray-500 text-xs leading-relaxed">Your info is private and only used to send your quote. We never spam or sell your data.</p>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] rounded-xl shadow-lg shadow-blue-200 transition-all duration-150 active:scale-[0.985] disabled:opacity-60 flex items-center justify-center gap-2.5 mt-2"
            >
              {loading ? (
                <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending...</>
              ) : (
                <>Get My Free Quote<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              )}
            </button>

            <p className="text-center text-gray-400 text-xs">No obligation · 100% free · Fast response</p>
          </div>

        </div>
      </div>
    </div>
  );
}
