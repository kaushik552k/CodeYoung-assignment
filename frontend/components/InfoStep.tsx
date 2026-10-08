"use client";
import React, { useState } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { TIMEZONE_LABELS } from "@/lib/timezone";
import { createBooking } from "@/lib/api";
import type { Slot } from "@/lib/shared";

const CHILD_AGES = [
  "5 – 7 years",
  "8 – 10 years",
  "11 – 13 years",
  "14 – 17 years",
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function AlternativeSlot({ slot, onPick }: { slot: Slot; onPick: (s: Slot) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPick(slot)}
      className="flex flex-col gap-0.5 p-2.5 rounded-lg border border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 text-left text-xs transition-colors"
    >
      <span className="font-bold text-slate-800">{slot.parentDisplay}</span>
      <span className="text-slate-400">{slot.parentDateDisplay}</span>
      <span className="text-emerald-600 font-semibold">{slot.mentorsAvailable} available</span>
    </button>
  );
}

export function InfoStep() {
  const {
    parentTz, selectedSlot, selectedDate,
    parentName, setParentName,
    parentEmail, setParentEmail,
    childName, setChildName,
    childAge, setChildAge,
    bookingLoading, bookingError,
    alternatives,
    setBookingLoading, setBookingError, setAlternatives,
    setConfirmedBooking, setSelectedSlot, setStep,
  } = useBookingStore();

  const [errors, setErrors] = useState<{
    parentName?: string;
    parentEmail?: string;
    childName?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!parentName.trim() || parentName.trim().length < 2)
      e.parentName = "Please enter your full name (at least 2 characters)";
    if (!isValidEmail(parentEmail))
      e.parentEmail = "Please enter a valid email address";
    if (!childName.trim() || childName.trim().length < 2)
      e.childName = "Please enter your child's name";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedSlot) return;

    setBookingLoading(true);
    setBookingError(null);
    setAlternatives([]);

    try {
      const res = await createBooking({
        parentName: parentName.trim(),
        parentEmail: parentEmail.trim(),
        parentTz,
        slotUtc: selectedSlot.utcStart,
      });
      setConfirmedBooking(res.booking);
    } catch (err: any) {
      const d = err?.response?.data;
      setBookingError(
        d?.error ?? "Booking failed. Please try again.",
        d?.code,
      );
      if (d?.code === "NO_MENTOR_AVAILABLE" && d?.alternatives) {
        setAlternatives(d.alternatives);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const slotDisplay = selectedSlot
    ? `${selectedSlot.parentDisplay} · ${selectedSlot.parentDateDisplay}`
    : "";

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900">Your details</h2>
        <p className="text-slate-500 text-sm mt-1.5">
          Almost there! Fill in your info and we&apos;ll confirm your trial session.
        </p>
      </div>

      {/* Booking summary pill */}
      {selectedSlot && (
        <div className="flex items-center gap-3 p-3.5 bg-orange-50 border border-orange-200 rounded-xl">
          <span className="text-orange-500 text-xl">🕐</span>
          <div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Selected slot</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">{slotDisplay}</div>
          </div>
          <button
            type="button"
            onClick={() => setStep("slot")}
            className="ml-auto text-xs text-orange-600 font-semibold underline"
          >
            Change
          </button>
        </div>
      )}

      {/* Error banner */}
      {bookingError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
          <p className="font-bold">⚠️ {bookingError}</p>
          {alternatives.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-rose-700 mb-2">
                These slots still have availability:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {alternatives.map((alt) => (
                  <AlternativeSlot
                    key={alt.utcStart}
                    slot={alt}
                    onPick={(s) => {
                      setSelectedSlot(s);
                      setBookingError(null);
                      setAlternatives([]);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

        {/* ── Parent section ── */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Parent Information</p>
          <div className="flex flex-col gap-4">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Your Full Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Dutta"
                autoComplete="name"
                value={parentName}
                onChange={(e) => {
                  setParentName(e.target.value);
                  if (errors.parentName) setErrors((prev) => ({ ...prev, parentName: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all
                  ${errors.parentName
                    ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/30"
                    : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white"
                  }`}
              />
              {errors.parentName && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.parentName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-orange-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. priya@gmail.com"
                autoComplete="email"
                value={parentEmail}
                onChange={(e) => {
                  setParentEmail(e.target.value);
                  if (errors.parentEmail) setErrors((prev) => ({ ...prev, parentEmail: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all
                  ${errors.parentEmail
                    ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/30"
                    : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white"
                  }`}
              />
              {errors.parentEmail && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.parentEmail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Child section ── */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Child Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Child&apos;s Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Emma"
                autoComplete="off"
                value={childName}
                onChange={(e) => {
                  setChildName(e.target.value);
                  if (errors.childName) setErrors((prev) => ({ ...prev, childName: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all
                  ${errors.childName
                    ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/30"
                    : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white"
                  }`}
              />
              {errors.childName && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.childName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Child&apos;s Age Group
              </label>
              <select
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
              >
                {CHILD_AGES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Timezone + slot info confirmation */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Booking summary: </span>
          {slotDisplay} · Timezone: {TIMEZONE_LABELS[parentTz]?.split("—")[0].trim()}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => setStep("slot")}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={bookingLoading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-orange-200 text-sm flex items-center justify-center gap-2"
          >
            {bookingLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Finding your mentor…
              </>
            ) : (
              "Confirm Booking →"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
