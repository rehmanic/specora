"use client";

import Link from "next/link";

/**
 * The Footer section of the landing page.
 * Includes a CTA section and the actual links footer.
 *
 * @param {Object} props
 * @param {Function} props.setActiveModal - Function to set which modal (terms/privacy) should be active.
 */
export default function Footer({ setActiveModal }) {
  return (
    <div className="mt-12 mb-4 rounded-t-3xl bg-[oklch(0.15_0.02_285)] px-4 pt-12 pb-4 md:mx-4 md:rounded-3xl">
      {/* CTA */}
      <div className="mx-auto mb-16 flex max-w-7xl flex-col items-center justify-between border-b border-white/10 px-6 pb-12 md:flex-row">
        <h2 className="text-2xl font-medium text-white md:text-3xl">
          Ready to Transform Your <br /> Requirements Process?
        </h2>
        <div className="mt-6 flex gap-4 md:mt-0">
          <Link
            href="/login"
            className="rounded-full bg-[oklch(0.85_0.20_130)] px-6 py-2.5 text-sm font-semibold text-[oklch(0.15_0.02_285)] transition-all hover:brightness-95"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Links */}
      <footer className="text-sm text-slate-400">
        <div className="mx-auto mb-12 grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <div className="group mb-6 flex cursor-default items-center gap-3">
              <img
                src="/specora-logo.svg"
                alt="Specora Logo"
                className="h-8 w-8 opacity-90 transition-opacity group-hover:opacity-100"
              />
              <span className="text-xl font-bold tracking-tight text-white">Specora</span>
            </div>
            <p className="mb-4 max-w-xs text-xs leading-relaxed">
              AI-powered requirements engineering platform. Collaborate, communicate, and create better software
              specifications.
            </p>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-4 text-[10px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} Specora. All rights reserved.</p>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveModal("terms")}
              className="cursor-pointer transition-colors hover:text-white"
            >
              Terms
            </button>
            <button
              onClick={() => setActiveModal("privacy")}
              className="cursor-pointer transition-colors hover:text-white"
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
