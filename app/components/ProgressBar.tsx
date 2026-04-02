"use client";

const stepLabels = ["Service", "Location", "Details", "Contact", "Schedule"];

export default function ProgressBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-5 py-3">
        <div className="flex items-center gap-1.5 mb-2.5">
          {stepLabels.map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300
                ${i + 1 <= step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}
              `}>
                {i + 1 < step ? (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`h-px w-5 transition-all duration-500 ${i + 1 < step ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
          <span className="ml-auto text-xs text-gray-400 font-medium pl-2">{stepLabels[step - 1]}</span>
        </div>
        <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
