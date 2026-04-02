"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useFunnel } from "./FunnelContext";

const TESTIMONIALS = [
  { name: "Maria G.",   location: "Sugar Land, TX",    initials: "MG", color: "bg-violet-500", stars: 5, text: "PJ Home Care did an incredible job on our driveway. It looked brand new after the pressure wash. Super professional and affordable.", date: "2 weeks ago" },
  { name: "David L.",   location: "Missouri City, TX", initials: "DL", color: "bg-emerald-500", stars: 5, text: "Our windows have never been this clean. Peter and his team were on time, careful, and the results were amazing. Will use again.", date: "1 month ago" },
  { name: "Jennifer R.", location: "Katy, TX",          initials: "JR", color: "bg-rose-500",    stars: 5, text: "These guys blew me away. Driveway, walkway, and windows — all spotless. Love supporting a local student business!", date: "3 weeks ago" },
  { name: "Carlos M.",  location: "Sugar Land, TX",    initials: "CM", color: "bg-blue-500",    stars: 5, text: "Quick response, great price, house looks brand new. My neighbors have been asking who cleaned it. Booking again for spring.", date: "1 week ago" },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const SERVICES = [
  { id: "pressure" as const, emoji: "🚿", label: "Pressure Washing",  desc: "Driveways, patios & walkways" },
  { id: "window"   as const, emoji: "🪟", label: "Window Washing",    desc: "Interior & exterior glass" },
  { id: "both"     as const, emoji: "✨", label: "Both Services",      desc: "Complete home refresh", badge: "Best Value" },
];

export default function LandingPage() {
  const { data, updateData, nextStep } = useFunnel();
  const belowRef = useRef<HTMLDivElement>(null);

  const handleSelect = (service: "pressure" | "window" | "both") => {
    updateData({ service });
    setTimeout(() => nextStep(), 280);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────── */}
      <div className="bg-blue-600 px-5 pt-7 pb-0 md:pb-20">
        <div className="max-w-5xl mx-auto">

          {/* Nav — full width on both mobile and desktop */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                <span className="text-[11px] font-black text-blue-600">PJ</span>
              </div>
              <span className="text-white font-semibold text-sm">PJ Home Care</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 border border-white/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-medium">Accepting bookings</span>
            </div>
          </div>

          {/* 2-col grid on desktop */}
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">

            {/* Left: headline + social proof */}
            <div className="mb-0">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">
                Sugar Land · Houston · Katy
              </p>
              <h1 className="text-[28px] md:text-[42px] font-black text-white leading-[1.2] mb-3 md:mb-5">
                Pressure Washing & Window Cleaning You Can Trust
              </h1>
              <p className="text-blue-100 text-[15px] md:text-[17px] leading-relaxed mb-6 md:mb-10">
                Student-owned, locally operated. Serving homeowners since 2021.
              </p>

              {/* Social proof */}
              <div className="flex items-center gap-3 mb-8 md:mb-0">
                <div className="flex -space-x-2">
                  {[{ c: "bg-violet-400", l: "M" }, { c: "bg-emerald-400", l: "D" }, { c: "bg-rose-400", l: "J" }, { c: "bg-blue-300", l: "C" }].map(({ c, l }) => (
                    <div key={l} className={`w-7 h-7 ${c} rounded-full border-2 border-blue-600 flex items-center justify-center`}>
                      <span className="text-[10px] font-bold text-white">{l}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1.5"><Stars /><span className="text-white font-bold text-sm">5.0</span></div>
                  <p className="text-blue-200 text-xs">50+ happy homeowners</p>
                </div>
              </div>

              {/* Desktop-only trust badges */}
              <div className="hidden md:flex flex-wrap gap-3 mt-8">
                {["Free quotes", "No commitment", "Fast response", "Locally owned"].map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: service selector card */}
            <div className="bg-white rounded-t-3xl md:rounded-3xl md:shadow-2xl px-5 pt-6">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">Free Quote · 60 seconds</p>
              <h2 className="text-[19px] md:text-[22px] font-bold text-gray-900 mb-4">What do you need cleaned?</h2>

              <div className="stagger space-y-2.5 pb-6">
                {SERVICES.map((svc) => {
                  const sel = data.service === svc.id;
                  return (
                    <button
                      key={svc.id}
                      onClick={() => handleSelect(svc.id)}
                      className={`
                        w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left
                        transition-all duration-150 active:scale-[0.985] border-2
                        ${sel ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200" : "bg-white border-blue-200 hover:border-blue-400"}
                      `}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${sel ? "bg-white/20" : "bg-blue-50"}`}>
                        {svc.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-[15px] ${sel ? "text-white" : "text-gray-900"}`}>{svc.label}</span>
                          {svc.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sel ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                              {svc.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 ${sel ? "text-blue-100" : "text-gray-500"}`}>{svc.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${sel ? "border-white bg-white" : "border-gray-300"}`}>
                        {sel && <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-gray-400 text-xs pb-5">No credit card · No obligation</p>
            </div>

          </div>
        </div>
      </div>

      {/* ── STATS ─────────────────────────────── */}
      <div ref={belowRef} className="bg-gray-50 border-y border-gray-100 px-5 py-5">
        <div className="max-w-5xl mx-auto flex divide-x divide-gray-200">
          {[{ num: "50+", label: "Homes Cleaned" }, { num: "5.0★", label: "Average Rating" }, { num: "4", label: "Cities Served" }].map((s) => (
            <div key={s.label} className="flex-1 text-center px-3 first:pl-0 last:pr-0">
              <p className="text-xl font-black text-gray-900">{s.num}</p>
              <p className="text-blue-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BEFORE / AFTER ────────────────────── */}
      <div className="px-5 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest mb-1">Our Results</p>
          <h2 className="text-2xl font-black text-gray-900 mb-2">See the difference</h2>
          <p className="text-gray-500 text-sm mb-6">Real jobs. Real homes. Right here in your neighborhood.</p>
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
            {[
              { src: "/ba-brick.png",    label: "Brick Wall",        tag: "Pressure Washing", before: "top-3 left-3",    after: "top-3 right-3" },
              { src: "/ba-patio.png",    label: "Patio & Walkway",   tag: "Pressure Washing", before: "top-3 left-3",    after: "top-3 right-3" },
              { src: "/ba-driveway.png", label: "Exposed Aggregate", tag: "Pressure Washing", before: "top-3 left-3",    after: "bottom-3 left-3" },
              { src: "/ba-windows.png",  label: "Windows",           tag: "Window Washing",   before: "top-3 left-3",    after: "top-3 right-3" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={`Before and after ${item.label}`}
                    className="w-full object-cover"
                    style={{ maxHeight: 300 }}
                  />
                  <span className={`absolute ${item.before} bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg tracking-wide`}>BEFORE</span>
                  <span className={`absolute ${item.after} bg-blue-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg tracking-wide`}>AFTER</span>
                </div>
                <div className="bg-white px-4 py-2.5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY US ────────────────────────────── */}
      <div className="bg-gray-50 border-y border-gray-100 px-5 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest mb-1">Why Choose Us</p>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Built on trust</h2>
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
            {[
              { title: "Locally owned since 2021", desc: "We're your neighbors — not a franchise. Every job gets our personal attention." },
              { title: "Professional equipment",   desc: "Commercial-grade pressure washers and window tools — not hardware store gear." },
              { title: "Transparent pricing",      desc: "No surprise fees. We quote before we start and stick to it every time." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOUNDER ───────────────────────────── */}
      <div className="px-5 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest mb-1">Our Story</p>
          <h2 className="text-2xl font-black text-gray-900 mb-6">A local student who built something real</h2>
          <div className="bg-blue-600 rounded-2xl p-5 md:p-8 text-white md:flex md:gap-8 md:items-start">
            <div className="flex items-center gap-3 mb-4 md:mb-0 md:flex-col md:items-center md:flex-shrink-0">
              <div className="w-12 h-12 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl md:text-4xl flex-shrink-0">👤</div>
              <div className="md:text-center">
                <p className="font-bold text-white">Peter Balderra</p>
                <p className="text-blue-200 text-xs">Founder · Elkins High School</p>
              </div>
            </div>
            <blockquote className="text-blue-100 text-[14px] md:text-[16px] leading-relaxed">
              &ldquo;I started PJ Home Care in 2021 at 18 years old while still in high school. What began as a small side project grew into a full team serving homeowners across Sugar Land and the surrounding area. When you hire us, you&apos;re supporting a local young entrepreneur right here in your community.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ──────────────────────── */}
      <div className="bg-gray-50 border-t border-gray-100 px-5 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest mb-1">Reviews</p>
              <h2 className="text-2xl font-black text-gray-900">What homeowners say</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900">5.0</p>
              <Stars />
            </div>
          </div>

          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 mb-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xs">{t.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.location}</p>
                  </div>
                  <Stars />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <p className="text-gray-400 text-xs mt-2">{t.date}</p>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="bg-blue-600 rounded-2xl p-5 md:p-8 shadow-lg shadow-blue-200">
            <div className="md:flex md:items-center md:justify-between md:gap-12">
              <div className="mb-5 md:mb-0">
                <h3 className="text-white font-black text-xl md:text-2xl mb-1">Ready for a cleaner home?</h3>
                <p className="text-blue-100 text-sm">Takes 60 seconds. Completely free.</p>
              </div>
              <div className="space-y-2.5 md:min-w-[280px]">
                {SERVICES.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => handleSelect(svc.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm
                      transition-all duration-150 active:scale-[0.98] border
                      ${svc.id === "both"
                        ? "bg-white border-white text-blue-600 shadow-sm"
                        : "bg-white/15 border-white/20 text-white"
                      }
                    `}
                  >
                    <span>{svc.emoji}</span>
                    {svc.label}
                    {svc.badge && <span className="ml-auto text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">{svc.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────── */}
      <div className="border-t border-gray-100 px-5 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-[9px] font-black text-white">PJ</span>
          </div>
          <span className="font-semibold text-gray-700 text-sm">PJ Home Care LLC</span>
        </div>
        <p className="text-gray-400 text-xs">Sugar Land · Houston · Katy · Missouri City · Richmond</p>
      </div>

    </div>
  );
}
