"use client";
import React from "react";
import { useBookingStore, BookingStep } from "@/store/bookingStore";

const STEPS: { id: BookingStep; label: string; icon: string }[] = [
  { id: "timezone", label: "Timezone",    icon: "🌍" },
  { id: "date",     label: "Pick a Date", icon: "📅" },
  { id: "slot",     label: "Choose Slot", icon: "🕐" },
  { id: "info",     label: "Your Details",icon: "👤" },
];

export function StepIndicator() {
  const { step } = useBookingStore();

  const currentIndex = STEPS.findIndex((s) => s.id === step);

  if (step === "confirmed") return null;

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
      {STEPS.map((s, i) => {
        const isDone    = i < currentIndex;
        const isActive  = i === currentIndex;
        const isUpcoming= i > currentIndex;

        return (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-1.5 relative">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200 ${
                  isDone
                    ? "bg-green-500 border-green-500 text-white shadow-sm"
                    : isActive
                    ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {isDone ? "✓" : <span className={isUpcoming ? "opacity-50" : ""}>{s.icon}</span>}
              </div>
              {/* Label */}
              <span
                className={`text-[11px] font-semibold tracking-wide ${
                  isActive ? "text-orange-500" : isDone ? "text-green-600" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i < currentIndex ? "bg-green-400" : "bg-slate-200"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
