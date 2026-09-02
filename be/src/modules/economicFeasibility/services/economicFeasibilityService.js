import * as econRepo from "../repositories/economicFeasibilityRepository.js";
import AppError from "../../../utils/AppError.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";
import { runSimulation, computeStatistics } from "./monteCarloEngine.js";

// ─── Config Endpoints ─────────────────────────────────────

export async function getConfig(projectId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    let config = await econRepo.findConfigByProject(resolvedId);

    if (!config) {
        config = {
            project_id: resolvedId,
            hourly_rate: 50,
            currency: "USD",
            num_developers: 1,
        };
    }
    return config;
}

export async function upsertConfig(projectId, data) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { hourly_rate, currency, num_developers } = data;

    if (hourly_rate == null || !currency || num_developers == null) {
        throw new AppError("hourly_rate, currency, and num_developers are required", 400);
    }
    if (hourly_rate <= 0 || num_developers < 1) {
        throw new AppError("hourly_rate must be > 0 and num_developers must be >= 1", 400);
    }

    return await econRepo.upsertConfig(resolvedId, {
        hourly_rate: parseFloat(hourly_rate),
        currency: currency.toUpperCase(),
        num_developers: parseInt(num_developers),
    });
}

// ─── Estimates Endpoints ──────────────────────────────────

export async function getEstimates(projectId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    return await econRepo.findEstimatesByProject(resolvedId, {
        include: {
            requirement: { select: { id: true, title: true, description: true, priority: true } },
        },
        orderBy: { created_at: "desc" },
    });
}

export async function upsertEstimates(projectId, estimates) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    if (!Array.isArray(estimates) || estimates.length === 0) {
        throw new AppError("estimates array is required and must not be empty", 400);
    }

    for (const est of estimates) {
        if (!est.requirement_id || est.optimistic_hours == null || est.most_likely_hours == null || est.pessimistic_hours == null) {
            throw new AppError("Each estimate must have requirement_id, optimistic_hours, most_likely_hours, pessimistic_hours", 400);
        }
        if (est.optimistic_hours < 0 || est.most_likely_hours < 0 || est.pessimistic_hours < 0) {
            throw new AppError("Duration values must be non-negative", 400);
        }
        if (est.optimistic_hours > est.most_likely_hours || est.most_likely_hours > est.pessimistic_hours) {
            throw new AppError("Must satisfy: optimistic ≤ most_likely ≤ pessimistic", 400);
        }
    }

    const parsed = estimates.map((est) => ({
        requirement_id: est.requirement_id,
        optimistic_hours: parseFloat(est.optimistic_hours),
        most_likely_hours: parseFloat(est.most_likely_hours),
        pessimistic_hours: parseFloat(est.pessimistic_hours),
    }));
    const results = await econRepo.upsertEstimatesTransaction(parsed);
    return results.length;
}

// ─── Simulation Endpoint ──────────────────────────────────

export async function simulate(projectId, iterationsInput = 10000) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const config = await econRepo.findConfigByProject(resolvedId);
    if (!config) {
        throw new AppError("Please configure project economic settings first", 400);
    }

    const estimates = await econRepo.findEstimatesByProject(resolvedId);
    if (estimates.length === 0) {
        throw new AppError("No estimates found. Please enter duration estimates for requirements first.", 400);
    }

    const iterations = parseInt(iterationsInput) || 10000;
    if (iterations < 100 || iterations > 100000) {
        throw new AppError("iterations must be between 100 and 100000", 400);
    }

    const startTime = Date.now();
    const { costResults, durationResults } = runSimulation({
        estimates,
        numDevelopers: config.num_developers,
        hourlyRate: config.hourly_rate,
        iterations,
    });

    const costStats = computeStatistics(costResults);
    const durationStats = computeStatistics(durationResults);
    const cycle_time = Date.now() - startTime;

    let totalPertHours = 0;
    estimates.forEach(est => {
        totalPertHours += (est.optimistic_hours + 4 * est.most_likely_hours + est.pessimistic_hours) / 6;
    });

    const totalEffortSM = totalPertHours / 152;
    const estimatedKLOC = totalEffortSM * 1.5;

    const cocomo = {
        organic: {
            effort: 2.4 * Math.pow(estimatedKLOC, 1.05),
            duration: 2.5 * Math.pow(2.4 * Math.pow(estimatedKLOC, 1.05), 0.38)
        },
        semidetached: {
            effort: 3.0 * Math.pow(estimatedKLOC, 1.12),
            duration: 2.5 * Math.pow(3.0 * Math.pow(estimatedKLOC, 1.12), 0.35)
        },
        embedded: {
            effort: 3.6 * Math.pow(estimatedKLOC, 1.20),
            duration: 2.5 * Math.pow(3.6 * Math.pow(estimatedKLOC, 1.20), 0.32)
        }
    };

    return {
        simulation: {
            config: {
                hourly_rate: config.hourly_rate,
                currency: config.currency,
                num_developers: config.num_developers,
                num_requirements: estimates.length,
                iterations,
            },
            cost: costStats,
            duration: durationStats,
            pert: {
                total_hours: totalPertHours,
                duration: totalPertHours / config.num_developers,
                cost: totalPertHours * config.hourly_rate
            },
            cocomo
        },
        cycle_time,
    };
}
