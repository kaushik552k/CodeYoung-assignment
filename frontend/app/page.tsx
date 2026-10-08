"use client";
import React from "react";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { TimezoneStep } from "@/components/TimezoneStep";
import { DateStep } from "@/components/DateStep";
import { SlotStep } from "@/components/SlotStep";
import { InfoStep } from "@/components/InfoStep";
import { ConfirmationStep } from "@/components/ConfirmationStep";
import { useBookingStore } from "@/store/bookingStore";

const FEATURES = [
  { icon: "🌍", title: "Live 1-on-1 Sessions", desc: "60 minutes with a dedicated mentor" },
  { icon: "🕐", title: "Your Timezone", desc: "Slots displayed in your local time, DST-safe" },
  { icon: "🔒", title: "No Credit Card", desc: "100% free trial, zero obligations" },
  { icon: "👨‍🏫", title: "Expert Mentors", desc: "10 experienced coding educators" },
];

export default function HomePage() {
  const { step } = useBookingStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">

          {/* ── Left: Wizard Card ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Card header */}
            {step !== "confirmed" && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 pt-6 pb-5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
                  ✨ Free Trial
                </div>
                <h1 className="text-white font-display font-bold text-xl sm:text-2xl leading-snug">
                  Book Your Free Coding Trial Class
                </h1>
                <p className="text-white/80 text-xs sm:text-sm mt-1">
                  4 quick steps · Instant confirmation · No payment required
                </p>
              </div>
            )}

            {/* Step indicator */}
            {step !== "confirmed" && (
              <div className="px-6 pt-5">
                <StepIndicator />
              </div>
            )}

            {/* Step content */}
            <div className="px-6 pb-8 pt-2">
              {step === "timezone"  && <TimezoneStep />}
              {step === "date"      && <DateStep />}
              {step === "slot"      && <SlotStep />}
              {step === "info"      && <InfoStep />}
              {step === "confirmed" && (
                <div className="pt-8">
                  <ConfirmationStep />
                </div>
              )}
            </div>

          </div>

          {/* ── Right: Feature sidebar ── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">

            {/* What to expect */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-display font-bold text-slate-900 text-base mb-4">
                What to expect
              </h3>
              <div className="flex flex-col gap-3.5">
                {FEATURES.map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{f.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{f.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-display font-bold text-slate-900 text-base mb-4">
                How it works
              </h3>
              <ol className="flex flex-col gap-3">
                {[
                  "Select your timezone",
                  "Pick a convenient date",
                  "Choose an available slot",
                  "Share your details & confirm",
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-xs text-slate-600">{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Trust badges */}
            <div className="bg-slate-900 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">★★★★★</span>
                <span className="text-white text-xs font-bold">4.9/5 from 10,000+ parents</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed italic">
                &ldquo;My daughter went from zero to building her first game in just 3 sessions. The mentor was incredibly patient and encouraging!&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold">RS</div>
                <div>
                  <div className="text-white text-xs font-semibold">Ritu S.</div>
                  <div className="text-slate-400 text-[11px]">Parent · Mumbai</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>© 2026 Codeyoung. All rights reserved.</span>
          <span>🔒 Secure booking · COPPA & GDPR compliant</span>
        </div>
      </footer>

    </div>
  );
}
