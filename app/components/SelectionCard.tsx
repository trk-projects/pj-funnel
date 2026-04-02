"use client";

import { ReactNode } from "react";

interface SelectionCardProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  selected?: boolean;
  onClick: () => void;
}

export default function SelectionCard({
  icon, title, subtitle, badge, selected, onClick,
}: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left
        transition-all duration-150 active:scale-[0.985] border-2
        ${selected
          ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200"
          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
        }
      `}
    >
      {icon && (
        <div className={`text-2xl flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl
          ${selected ? "bg-white/20" : "bg-gray-50"}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold text-[15px] ${selected ? "text-white" : "text-gray-900"}`}>
            {title}
          </span>
          {badge && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              selected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600 border border-blue-100"
            }`}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className={`text-sm mt-0.5 ${selected ? "text-blue-100" : "text-gray-500"}`}>
            {subtitle}
          </p>
        )}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
        ${selected ? "border-white bg-white" : "border-gray-300"}`}>
        {selected && (
          <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}
