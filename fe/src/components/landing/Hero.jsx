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
    <section className="px-4 pt-32 pb-20 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Dark Container with Grid */}
        <div className="hero-grid relative rounded-[2.5rem] bg-[oklch(0.15_0.02_285)] px-6 pt-20 pb-48 text-center md:pb-64 lg:pb-80">
          {/* Badge */}
          <div className="group mb-10 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium text-slate-300 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/10">
            <Sparkles className="h-3 w-3 text-[oklch(0.85_0.20_130)]" />
            <span className="opacity-80">AI-Powered Platform</span>
          </div>

          {/* Headline */}
          <h1 className="relative z-10 mx-auto mb-6 max-w-5xl text-5xl leading-[1.1] font-medium tracking-tight text-white md:text-6xl lg:text-[4.5rem]">
            Transform Ideas into <br className="hidden md:block" />
            <span className="relative inline-block">Clear Specifications</span>
          </h1>

          {/* Subtext */}
          <p className="relative z-10 mx-auto mb-8 max-w-2xl text-sm leading-relaxed font-light text-slate-300/80 md:mb-12 md:text-lg">
            Specora streamlines requirements gathering with AI. Collaborate with stakeholders, generate precise specs,
            and bridge the gap between vision and development.
          </p>

          {/* Dashboard Mockup (Overlapping - Half In, Half Out) */}
          <div className="absolute bottom-0 left-1/2 z-20 w-[90%] max-w-[75rem] -translate-x-1/2 translate-y-1/2 transform px-4 transition-all duration-500 md:w-full">
            <div className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-shadow duration-500 hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.35),0_0_120px_-20px_rgba(20,184,166,0.2)]">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
