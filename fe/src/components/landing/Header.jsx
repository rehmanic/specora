"use client";

import Link from "next/link";

/**
 * The primary navigation header for the landing page.
 * Includes the logo, navigation links, and call-to-action buttons.
 */
export default function Header() {
  return (
    <header className="fixed top-6 left-1/2 z-50 w-[95%] max-w-5xl -translate-x-1/2">
      <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white px-6 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-all duration-300">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[oklch(0.85_0.20_130)]/40 to-emerald-400/40 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"></div>
            <img
              src="/specora-logo.svg"
              alt="Specora"
              className="relative z-10 h-8 w-8 drop-shadow-sm transition-transform duration-300 group-hover:scale-105 md:h-9 md:w-9"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">Specora</span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
          <a href="#features" className="transition-colors hover:text-slate-900">
            Features
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-[oklch(0.85_0.20_130)] px-5 py-3 text-xs font-bold text-[oklch(0.15_0.02_285)] shadow-sm transition-all hover:brightness-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
