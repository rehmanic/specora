"use client";

/**
 * A statistics display item with an animated value and label.
 * 
 * @param {Object} props
 * @param {string} props.value - The statistic value (e.g., "10K+").
 * @param {string} props.label - The label for the statistic (e.g., "Specs Generated").
 */
export default function StatItem({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center text-center group transition-all duration-500">
      <div className="text-3xl md:text-4xl font-semibold text-[oklch(0.85_0.20_130)] tracking-tight mb-2 group-hover:scale-105 transition-transform duration-300">
        {value}
      </div>
      <div className="whitespace-nowrap text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] leading-relaxed">
        {label}
      </div>
    </div>
  );
}
