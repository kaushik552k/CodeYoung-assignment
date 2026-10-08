"use client";
import React, { useState } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { buildGoogleCalendarLink } from "@/lib/timezone";

export function ConfirmationStep() {
  const { confirmedBooking, reset } = useBookingStore();
  const [copied, setCopied] = useState(false);

  if (!confirmedBooking) return null;

  const gcalLink = buildGoogleCalendarLink({
    title: "Codeyoung Free Trial Coding Class",
    description:
      `Your 60-minute trial coding class with ${confirmedBooking.mentorName}.\n\n` +
      `Join the live session here: ${confirmedBooking.classLink}\n\n` +
      `Please have a laptop/PC with Chrome browser ready.`,
    utcStart: confirmedBooking.slotUtc,
    durationMinutes: 60,
  });

  function copyLink() {
    navigator.clipboard.writeText(confirmedBooking!.classLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="animate-slide-up flex flex-col gap-6">

      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3 pb-6 border-b border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-green-100 border border-green-300 flex items-center justify-center text-2xl shadow-sm">
          🎉
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Booking Confirmed!
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 max-w-sm">
            You&apos;re all set, {confirmedBooking.parentName.split(" ")[0]}! Your trial class has been confirmed with a dedicated Codeyoung mentor.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 border border-green-300 text-xs font-bold text-green-800">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          CONFIRMED · #{confirmedBooking.id.slice(-8).toUpperCase()}
        </div>
      </div>

      {/* Details grid */}
      <div className="flex flex-col gap-3">

        {/* Parent's local time */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
          <span className="text-xl mt-0.5">🕐</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-orange-700 mb-0.5">Your Local Time</div>
            <div className="text-base font-bold text-slate-900">{confirmedBooking.parentDisplay}</div>
            <div className="text-xs text-slate-500 mt-0.5">Timezone: {confirmedBooking.parentTz}</div>
          </div>
        </div>

        {/* Mentor info */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
          <span className="text-xl mt-0.5">👨‍🏫</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-0.5">Your Mentor</div>
            <div className="text-base font-bold text-slate-900">{confirmedBooking.mentorName}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Mentor&apos;s time: {confirmedBooking.mentorDisplay} (IST)
            </div>
          </div>
        </div>

        {/* Class link */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            🔗 Live Class Link
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 truncate font-mono select-all">
              {confirmedBooking.classLink}
            </code>
            <button
              type="button"
              onClick={copyLink}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                copied
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Keep this link safe — you&apos;ll need it to join your session. A confirmation email has also been noted for{" "}
            <span className="font-semibold">{confirmedBooking.parentEmail}</span>.
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href={gcalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-200 transition-colors"
        >
          📅 Add to Google Calendar
        </a>
        <button
          type="button"
          onClick={reset}
          className="px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Book Another
        </button>
      </div>

      {/* Tip */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
        <p className="font-bold mb-0.5">📌 Before your class</p>
        <p>Have a laptop or computer with Chrome browser ready. No software installation needed — the class runs entirely in your browser.</p>
      </div>

    </div>
  );
}
