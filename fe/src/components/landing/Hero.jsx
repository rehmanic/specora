"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

/**
 * The Hero section of the landing page.
 * Features a high-impact headline, subtext, and a dashboard visualization.
 */
export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Dark Container with Grid */}
        <div className="bg-[oklch(0.15_0.02_285)] rounded-[2.5rem] pt-20 pb-48 md:pb-64 lg:pb-80 px-6 text-center relative hero-grid">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-medium text-slate-300 mb-10 backdrop-blur-sm shadow-sm hover:bg-white/10 transition-colors cursor-pointer group">
            <Sparkles className="w-3 h-3 text-[oklch(0.85_0.20_130)]" />
            <span className="opacity-80">AI-Powered Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-medium text-white tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto relative z-10">
            Transform Ideas into <br className="hidden md:block" />
            <span className="relative inline-block">Clear Specifications</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm md:text-lg text-slate-300/80 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-light relative z-10">
            Specora streamlines requirements gathering with AI. Collaborate with
            stakeholders, generate precise specs, and bridge the gap between
            vision and development.
          </p>

          {/* Dashboard Mockup (Overlapping - Half In, Half Out) */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-[90%] md:w-full max-w-[75rem] px-4 z-20 transition-all duration-500">
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden group hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.35),0_0_120px_-20px_rgba(20,184,166,0.2)] transition-shadow duration-500">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
