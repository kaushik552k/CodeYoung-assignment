"use client";

import React, { useState } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { buildGoogleCalendarLink } from "@/lib/timezone";

export function BookingConfirmation() {
  const { confirmedBooking, reset } = useBookingStore();
  const [copied, setCopied] = useState(false);

  if (!confirmedBooking) return null;

  const gcalLink = buildGoogleCalendarLink({
    title: "Codeyoung 1-on-1 Free Trial Coding Class",
    description: `Your trial coding class with ${confirmedBooking.mentorName}.\n\nJoin Live Session: ${confirmedBooking.classLink}\n\nPlease have a laptop/computer with Chrome ready.`,
    utcStart: confirmedBooking.slotUtc,
    durationMinutes: 60,
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(confirmedBooking.classLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-7 sm:p-10 border border-slate-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Success Hero Header */}
      <div className="text-center flex flex-col items-center gap-3 pb-2 border-b border-slate-100">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 text-2xl shadow-sm">
          ✓
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          You&apos;re All Set!
        </h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Your free trial session is confirmed. We&apos;ve assigned your dedicated Codeyoung mentor!
        </p>
      </div>

      {/* Confirmation Details Card */}
      <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70 flex flex-col gap-4 text-sm">
        
        {/* Parent Local Time */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
            🕒
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Your Local Time
            </div>
            <div className="font-bold text-slate-900 text-base">
              {confirmedBooking.parentDisplay}
            </div>
            <div className="text-xs text-slate-500">
              Timezone: {confirmedBooking.parentTz}
            </div>
          </div>
        </div>

        {/* Assigned Mentor & Mentor IST Time */}
        <div className="flex items-start gap-3 pt-3 border-t border-slate-200/60">
          <div className="w-8 h-8 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
            👨‍🏫
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Mentor
            </div>
            <div className="font-bold text-slate-900">
              {confirmedBooking.mentorName}
            </div>
            <div className="text-xs text-slate-500">
              Mentor schedule: {confirmedBooking.mentorDisplay}
            </div>
          </div>
        </div>

        {/* Live Class Meeting Link */}
        <div className="flex items-start gap-3 pt-3 border-t border-slate-200/60">
          <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
            🔗
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Class Meeting Link
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={confirmedBooking.classLink}
                className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg text-slate-700 w-full font-mono select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
              >
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href={gcalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gradient flex-1 py-3.5 px-4 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
        >
          <span>📅 Add to Google Calendar</span>
        </a>

        <button
          type="button"
          onClick={() => reset()}
          className="px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors text-center"
        >
          Book Another Session
        </button>
      </div>

    </div>
  );
}
