"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="bg-[#181E2E] text-slate-300 mt-20 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7A30] to-[#FFB03A] flex items-center justify-center text-white font-extrabold text-sm">
                CY
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                Codeyoung<span className="text-[#FF7A30]">.</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Empowering kids aged 5–17 worldwide with future-ready coding, logic, and creativity through interactive 1-on-1 live mentoring.
            </p>

            <div className="flex flex-col gap-1.5 text-xs text-slate-400 mt-2">
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>contact@codeyoung.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Bengaluru, India • Teaching Globally across 50+ Countries</span>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="flex flex-col gap-3">
            <div className="text-white font-bold text-sm tracking-wide">Courses</div>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li><a href="#booking" className="hover:text-white transition-colors">Coding for Kids</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">Scratch & Animation</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">Python for Beginners</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">AI & Machine Learning</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">Web Development</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <div className="text-white font-bold text-sm tracking-wide">Company</div>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#mentors" className="hover:text-white transition-colors">Our Mentors</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Parent Reviews</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-3">
            <div className="text-white font-bold text-sm tracking-wide">Support</div>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#refund" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Codeyoung. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>COPPA & GDPR Compliant • Child-Safe Certified Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
