"use client";

import React, { useState, useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { fetchSlots, createBooking } from "@/lib/api";
import { SUPPORTED_TIMEZONES, TIMEZONE_LABELS, SupportedTimezone, detectBrowserTimezone } from "@/lib/timezone";
import type { Slot } from "@/lib/shared";

const COURSES = [
  "Coding for Kids (Scratch & Game Design)",
  "Python & Artificial Intelligence",
  "Web Development (HTML, CSS & JavaScript)",
  "Robotics & App Building",
  "Math & Logic Thinking",
];

const AGE_GROUPS = [
  "5 - 7 years (Elementary)",
  "8 - 10 years (Junior)",
  "11 - 13 years (Middle School)",
  "14 - 17 years (High School)",
];

export function BookingForm() {
  const {
    parentTz, setParentTz,
    selectedDate, setSelectedDate,
    selectedSlot, setSelectedSlot,
    slots, setSlots,
    slotsLoading, setSlotsLoading,
    slotsError, setSlotsError,
    parentName, setParentName,
    parentEmail, setParentEmail,
    bookingLoading, setBookingLoading,
    bookingError, setBookingError,
    alternatives, setAlternatives,
    setConfirmedBooking,
  } = useBookingStore();

  const [phone, setPhone] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(AGE_GROUPS[1]);
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);

  // Validation errors
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    childName?: string;
    slot?: string;
  }>({});

  // Initialize timezone on mount
  useEffect(() => {
    if (!parentTz) {
      setParentTz(detectBrowserTimezone());
    }
  }, [parentTz, setParentTz]);

  // Default date to tomorrow if none selected
  useEffect(() => {
    if (!selectedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isoDate = tomorrow.toISOString().split("T")[0];
      setSelectedDate(isoDate);
    }
  }, [selectedDate, setSelectedDate]);

  // Fetch slots whenever date or timezone changes
  useEffect(() => {
    if (selectedDate && parentTz) {
      setSlotsLoading(true);
      setSlotsError(null);
      setSelectedSlot(null);
      fetchSlots(selectedDate, parentTz)
        .then((res) => {
          setSlots(res.slots);
        })
        .catch((err) => {
          setSlotsError(err?.response?.data?.error ?? "Failed to load slots for this date");
          setSlots([]);
        })
        .finally(() => {
          setSlotsLoading(false);
        });
    }
  }, [selectedDate, parentTz, setSlots, setSlotsLoading, setSlotsError, setSelectedSlot]);

  // Validate inputs
  const validateForm = () => {
    const errors: typeof formErrors = {};
    if (!parentName.trim() || parentName.trim().length < 2) {
      errors.name = "Please enter your name";
    }
    if (!parentEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail.trim())) {
      errors.email = "Please enter a valid email address";
    }
    if (!childName.trim()) {
      errors.childName = "Please enter your child's name";
    }
    if (!selectedSlot) {
      errors.slot = "Please select an available time slot";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedSlot) return;

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
      setBookingError(d?.error ?? "Booking request could not be processed. Please try again.", d?.code);
      if (d?.code === "NO_MENTOR_AVAILABLE" && d?.alternatives) {
        setAlternatives(d.alternatives);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div id="booking" className="bg-white rounded-3xl p-7 sm:p-10 border border-slate-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)]">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200/60 mb-4">
        <span>✨</span>
        <span>Free Trial Class</span>
      </div>

      {/* Heading */}
      <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
        Book Your Free Trial Class
      </h2>
      <p className="text-slate-500 text-sm sm:text-base mt-2 mb-8 leading-relaxed">
        Fill in the details below and we&apos;ll schedule a free 40-minute trial session for your child.
      </p>

      {/* Global Booking Error Banner */}
      {bookingError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          <div className="font-bold flex items-center gap-2 mb-1">
            <span>⚠️</span>
            <span>{bookingError}</span>
          </div>
          {alternatives.length > 0 && (
            <div className="mt-3 pt-3 border-t border-rose-200/70">
              <span className="text-xs font-semibold text-rose-700 block mb-2">
                Suggested alternative slots with open mentors:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {alternatives.map((alt) => (
                  <button
                    key={alt.utcStart}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(alt);
                      setBookingError(null);
                      setAlternatives([]);
                    }}
                    className="p-2 text-xs bg-white rounded-lg border border-rose-200 hover:border-orange-500 text-left font-medium text-slate-800 transition-colors"
                  >
                    <div>{alt.parentDisplay}</div>
                    <div className="text-[10px] text-slate-400">{alt.parentDateDisplay}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleBookingSubmit} className="flex flex-col gap-6">

        {/* Section 1: Parent Details */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <span>1. Parent Details</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className={`input-field ${formErrors.name ? "border-rose-400 ring-2 ring-rose-100" : ""}`}
              />
              {formErrors.name && (
                <p className="text-rose-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-orange-500">*</span>
              </label>
              <input
                type="email"
                placeholder="parent@email.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className={`input-field ${formErrors.email ? "border-rose-400 ring-2 ring-rose-100" : ""}`}
              />
              {formErrors.email && (
                <p className="text-rose-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phone Number
            </label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Child Details */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <span>2. Child Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Child&apos;s Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Emma"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className={`input-field ${formErrors.childName ? "border-rose-400 ring-2 ring-rose-100" : ""}`}
              />
              {formErrors.childName && (
                <p className="text-rose-500 text-xs mt-1">{formErrors.childName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Child&apos;s Age <span className="text-orange-500">*</span>
              </label>
              <select
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="select-field cursor-pointer"
              >
                {AGE_GROUPS.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Course & Timing */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <span>3. Course & Timing</span>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Course <span className="text-orange-500">*</span>
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="select-field cursor-pointer"
            >
              {COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Your Timezone <span className="text-orange-500">*</span>
                </label>
                <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-semibold">
                  DST-Safe
                </span>
              </div>
              <select
                value={parentTz}
                onChange={(e) => setParentTz(e.target.value as SupportedTimezone)}
                className="select-field cursor-pointer"
              >
                {SUPPORTED_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {TIMEZONE_LABELS[tz]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Date <span className="text-orange-500">*</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate ?? ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field cursor-pointer"
              />
            </div>
          </div>

          {/* Time Slot Chips */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Select Available Slot <span className="text-orange-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                Displayed in {TIMEZONE_LABELS[parentTz]?.split("—")[0]?.trim() || parentTz}
              </span>
            </div>

            {slotsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : slotsError ? (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
                {slotsError}
              </div>
            ) : slots.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-xs">
                No slots available on this date. Please choose another date.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.utcStart === slot.utcStart;
                  if (!slot.available) {
                    return (
                      <div
                        key={slot.utcStart}
                        className="p-2.5 rounded-xl border border-slate-200/60 bg-slate-50 opacity-40 text-left cursor-not-allowed"
                      >
                        <div className="text-xs font-semibold text-slate-400">{slot.parentDisplay}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Full</div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={slot.utcStart}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        if (formErrors.slot) setFormErrors({ ...formErrors, slot: undefined });
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs font-medium ${
                        isSelected
                          ? "bg-orange-50 border-[#FF7A30] ring-2 ring-orange-200 shadow-sm"
                          : "bg-white border-slate-200 hover:border-orange-400 hover:bg-orange-50/30"
                      }`}
                    >
                      <div className={`font-bold ${isSelected ? "text-orange-950" : "text-slate-800"}`}>
                        {slot.parentDisplay}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-slate-500">
                          {slot.mentorsAvailable} mentor{slot.mentorsAvailable !== 1 ? "s" : ""} open
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {formErrors.slot && (
              <p className="text-rose-500 text-xs mt-1.5">{formErrors.slot}</p>
            )}
          </div>
        </div>

        {/* Submit CTA Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={bookingLoading}
            className="btn-gradient w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-base font-bold shadow-cta"
          >
            {bookingLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Assigning Mentor...
              </span>
            ) : (
              <span>Book Free Trial →</span>
            )}
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-3">
            By booking, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

      </form>
    </div>
  );
}
