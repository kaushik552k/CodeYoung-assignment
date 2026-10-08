"use client";
import React, { useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { fetchSlots } from "@/lib/api";
import { TIMEZONE_LABELS } from "@/lib/timezone";
import type { Slot } from "@/lib/shared";

function Skeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
      ))}
    </div>
  );
}

function SlotCard({ slot, isSelected, onSelect }: {
  slot: Slot;
  isSelected: boolean;
  onSelect: () => void;
}) {
  if (!slot.available) {
    return (
      <div
        title="All mentors are booked at this time"
        className="flex flex-col gap-1 p-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
      >
        <span className="text-sm font-semibold text-slate-400">{slot.parentDisplay}</span>
        <span className="text-[11px] text-slate-400 font-medium">No mentors available</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`flex flex-col gap-1 p-3 rounded-xl border-2 text-left transition-all duration-150 ${
        isSelected
          ? "border-orange-500 bg-orange-50 shadow-sm shadow-orange-100"
          : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/40"
      }`}
    >
      <span className={`text-sm font-bold ${isSelected ? "text-orange-700" : "text-slate-800"}`}>
        {slot.parentDisplay}
      </span>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span className="text-[11px] text-slate-500 font-medium">
          {slot.mentorsAvailable} open
        </span>
        {isSelected && (
          <span className="ml-auto text-[11px] font-bold text-orange-600">✓ Selected</span>
        )}
      </div>
    </button>
  );
}

export function SlotStep() {
  const {
    parentTz, selectedDate, slots, slotsLoading, slotsError, selectedSlot,
    setSlots, setSlotsLoading, setSlotsError, setSelectedSlot, setStep,
  } = useBookingStore();

  useEffect(() => {
    if (!selectedDate || !parentTz) return;
    setSlotsLoading(true);
    setSlotsError(null);
    setSelectedSlot(null);
    setSlots([]);

    fetchSlots(selectedDate, parentTz)
      .then((res) => setSlots(res.slots))
      .catch((err) => {
        const msg = err?.response?.data?.error ?? "Could not load time slots for this date.";
        setSlotsError(msg);
      })
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, parentTz]);

  const available = slots.filter((s) => s.available);
  const displayDate = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
      })
    : "";

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900">Choose a time slot</h2>
        <p className="text-slate-500 text-sm mt-1.5">
          {displayDate} · Times shown in&nbsp;
          <span className="font-semibold text-orange-600">
            {TIMEZONE_LABELS[parentTz]?.split("—")[0].trim()}
          </span>
        </p>
      </div>

      {slotsLoading ? (
        <Skeleton />
      ) : slotsError ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <p className="font-semibold">Could not load slots</p>
          <p className="text-xs mt-0.5">{slotsError}</p>
          <button
            type="button"
            onClick={() => {
              setSlotsError(null);
              setSlotsLoading(true);
              fetchSlots(selectedDate!, parentTz)
                .then((r) => setSlots(r.slots))
                .catch(() => setSlotsError("Still unable to load slots. Please try again."))
                .finally(() => setSlotsLoading(false));
            }}
            className="mt-3 text-xs font-bold text-rose-700 underline"
          >
            Retry
          </button>
        </div>
      ) : slots.length === 0 ? (
        <div className="p-6 text-center bg-slate-100 rounded-xl text-slate-500 text-sm">
          <p className="text-2xl mb-2">📭</p>
          <p className="font-semibold">No slots available on this date.</p>
          <p className="text-xs mt-1">Try selecting a different date.</p>
        </div>
      ) : (
        <>
          {/* Available count banner */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-emerald-800">
              {available.length} slot{available.length !== 1 ? "s" : ""} available with open mentor seats
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {slots.map((slot) => (
              <SlotCard
                key={slot.utcStart}
                slot={slot}
                isSelected={selectedSlot?.utcStart === slot.utcStart}
                onSelect={() => setSelectedSlot(slot)}
              />
            ))}
          </div>
        </>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep("date")}
          className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!selectedSlot}
          onClick={() => setStep("info")}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-orange-200 text-sm"
        >
          {selectedSlot
            ? `Confirm ${selectedSlot.parentDisplay} →`
            : "Select a slot first"}
        </button>
      </div>
    </div>
  );
}
