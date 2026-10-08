"use client";
import React, { useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";
import {
  SUPPORTED_TIMEZONES,
  TIMEZONE_LABELS,
  SupportedTimezone,
  detectBrowserTimezone,
} from "@/lib/timezone";

export function TimezoneStep() {
  const { parentTz, tzDetected, setParentTz, setTzDetected, setStep } = useBookingStore();

  useEffect(() => {
    if (!tzDetected) {
      const detected = detectBrowserTimezone();
      setParentTz(detected);
      setTzDetected(true);
    }
  }, [tzDetected, setParentTz, setTzDetected]);

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900">
          What&apos;s your timezone?
        </h2>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          We&apos;ve auto-detected your timezone. All class slots will be shown in your local time.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SUPPORTED_TIMEZONES.map((tz) => {
          const isSelected = tz === parentTz;
          return (
            <button
              key={tz}
              type="button"
              onClick={() => setParentTz(tz as SupportedTimezone)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-150 ${
                isSelected
                  ? "border-orange-500 bg-orange-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🌐</span>
                <div>
                  <div className={`text-sm font-semibold ${isSelected ? "text-orange-700" : "text-slate-800"}`}>
                    {TIMEZONE_LABELS[tz].split("—")[0].trim()}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {TIMEZONE_LABELS[tz].split("—")[1]?.trim() ?? tz}
                  </div>
                </div>
              </div>

              {tz === detectBrowserTimezone() && (
                <span className="text-[10px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                  Your TZ
                </span>
              )}
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0 ml-2">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setStep("date")}
        className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-orange-200 text-sm"
      >
        Continue with {TIMEZONE_LABELS[parentTz]?.split("—")[0].trim()} →
      </button>
    </div>
  );
}
