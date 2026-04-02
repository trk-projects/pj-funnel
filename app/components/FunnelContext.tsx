"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ServiceType = "pressure" | "window" | "both" | null;
export type LocationType =
  | "Sugar Land"
  | "Houston"
  | "Katy"
  | "Missouri City"
  | "Richmond"
  | "Other"
  | null;
export type DrivewaySizeType = "Small (1–2 cars)" | "Medium (3–4 cars)" | "Large (5+ cars)" | null;
export type WindowCountType = "1–10" | "10–20" | "20+" | null;

export interface FunnelData {
  service: ServiceType;
  location: LocationType;
  drivewaySizeQ?: boolean; // whether we've answered driveway question
  windowCountQ?: boolean;  // whether we've answered window question
  drivewaySize: DrivewaySizeType;
  windowCount: WindowCountType;
  name: string;
  phone: string;
  email: string;
}

interface FunnelContextType {
  step: number;
  data: FunnelData;
  nurtureCallId: string | null;
  setNurtureCallId: (id: string | null) => void;
  setStep: (step: number) => void;
  updateData: (patch: Partial<FunnelData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const defaultData: FunnelData = {
  service: null,
  location: null,
  drivewaySize: null,
  windowCount: null,
  name: "",
  phone: "",
  email: "",
};

const FunnelContext = createContext<FunnelContextType | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FunnelData>(defaultData);
  const [nurtureCallId, setNurtureCallId] = useState<string | null>(null);

  const updateData = (patch: Partial<FunnelData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <FunnelContext.Provider value={{ step, data, nurtureCallId, setNurtureCallId, setStep, updateData, nextStep, prevStep }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error("useFunnel must be used within FunnelProvider");
  return ctx;
}
