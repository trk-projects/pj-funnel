"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { FunnelProvider, useFunnel } from "./components/FunnelContext";
import ProgressBar from "./components/ProgressBar";
import LandingPage from "./components/LandingPage";
import LocationPage from "./components/LocationPage";
import JobSizePage from "./components/JobSizePage";
import ContactPage from "./components/ContactPage";
import BookingPage from "./components/BookingPage";

const TOTAL_STEPS = 5;

const pageVariants: Variants = {
  initial: {
    x: "60%",
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 35,
    },
  },
  exit: {
    x: "-30%",
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
};

function FunnelContent() {
  const { step } = useFunnel();
  const sessionId = useRef<string>("");

  // Generate a session ID once per browser session
  useEffect(() => {
    let id = sessionStorage.getItem("funnel_session");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("funnel_session", id);
    }
    sessionId.current = id;
  }, []);

  // Track every step view — fire-and-forget, never blocks the user
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, session_id: sessionId.current }),
    }).catch(() => {});

    const TRK_STEP_NAMES: Record<number, string> = {
      1: "Landing Page",
      2: "Location",
      3: "Job Size",
      4: "Contact Info",
      5: "Booking",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== "undefined" && (window as any).TRK?.step) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).TRK.step(TRK_STEP_NAMES[step] ?? `Step ${step}`);
    }
  }, [step]);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {step > 1 && <ProgressBar step={step} totalSteps={TOTAL_STEPS} />}

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={step}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full"
        >
          {step === 1 && <LandingPage />}
          {step === 2 && <LocationPage />}
          {step === 3 && <JobSizePage />}
          {step === 4 && <ContactPage />}
          {step === 5 && <BookingPage />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <FunnelProvider>
      <FunnelContent />
    </FunnelProvider>
  );
}
