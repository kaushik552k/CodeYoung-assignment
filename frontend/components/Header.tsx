"use client";
import React from "react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-sm shadow-sm shadow-orange-200">
            CY
          </div>
          <div>
            <span className="font-display font-black text-slate-900 text-lg tracking-tight">
              Codeyoung
            </span>
          </div>
        </div>

        {/* Tagline / Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-semibold text-orange-700">Book a Free Trial Class</span>
        </div>

      </div>
    </header>
  );
}
