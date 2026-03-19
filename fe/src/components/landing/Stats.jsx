"use client";

import StatItem from "./StatItem";

/**
 * A section displaying key platform statistics.
 */
export default function Stats() {
  return (
    <section className="hero-grid mt-64 bg-[oklch(0.15_0.02_285)] px-6 py-20 md:mt-80 lg:mt-96">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center justify-items-center gap-x-8 gap-y-16 sm:grid-cols-2 md:gap-x-16 lg:grid-cols-4">
        <StatItem value="10x Faster" label="Time to Specification" />
        <StatItem value="99.2%" label="AI Consistency" />
        <StatItem value="85%" label="Less Rework" />
        <StatItem value="60%" label="Faster Discovery" />
      </div>
    </section>
  );
}
