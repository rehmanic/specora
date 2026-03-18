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
    <div className="bg-[oklch(0.15_0.02_285)] px-4 pb-4 pt-12 md:mx-4 rounded-t-3xl md:rounded-3xl mt-12 mb-4">
      {/* CTA */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 mb-16 pb-12 border-b border-white/10">
        <h2 className="text-2xl md:text-3xl font-medium text-white">
          Ready to Transform Your <br /> Requirements Process?
        </h2>
        <div className="flex gap-4 mt-6 md:mt-0">
          <Link
            href="/login"
            className="bg-[oklch(0.85_0.20_130)] text-[oklch(0.15_0.02_285)] px-6 py-2.5 rounded-full text-sm font-semibold hover:brightness-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Links */}
      <footer className="text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6 group cursor-default">
              <img
                src="/specora-logo.svg"
                alt="Specora Logo"
                className="w-8 h-8 opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Specora
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs mb-4">
              AI-powered requirements engineering platform. Collaborate,
              communicate, and create better software specifications.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] text-slate-500 pb-4">
          <p>
            &copy; {new Date().getFullYear()} Specora. All rights reserved.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveModal("terms")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => setActiveModal("privacy")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
