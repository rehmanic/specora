"use client";

/**
 * A visual mockup of the Specora dashboard using a screenshot.
 * Used in the Hero section to demonstrate the platform's UI.
 */
export default function DashboardMockup() {
  return (
    <div className="relative max-h-[400px] w-full overflow-hidden bg-slate-50 md:max-h-[550px] lg:max-h-[650px]">
      <img
        src="/app_preview.png"
        alt="Specora Dashboard Preview"
        className="block h-auto min-h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.01]"
      />
      {/* Subtle Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/[0.05] to-transparent" />
    </div>
  );
}
