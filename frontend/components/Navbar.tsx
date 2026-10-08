"use client";

import React from "react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF7A30] to-[#FFB03A] flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-extrabold text-lg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
              Codeyoung<span className="text-[#FF7A30]">.</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
              Live Coding Mentorship
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#booking" className="hover:text-slate-900 transition-colors">Home</a>
          <a href="#courses" className="hover:text-slate-900 transition-colors">Courses</a>
          <a href="#why-us" className="hover:text-slate-900 transition-colors">Why Codeyoung</a>
          <a href="#mentors" className="hover:text-slate-900 transition-colors">Mentors</a>
          <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="hidden sm:inline-flex px-5 py-2 rounded-full border border-orange-300 text-orange-600 font-semibold text-sm hover:bg-orange-50/80 transition-colors"
          >
            Login
          </button>
          <a 
            href="#booking"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF7A30] to-[#FFB03A] text-white font-semibold text-sm shadow-sm hover:opacity-95 transition-opacity"
          >
            Book Free Trial
          </a>
        </div>

      </div>
    </header>
  );
}
