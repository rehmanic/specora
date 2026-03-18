"use client";

import Link from "next/link";

/**
 * The primary navigation header for the landing page.
 * Includes the logo, navigation links, and call-to-action buttons.
 */
export default function Header() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="bg-white border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-all duration-300"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[oklch(0.85_0.20_130)]/40 to-emerald-400/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src="/specora-logo.svg"
              alt="Specora"
              className="w-8 h-8 md:w-9 md:h-9 relative z-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
            Specora
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="bg-[oklch(0.85_0.20_130)] text-[oklch(0.15_0.02_285)] text-xs font-bold px-5 py-3 rounded-full hover:brightness-95 transition-all shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
