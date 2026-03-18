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
    <div className="group flex flex-col items-center justify-center text-center transition-all duration-500">
      <div className="mb-2 text-3xl font-semibold tracking-tight text-[oklch(0.85_0.20_130)] transition-transform duration-300 group-hover:scale-105 md:text-4xl">
        {value}
      </div>
      <div className="text-[10px] leading-relaxed font-bold tracking-[0.1em] whitespace-nowrap text-slate-400 uppercase md:text-xs md:tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}
