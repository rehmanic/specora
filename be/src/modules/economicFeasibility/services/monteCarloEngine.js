/**
 * Monte Carlo Simulation Engine for Economic Feasibility
 *
 * Uses PERT (Beta) distribution sampling to model uncertainty
 * in requirement duration estimates and produce probabilistic
 * cost/schedule forecasts.
 */

/**
 * Sample from a PERT (modified Beta) distribution.
 * PERT uses a weighted most-likely value (lambda=4 by default).
 *
 * @param {number} optimistic  - Best-case duration (hours)
 * @param {number} mostLikely  - Most likely duration (hours)
 * @param {number} pessimistic - Worst-case duration (hours)
 * @param {number} lambda      - Weight for most likely value (default 4)
 * @returns {number} A random sample from the PERT distribution
 */
export function samplePERT(optimistic, mostLikely, pessimistic, lambda = 4) {
    if (optimistic === pessimistic) return optimistic;

    // PERT mean
    const mean = (optimistic + lambda * mostLikely + pessimistic) / (lambda + 2);

    // Derive alpha and beta for the Beta distribution
    // Using the PERT parameterization
    const range = pessimistic - optimistic;
    if (range === 0) return optimistic;

    const alpha = 1 + lambda * ((mean - optimistic) / range);
    const beta = 1 + lambda * ((pessimistic - mean) / range);

    // Sample from Beta(alpha, beta) using the Jöhnk algorithm via gamma variates
    const betaSample = sampleBeta(alpha, beta);

    // Scale to [optimistic, pessimistic]
    return optimistic + betaSample * range;
}

/**
 * Sample from a Beta(alpha, beta) distribution using the
 * ratio of Gamma variates method.
 *
 * @param {number} alpha - Shape parameter alpha > 0
 * @param {number} beta  - Shape parameter beta > 0
 * @returns {number} A sample in [0, 1]
 */
export function sampleBeta(alpha, beta) {
    const x = sampleGamma(alpha);
    const y = sampleGamma(beta);
    return x / (x + y);
}

/**
 * Sample from a Gamma(shape, 1) distribution using
 * Marsaglia and Tsang's method.
 *
 * @param {number} shape - Shape parameter > 0
 * @returns {number} A gamma-distributed random variate
 */
export function sampleGamma(shape) {
    if (shape < 1) {
        // Boost: Gamma(shape) = Gamma(shape+1) * U^(1/shape)
        return sampleGamma(shape + 1) * Math.pow(Math.random(), 1 / shape);
    }

    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);

    while (true) {
        let x, v;
        do {
            x = randn();
            v = 1 + c * x;
        } while (v <= 0);

        v = v * v * v;
        const u = Math.random();
        const x2 = x * x;

        if (u < 1 - 0.0331 * x2 * x2) return d * v;
        if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) return d * v;
    }
}

/**
 * Generate a standard normal random variate using Box-Muller transform.
 * @returns {number}
 */
function randn() {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Run a Monte Carlo simulation.
 *
 * @param {Object} params
 * @param {Array<{optimistic_hours: number, most_likely_hours: number, pessimistic_hours: number}>} params.estimates
 * @param {number} params.numDevelopers   - Number of parallel developers
 * @param {number} params.hourlyRate      - Cost per developer-hour
 * @param {number} [params.iterations=10000] - Number of simulation iterations
 * @returns {{ costResults: number[], durationResults: number[] }}
 */
export function runSimulation({ estimates, numDevelopers, hourlyRate, iterations = 10000 }) {
    const costResults = new Array(iterations);
    const durationResults = new Array(iterations);

    for (let i = 0; i < iterations; i++) {
        let totalHours = 0;

        for (const est of estimates) {
            totalHours += samplePERT(
                est.optimistic_hours,
                est.most_likely_hours,
                est.pessimistic_hours
            );
        }

        // Parallel work: divide total hours by number of developers
        const effectiveDuration = totalHours / Math.max(1, numDevelopers);
        const cost = totalHours * hourlyRate;

        durationResults[i] = effectiveDuration;
        costResults[i] = cost;
    }

    return { costResults, durationResults };
}

/**
 * Compute descriptive statistics and histogram from simulation results.
 *
 * @param {number[]} values - Array of simulation results
 * @param {number} [numBins=30] - Number of histogram bins
 * @returns {Object} Statistics object
 */
export function computeStatistics(values, numBins = 30) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;

    const sum = sorted.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;
    const median = n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];

    const variance = sorted.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);

    const percentile = (p) => {
        const idx = Math.ceil((p / 100) * n) - 1;
        return sorted[Math.max(0, Math.min(idx, n - 1))];
    };

    // Histogram bins
    const min = sorted[0];
    const max = sorted[n - 1];
    const binWidth = (max - min) / numBins || 1;
    const histogram = [];

    for (let i = 0; i < numBins; i++) {
        const binStart = min + i * binWidth;
        const binEnd = binStart + binWidth;
        const count = sorted.filter(
            (v) => v >= binStart && (i === numBins - 1 ? v <= binEnd : v < binEnd)
        ).length;
        histogram.push({
            binStart: Math.round(binStart * 100) / 100,
            binEnd: Math.round(binEnd * 100) / 100,
            count,
            frequency: Math.round((count / n) * 10000) / 10000,
        });
    }

    // Cumulative distribution for S-curve
    const cumulativePoints = 50;
    const cumulative = [];
    for (let i = 0; i < cumulativePoints; i++) {
        const threshold = min + ((max - min) * i) / (cumulativePoints - 1);
        const countBelow = sorted.filter((v) => v <= threshold).length;
        cumulative.push({
            value: Math.round(threshold * 100) / 100,
            probability: Math.round((countBelow / n) * 10000) / 10000,
        });
    }

    return {
        mean: Math.round(mean * 100) / 100,
        median: Math.round(median * 100) / 100,
        stdDev: Math.round(stdDev * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        p10: Math.round(percentile(10) * 100) / 100,
        p50: Math.round(percentile(50) * 100) / 100,
        p80: Math.round(percentile(80) * 100) / 100,
        p90: Math.round(percentile(90) * 100) / 100,
        p95: Math.round(percentile(95) * 100) / 100,
        histogram,
        cumulative,
    };
}
