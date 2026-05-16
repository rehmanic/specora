import prisma from "../../../config/db/prismaClient.js";
import { runSimulation, computeStatistics } from "./services/monteCarloEngine.js";

// ─── Helpers ──────────────────────────────────────────────

/**
 * Resolve a projectId that may be a UUID or a slug.
 */
async function resolveProjectId(projectId) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
    if (isUuid) return projectId;

    const project = await prisma.project.findFirst({
        where: { slug: projectId },
        select: { id: true },
    });
    return project?.id ?? null;
}

// ─── Config Endpoints ─────────────────────────────────────

/**
 * GET /api/economic-feasibility/config/:projectId
 * Retrieve the economic config for a project (or defaults).
 */
export const getConfig = async (req, res) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        let config = await prisma.economic_config.findUnique({
            where: { project_id: resolvedId },
        });

        // Return defaults if no config saved yet
        if (!config) {
            config = {
                project_id: resolvedId,
                hourly_rate: 50,
                currency: "USD",
                num_developers: 1,
            };
        }

        res.status(200).json({ message: "Config fetched successfully", config });
    } catch (error) {
        console.error("Error fetching economic config:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * PUT /api/economic-feasibility/config/:projectId
 * Create or update the economic config for a project.
 */
export const upsertConfig = async (req, res) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { hourly_rate, currency, num_developers } = req.body;

        if (hourly_rate == null || !currency || num_developers == null) {
            return res.status(400).json({ message: "hourly_rate, currency, and num_developers are required" });
        }

        if (hourly_rate <= 0 || num_developers < 1) {
            return res.status(400).json({ message: "hourly_rate must be > 0 and num_developers must be >= 1" });
        }

        const config = await prisma.economic_config.upsert({
            where: { project_id: resolvedId },
            update: {
                hourly_rate: parseFloat(hourly_rate),
                currency: currency.toUpperCase(),
                num_developers: parseInt(num_developers),
                updated_at: new Date(),
            },
            create: {
                project_id: resolvedId,
                hourly_rate: parseFloat(hourly_rate),
                currency: currency.toUpperCase(),
                num_developers: parseInt(num_developers),
            },
        });

        res.status(200).json({ message: "Config saved successfully", config });
    } catch (error) {
        console.error("Error saving economic config:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ─── Estimates Endpoints ──────────────────────────────────

/**
 * GET /api/economic-feasibility/estimates/:projectId
 * Get all economic estimates for a project's requirements.
 */
export const getEstimates = async (req, res) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const estimates = await prisma.economic_estimate.findMany({
            where: {
                requirement: { project_id: resolvedId },
            },
            include: {
                requirement: {
                    select: { id: true, title: true, description: true, priority: true },
                },
            },
            orderBy: { created_at: "desc" },
        });

        res.status(200).json({ message: "Estimates fetched successfully", estimates });
    } catch (error) {
        console.error("Error fetching estimates:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * PUT /api/economic-feasibility/estimates/:projectId
 * Bulk upsert estimates for multiple requirements.
 *
 * Body: { estimates: [{ requirement_id, optimistic_hours, most_likely_hours, pessimistic_hours }] }
 */
export const upsertEstimates = async (req, res) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { estimates } = req.body;

        if (!Array.isArray(estimates) || estimates.length === 0) {
            return res.status(400).json({ message: "estimates array is required and must not be empty" });
        }

        // Validate each estimate
        for (const est of estimates) {
            if (!est.requirement_id || est.optimistic_hours == null || est.most_likely_hours == null || est.pessimistic_hours == null) {
                return res.status(400).json({ message: "Each estimate must have requirement_id, optimistic_hours, most_likely_hours, pessimistic_hours" });
            }
            if (est.optimistic_hours < 0 || est.most_likely_hours < 0 || est.pessimistic_hours < 0) {
                return res.status(400).json({ message: "Duration values must be non-negative" });
            }
            if (est.optimistic_hours > est.most_likely_hours || est.most_likely_hours > est.pessimistic_hours) {
                return res.status(400).json({ message: "Must satisfy: optimistic ≤ most_likely ≤ pessimistic" });
            }
        }

        // Upsert all estimates in a transaction
        const results = await prisma.$transaction(
            estimates.map((est) =>
                prisma.economic_estimate.upsert({
                    where: { requirement_id: est.requirement_id },
                    update: {
                        optimistic_hours: parseFloat(est.optimistic_hours),
                        most_likely_hours: parseFloat(est.most_likely_hours),
                        pessimistic_hours: parseFloat(est.pessimistic_hours),
                        updated_at: new Date(),
                    },
                    create: {
                        requirement_id: est.requirement_id,
                        optimistic_hours: parseFloat(est.optimistic_hours),
                        most_likely_hours: parseFloat(est.most_likely_hours),
                        pessimistic_hours: parseFloat(est.pessimistic_hours),
                    },
                })
            )
        );

        res.status(200).json({ message: "Estimates saved successfully", count: results.length });
    } catch (error) {
        console.error("Error saving estimates:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ─── Simulation Endpoint ──────────────────────────────────

/**
 * POST /api/economic-feasibility/simulate/:projectId
 * Run Monte Carlo simulation and return results.
 *
 * Optional body: { iterations: number } (default 10000)
 */
export const simulate = async (req, res) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        // Fetch config
        const config = await prisma.economic_config.findUnique({
            where: { project_id: resolvedId },
        });

        if (!config) {
            return res.status(400).json({ message: "Please configure project economic settings first" });
        }

        // Fetch estimates
        const estimates = await prisma.economic_estimate.findMany({
            where: {
                requirement: { project_id: resolvedId },
            },
        });

        if (estimates.length === 0) {
            return res.status(400).json({ message: "No estimates found. Please enter duration estimates for requirements first." });
        }

        const iterations = parseInt(req.body?.iterations) || 10000;
        if (iterations < 100 || iterations > 100000) {
            return res.status(400).json({ message: "iterations must be between 100 and 100000" });
        }

        // Run simulation
        const startTime = Date.now();
        const { costResults, durationResults } = runSimulation({
            estimates,
            numDevelopers: config.num_developers,
            hourlyRate: config.hourly_rate,
            iterations,
        });

        // Compute statistics
        const costStats = computeStatistics(costResults);
        const durationStats = computeStatistics(durationResults);
        const cycle_time = Date.now() - startTime;

        // Calculate PERT Deterministic
        let totalPertHours = 0;
        estimates.forEach(est => {
            totalPertHours += (est.optimistic_hours + 4 * est.most_likely_hours + est.pessimistic_hours) / 6;
        });

        // Basic COCOMO II Estimation (simplified)
        // Heuristic: 1 staff-month = 152 hours. Estimate KLOC from effort (staff-months * average productivity)
        const totalEffortSM = totalPertHours / 152;
        const estimatedKLOC = totalEffortSM * 1.5; // Heuristic: 1.5 KLOC per staff-month

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

        res.status(200).json({
            message: "Simulation completed successfully",
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
                cocomo: cocomo
            },
            cycle_time,
        });
    } catch (error) {
        console.error("Error running simulation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
