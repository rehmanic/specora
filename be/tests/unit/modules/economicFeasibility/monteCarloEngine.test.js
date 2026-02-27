import { describe, it, expect } from "vitest";
import {
    samplePERT,
    sampleBeta,
    sampleGamma,
    runSimulation,
    computeStatistics,
} from "../../../../src/modules/economicFeasibility/services/monteCarloEngine.js";

// ─── samplePERT ───────────────────────────────────────────

describe("samplePERT", () => {
    it("returns a value within [optimistic, pessimistic]", () => {
        for (let i = 0; i < 500; i++) {
            const val = samplePERT(2, 5, 10);
            expect(val).toBeGreaterThanOrEqual(2 - 0.01); // small epsilon for float
            expect(val).toBeLessThanOrEqual(10 + 0.01);
        }
    });

    it("returns the exact value when all three estimates are equal", () => {
        for (let i = 0; i < 100; i++) {
            expect(samplePERT(5, 5, 5)).toBe(5);
        }
    });

    it("distribution mean approximates the PERT mean", () => {
        const o = 2, m = 5, p = 12;
        const expectedMean = (o + 4 * m + p) / 6;
        const N = 20000;
        let sum = 0;
        for (let i = 0; i < N; i++) {
            sum += samplePERT(o, m, p);
        }
        const actualMean = sum / N;
        // Should be within 5% of expected
        expect(Math.abs(actualMean - expectedMean)).toBeLessThan(expectedMean * 0.05);
    });

    it("handles edge case: optimistic equals pessimistic", () => {
        expect(samplePERT(7, 7, 7)).toBe(7);
    });
});

// ─── sampleBeta ───────────────────────────────────────────

describe("sampleBeta", () => {
    it("returns values in [0, 1]", () => {
        for (let i = 0; i < 500; i++) {
            const val = sampleBeta(2, 5);
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThanOrEqual(1);
        }
    });

    it("mean approximates alpha / (alpha + beta)", () => {
        const alpha = 2, beta = 5;
        const expected = alpha / (alpha + beta);
        const N = 10000;
        let sum = 0;
        for (let i = 0; i < N; i++) {
            sum += sampleBeta(alpha, beta);
        }
        const actual = sum / N;
        expect(Math.abs(actual - expected)).toBeLessThan(0.02);
    });
});

// ─── sampleGamma ──────────────────────────────────────────

describe("sampleGamma", () => {
    it("returns positive values", () => {
        for (let i = 0; i < 500; i++) {
            expect(sampleGamma(2)).toBeGreaterThan(0);
        }
    });

    it("works for shape < 1", () => {
        for (let i = 0; i < 200; i++) {
            expect(sampleGamma(0.5)).toBeGreaterThan(0);
        }
    });
});

// ─── runSimulation ────────────────────────────────────────

describe("runSimulation", () => {
    const estimates = [
        { optimistic_hours: 4, most_likely_hours: 8, pessimistic_hours: 16 },
        { optimistic_hours: 2, most_likely_hours: 4, pessimistic_hours: 8 },
        { optimistic_hours: 10, most_likely_hours: 20, pessimistic_hours: 40 },
    ];

    it("returns the correct number of iterations", () => {
        const { costResults, durationResults } = runSimulation({
            estimates,
            numDevelopers: 2,
            hourlyRate: 50,
            iterations: 500,
        });
        expect(costResults).toHaveLength(500);
        expect(durationResults).toHaveLength(500);
    });

    it("all cost results are positive", () => {
        const { costResults } = runSimulation({
            estimates,
            numDevelopers: 1,
            hourlyRate: 100,
            iterations: 1000,
        });
        costResults.forEach((c) => expect(c).toBeGreaterThan(0));
    });

    it("more developers = shorter duration (on average)", () => {
        const run1 = runSimulation({ estimates, numDevelopers: 1, hourlyRate: 50, iterations: 5000 });
        const run3 = runSimulation({ estimates, numDevelopers: 3, hourlyRate: 50, iterations: 5000 });

        const avgDur1 = run1.durationResults.reduce((a, b) => a + b, 0) / 5000;
        const avgDur3 = run3.durationResults.reduce((a, b) => a + b, 0) / 5000;

        expect(avgDur3).toBeLessThan(avgDur1);
    });

    it("cost is independent of developer count (total effort stays same)", () => {
        const run1 = runSimulation({ estimates, numDevelopers: 1, hourlyRate: 50, iterations: 10000 });
        const run3 = runSimulation({ estimates, numDevelopers: 3, hourlyRate: 50, iterations: 10000 });

        const avgCost1 = run1.costResults.reduce((a, b) => a + b, 0) / 10000;
        const avgCost3 = run3.costResults.reduce((a, b) => a + b, 0) / 10000;

        // Costs should be similar (within 5%) since total effort is the same
        expect(Math.abs(avgCost1 - avgCost3) / avgCost1).toBeLessThan(0.05);
    });
});

// ─── computeStatistics ────────────────────────────────────

describe("computeStatistics", () => {
    it("computes correct stats for known data", () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const stats = computeStatistics(data);

        expect(stats.mean).toBe(5.5);
        expect(stats.median).toBe(5.5);
        expect(stats.min).toBe(1);
        expect(stats.max).toBe(10);
        expect(stats.p50).toBe(5);
        expect(stats.p90).toBe(9);
    });

    it("returns histogram with correct total count", () => {
        const data = Array.from({ length: 1000 }, (_, i) => i);
        const stats = computeStatistics(data, 20);

        const totalCount = stats.histogram.reduce((sum, bin) => sum + bin.count, 0);
        expect(totalCount).toBe(1000);
        expect(stats.histogram).toHaveLength(20);
    });

    it("returns cumulative distribution ending at 1.0", () => {
        const data = Array.from({ length: 500 }, () => Math.random() * 100);
        const stats = computeStatistics(data);

        const lastPoint = stats.cumulative[stats.cumulative.length - 1];
        expect(lastPoint.probability).toBe(1);
    });

    it("handles single-value data", () => {
        const stats = computeStatistics([42, 42, 42, 42]);
        expect(stats.mean).toBe(42);
        expect(stats.stdDev).toBe(0);
    });
});
