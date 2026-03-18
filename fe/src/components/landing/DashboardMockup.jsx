"use client";

/**
 * A visual mockup of the Specora dashboard using a screenshot.
 * Used in the Hero section to demonstrate the platform's UI.
 */
export default function DashboardMockup() {
  return (
    <div className="relative w-full max-h-[400px] md:max-h-[550px] lg:max-h-[650px] overflow-hidden bg-slate-50">
      <img
        src="/app_preview.png"
        alt="Specora Dashboard Preview"
        className="w-full h-auto min-h-full object-cover object-top block hover:scale-[1.01] transition-transform duration-700"
      />
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/[0.05] to-transparent pointer-events-none" />
    </div>
  );
}
