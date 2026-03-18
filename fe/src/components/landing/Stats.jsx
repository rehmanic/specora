"use client";

import StatItem from "./StatItem";

/**
 * A section displaying key platform statistics.
 */
export default function Stats() {
  return (
    <section className="bg-[oklch(0.15_0.02_285)] py-20 px-6 mt-64 md:mt-80 lg:mt-96 hero-grid">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8 md:gap-x-16 justify-items-center items-center">
        <StatItem value="10x Faster" label="Time to Specification" />
        <StatItem value="99.2%" label="AI Consistency" />
        <StatItem value="1.5M+" label="Reqs Extracted" />
        <StatItem value="50K+" label="Specs Validated" />
      </div>
    </section>
  );
}
