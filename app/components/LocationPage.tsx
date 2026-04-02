"use client";

import { useFunnel, LocationType } from "./FunnelContext";

const LOCATIONS: { value: LocationType; sub: string }[] = [
  { value: "Sugar Land",    sub: "Fort Bend County" },
  { value: "Houston",       sub: "Greater Houston Area" },
  { value: "Katy",          sub: "Harris / Fort Bend County" },
  { value: "Missouri City", sub: "Fort Bend County" },
  { value: "Richmond",      sub: "Fort Bend County" },
  { value: "Other",         sub: "We may still serve you — ask us!" },
];

export default function LocationPage() {
  const { data, updateData, nextStep, prevStep } = useFunnel();

  const serviceLabel =
    data.service === "pressure" ? "Pressure Washing" :
    data.service === "window"   ? "Window Washing"   : "Both Services";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 pt-6 pb-10">

        <button onClick={prevStep} className="flex items-center gap-1.5 text-gray-400 text-sm mb-8 active:opacity-60">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="mb-7">
          {data.service && (
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {serviceLabel} selected
            </div>
          )}
          <h2 className="text-2xl font-black text-gray-900">What area are you in?</h2>
          <p className="text-gray-500 text-sm mt-1.5">We serve Sugar Land and the surrounding area.</p>
        </div>

        <div className="stagger space-y-2.5 md:space-y-0 md:grid md:grid-cols-2 md:gap-3">
          {LOCATIONS.map((loc) => {
            const sel = data.location === loc.value;
            return (
              <button
                key={loc.value}
                onClick={() => { updateData({ location: loc.value }); setTimeout(() => nextStep(), 280); }}
                className={`
                  w-full flex items-center justify-between px-4 py-4 rounded-2xl text-left
                  transition-all duration-150 active:scale-[0.985] border-2
                  ${sel ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200" : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"}
                `}
              >
                <div>
                  <p className={`font-semibold text-[15px] ${sel ? "text-white" : "text-gray-900"}`}>{loc.value}</p>
                  <p className={`text-xs mt-0.5 ${sel ? "text-blue-100" : "text-gray-500"}`}>{loc.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${sel ? "border-white bg-white" : "border-gray-300"}`}>
                  {sel && <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
