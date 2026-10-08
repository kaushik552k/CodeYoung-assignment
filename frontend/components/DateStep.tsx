"use client";
import React, { useState } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { TIMEZONE_LABELS } from "@/lib/timezone";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function addDays(isoDate: string, n: number) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export function DateStep() {
  const { parentTz, selectedDate, setSelectedDate, setStep } = useBookingStore();
  const todayISO = getTodayISO();
  const maxISO = addDays(todayISO, 30);

  const initial = selectedDate ?? addDays(todayISO, 1);
  const [viewYear, setViewYear]   = useState(() => Number(initial.split("-")[0]));
  const [viewMonth, setViewMonth] = useState(() => Number(initial.split("-")[1]) - 1);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function navigateMonth(dir: -1 | 1) {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0;  y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  function buildISO(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  }

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900">Pick a date</h2>
        <p className="text-slate-500 text-sm mt-1.5">
          Choose a date within the next 30 days for your trial class · Slots shown in&nbsp;
          <span className="font-semibold text-orange-600">
            {TIMEZONE_LABELS[parentTz]?.split("—")[0].trim()}
          </span>
        </p>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Month Nav */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold transition-colors"
          >
            ‹
          </button>
          <span className="text-sm font-bold text-slate-800">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold transition-colors"
          >
            ›
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-[11px] font-bold text-slate-400 py-2.5 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 p-2 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const iso = buildISO(day);
            const isPast     = iso < addDays(todayISO, 1);
            const isTooFar   = iso > maxISO;
            const isDisabled = isPast || isTooFar;
            const isSelected = iso === selectedDate;
            const isToday    = iso === todayISO;

            return (
              <button
                key={day}
                disabled={isDisabled}
                onClick={() => setSelectedDate(iso)}
                className={`
                  relative h-9 w-full rounded-lg text-sm font-medium transition-all duration-100
                  ${isSelected
                    ? "bg-orange-500 text-white font-bold shadow-sm shadow-orange-200"
                    : isDisabled
                    ? "text-slate-300 cursor-not-allowed"
                    : isToday
                    ? "ring-2 ring-orange-300 text-orange-700 hover:bg-orange-50"
                    : "text-slate-700 hover:bg-slate-100"
                  }
                `}
              >
                {day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <p className="text-xs text-center text-slate-400">
          Selected: <span className="font-semibold text-slate-700">{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep("timezone")}
          className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!selectedDate}
          onClick={() => setStep("slot")}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-orange-200 text-sm"
        >
          {selectedDate ? `View Slots for ${new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Select a date first"} →
        </button>
      </div>
    </div>
  );
}
