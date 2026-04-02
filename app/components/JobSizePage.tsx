"use client";

import { useState } from "react";
import { useFunnel, DrivewaySizeType, WindowCountType } from "./FunnelContext";

const DRIVEWAY_OPTIONS: { value: DrivewaySizeType; sub: string }[] = [
  { value: "Small (1–2 cars)",  sub: "Single car garage or small pad" },
  { value: "Medium (3–4 cars)", sub: "Double garage or standard driveway" },
  { value: "Large (5+ cars)",   sub: "Large or circular driveway" },
];

const WINDOW_OPTIONS: { value: WindowCountType; sub: string }[] = [
  { value: "1–10",  sub: "Small home or condo" },
  { value: "10–20", sub: "Mid-size home" },
  { value: "20+",   sub: "Large home" },
];

export default function JobSizePage() {
  const { data, updateData, nextStep, prevStep } = useFunnel();
  const [subStep, setSubStep] = useState<"driveway" | "window">(
    data.service === "window" ? "window" : "driveway"
  );

  const needsDriveway = data.service === "pressure" || data.service === "both";
  const showDriveway  = needsDriveway && subStep === "driveway";
  const options       = showDriveway ? DRIVEWAY_OPTIONS : WINDOW_OPTIONS;
  const currentValue  = showDriveway ? data.drivewaySize : data.windowCount;

  const handlePick = (val: DrivewaySizeType | WindowCountType) => {
    if (showDriveway) {
      updateData({ drivewaySize: val as DrivewaySizeType });
      if (data.service === "both") setTimeout(() => setSubStep("window"), 280);
      else setTimeout(() => nextStep(), 280);
    } else {
      updateData({ windowCount: val as WindowCountType });
      setTimeout(() => nextStep(), 280);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 pt-6 pb-10">

        <button
          onClick={() => data.service === "both" && subStep === "window" ? setSubStep("driveway") : prevStep()}
          className="flex items-center gap-1.5 text-gray-400 text-sm mb-8 active:opacity-60"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Context pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data.service && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              {data.service === "pressure" ? "Pressure Washing" : data.service === "window" ? "Window Washing" : "Both Services"}
            </span>
          )}
          {data.location && (
            <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              {data.location}
            </span>
          )}
          {data.service === "both" && (
            <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full">
              {subStep === "driveway" ? "1 of 2" : "2 of 2"}
            </span>
          )}
        </div>

        <div className="mb-7">
          <h2 className="text-2xl font-black text-gray-900">
            {showDriveway ? "How big is your driveway?" : "How many windows does your home have?"}
          </h2>
          <p className="text-gray-500 text-sm mt-1.5">
            {showDriveway ? "Helps us estimate time and price." : "Count interior and exterior windows."}
          </p>
        </div>

        <div className="stagger space-y-2.5 md:space-y-0 md:grid md:grid-cols-3 md:gap-3">
          {options.map((opt) => {
            const sel = currentValue === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handlePick(opt.value)}
                className={`
                  w-full flex items-center justify-between px-4 py-4 rounded-2xl text-left
                  transition-all duration-150 active:scale-[0.985] border-2
                  ${sel ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200" : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"}
                `}
              >
                <div>
                  <p className={`font-semibold text-[15px] ${sel ? "text-white" : "text-gray-900"}`}>{opt.value}</p>
                  <p className={`text-xs mt-0.5 ${sel ? "text-blue-100" : "text-gray-500"}`}>{opt.sub}</p>
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
