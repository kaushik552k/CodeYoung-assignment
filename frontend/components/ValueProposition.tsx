"use client";

import React from "react";

export function ValueProposition() {
  return (
    <div className="flex flex-col gap-6">

      {/* Top Banner Card with Peach-to-Mint pastel gradient */}
      <div className="rounded-3xl p-7 sm:p-8 bg-gradient-to-br from-[#FFF0E6] via-[#FFF8E7] to-[#EAFBF3] border border-orange-100/80 shadow-sm relative overflow-hidden">
        
        {/* Subtle decorative background circle */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-200/20 rounded-full blur-xl pointer-events-none" />

        <h3 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight mb-5">
          Why Try a Free Class?
        </h3>

        <ul className="flex flex-col gap-4 text-slate-700 text-sm font-medium">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs mt-0.5">
              ✓
            </span>
            <span>40-minute live 1-on-1 session with an expert coding mentor</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs mt-0.5">
              ✓
            </span>
            <span>Personalized assessment of your child&apos;s logic & creative skills</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs mt-0.5">
              ✓
            </span>
            <span>No credit card required — 100% free with zero commitments</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs mt-0.5">
              ✓
            </span>
            <span>Choose any course topic & time slot in your local timezone</span>
          </li>
        </ul>
      </div>

      {/* Stats Row (3 white cards) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center">
          <span className="text-amber-400 text-lg mb-1">⭐</span>
          <span className="font-display font-extrabold text-slate-900 text-lg">4.9/5</span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Rating</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center">
          <span className="text-orange-500 text-lg mb-1">👥</span>
          <span className="font-display font-extrabold text-slate-900 text-lg">10K+</span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Students</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center">
          <span className="text-teal-500 text-lg mb-1">🌐</span>
          <span className="font-display font-extrabold text-slate-900 text-lg">50+</span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Countries</span>
        </div>
      </div>

      {/* Testimonial Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-1 text-amber-400 text-sm">
          ★★★★★
        </div>

        <p className="text-slate-600 text-sm italic leading-relaxed">
          &ldquo;The free trial was amazing! My son immediately connected with the mentor and created his first animated game in 40 minutes. Best decision we made!&rdquo;
        </p>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-100 to-amber-100 border border-orange-200/50 flex items-center justify-center text-orange-700 font-bold text-sm">
            SM
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Sarah M.</div>
            <div className="text-xs text-slate-400 font-medium">Parent from USA (New York)</div>
          </div>
        </div>
      </div>

    </div>
  );
}
