import prisma from "../../../config/db/prismaClient.js";
import { generateStatelessResponse } from "../../utils/gemini.js";

// ARM Keywords based on NASA ARM
const ARM_KEYWORDS = {
    imperatives: ["shall", "must", "is required to", "are applicable", "are to", "responsible for", "will", "should"],
    continuances: ["below", "as follows", "following", "listed", "in particular", "support"],
    directives: ["e.g.", "i.e.", "for example", "figure", "table", "note"],
    options: ["can", "may", "optionally"],
    weakPhrases: ["adequate", "as appropriate", "as applicable", "easy", "normal", "provide for", "timely", "tbd", "tbs", "tbe", "tbc", "not limited to"]
};

const countOccurrences = (text, keywords) => {
    let count = 0;
    const lowerText = text.toLowerCase();

    // We want to match whole words/phrases to avoid partial matches
    keywords.forEach(keyword => {
        // Escape special regex characters in keyword (like dots in "e.g.")
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Use word boundaries. For things ending in dot, \\b might be tricky, but we'll try a generic approach
        const regex = new RegExp(`\\b${escapedKeyword}(?:\\b|[.,;!]?)`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
            count += matches.length;
        }
    });
    return count;
};

export const verifyARM = async (req, res) => {
    try {
        const { projectId } = req.params;

        // projectId could be a UUID or a slug — resolve it
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);

        let resolvedId = projectId;
        if (!isUuid) {
            const project = await prisma.project.findFirst({
                where: { slug: projectId },
                select: { id: true },
            });
            if (!project) return res.status(404).json({ message: "Project not found" });
            resolvedId = project.id;
        }

        // Fetch all requirements for the project
        const requirements = await prisma.requirement.findMany({
            where: { project_id: resolvedId },
            orderBy: { created_at: 'asc' }
        });

        if (!requirements || requirements.length === 0) {
            return res.status(200).json({
                metrics: { imperatives: 0, continuances: 0, directives: 0, options: 0, weakPhrases: 0 },
                results: []
            });
        }

        const runAnalysis = (reqText) => {
            return {
                imperatives: countOccurrences(reqText, ARM_KEYWORDS.imperatives),
                continuances: countOccurrences(reqText, ARM_KEYWORDS.continuances),
                directives: countOccurrences(reqText, ARM_KEYWORDS.directives),
                options: countOccurrences(reqText, ARM_KEYWORDS.options),
                weakPhrases: countOccurrences(reqText, ARM_KEYWORDS.weakPhrases)
            };
        };

        const results = requirements.map(req => {
            const combinedText = `${req.title}. ${req.description}`;
            const analysis = runAnalysis(combinedText);
            return {
                requirement_id: req.id,
                title: req.title,
                description: req.description,
                analysis
            };
        });

        const overallMetrics = results.reduce((acc, curr) => {
            acc.imperatives += curr.analysis.imperatives;
            acc.continuances += curr.analysis.continuances;
            acc.directives += curr.analysis.directives;
            acc.options += curr.analysis.options;
            acc.weakPhrases += curr.analysis.weakPhrases;
            return acc;
        }, { imperatives: 0, continuances: 0, directives: 0, options: 0, weakPhrases: 0 });

        res.status(200).json({
            message: "ARM Verification completed successfully",
            metrics: overallMetrics,
            results
        });

    } catch (error) {
        console.error("Error running ARM verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyARMRequirement = async (req, res) => {
    try {
        const { projectId, requirementId } = req.params;

        // Verify project and requirement exist
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
        let resolvedId = projectId;
        if (!isUuid) {
            const project = await prisma.project.findFirst({
                where: { slug: projectId },
                select: { id: true },
            });
            if (!project) return res.status(404).json({ message: "Project not found" });
            resolvedId = project.id;
        }

        const requirement = await prisma.requirement.findFirst({
            where: { id: requirementId, project_id: resolvedId }
        });

        if (!requirement) {
            return res.status(404).json({ message: "Requirement not found" });
        }

        const runAnalysis = (reqText) => {
            return {
                imperatives: countOccurrences(reqText, ARM_KEYWORDS.imperatives),
                continuances: countOccurrences(reqText, ARM_KEYWORDS.continuances),
                directives: countOccurrences(reqText, ARM_KEYWORDS.directives),
                options: countOccurrences(reqText, ARM_KEYWORDS.options),
                weakPhrases: countOccurrences(reqText, ARM_KEYWORDS.weakPhrases)
            };
        };

        const combinedText = `${requirement.title}. ${requirement.description}`;
        const analysis = runAnalysis(combinedText);

        res.status(200).json({
            message: "ARM Verification for requirement completed successfully",
            result: {
                requirement_id: requirement.id,
                title: requirement.title,
                description: requirement.description,
                analysis
            }
        });

    } catch (error) {
        console.error("Error running single ARM verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyAI = async (req, res) => {
    try {
        const { projectId } = req.params;

        // projectId could be a UUID or a slug — resolve it
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);

        let resolvedId = projectId;
        if (!isUuid) {
            const project = await prisma.project.findFirst({
                where: { slug: projectId },
                select: { id: true },
            });
            if (!project) return res.status(404).json({ message: "Project not found" });
            resolvedId = project.id;
        }

        // Fetch all requirements for the project
        const requirements = await prisma.requirement.findMany({
            where: { project_id: resolvedId },
            orderBy: { created_at: 'asc' }
        });

        if (!requirements || requirements.length === 0) {
            return res.status(200).json({ results: [] });
        }

        // Format requirements for the LLM prompt
        // Process in parallel chunks to avoid timeouts (approx. 5 parallel calls)
        const CHUNK_SIZE = 3;
        const chunkPromises = [];

        for (let i = 0; i < requirements.length; i += CHUNK_SIZE) {
            const chunk = requirements.slice(i, i + CHUNK_SIZE);
            const reqsText = chunk.map((r, idx) => `[REQ-${i + idx + 1} ID:${r.id}] Title: ${r.title}\nDescription: ${r.description}`).join('\n\n');

            const promptText = `
Please evaluate each of the following software requirements based on the IEEE standard characteristics:
1. Unambiguous
2. Complete
3. Verifiable
4. Consistent
5. Modifiable
6. Traceable

Requirements for Project "${projectId}":
${reqsText}
            `;

            const instructions = {
                task: "evaluate_requirements",
                expectations: "Evaluate each requirement strictly against IEEE characteristics. For each characteristic, provide a boolean status. MUST include the exact 'requirement_id' (e.g. the UUID provided) for each object. Provide a structured reasoning string where each point is on a new line (e.g., 'Unambiguous: explanation\\nComplete: explanation...'). If satisfied, keep the reasoning brief ('Satisfied').",
                output: "Return a JSON array of objects.",
                jsonMode: true
            };

            chunkPromises.push(
                generateStatelessResponse(promptText, instructions)
                    .then(aiResponse => {
                        const cleanedText = extractJson(aiResponse);
                        const parsed = JSON.parse(cleanedText);
                        // Ensure it's an array for robustness
                        return Array.isArray(parsed) ? parsed : [parsed];
                    })
                    .catch(error => {
                        console.error(`Error processing requirements chunk ${i / CHUNK_SIZE + 1}:`, error);
                        return [];
                    })
            );
        }

        const startTime = Date.now();
        const chunkedResults = await Promise.all(chunkPromises);
        const cycle_time = Date.now() - startTime;
        const results = chunkedResults.flat();

        // Return combined results
        const enrichedResults = requirements.map(req => {
            const aiAnalysis = results.find(p => p.requirement_id === req.id) || null;
            return {
                requirement_id: req.id,
                title: req.title,
                description: req.description,
                analysis: aiAnalysis
            };
        });

        res.status(200).json({
            message: "AI Verification completed successfully",
            results: enrichedResults,
            cycle_time
        });

    } catch (error) {
        console.error("Error running AI verification:", error);
        res.status(502).json({ message: "Unable to complete AI verification right now. Please try again later." });
    }
};

export const verifyAIRequirement = async (req, res) => {
    try {
        const { projectId, requirementId } = req.params;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
        let resolvedId = projectId;
        if (!isUuid) {
            const project = await prisma.project.findFirst({
                where: { slug: projectId },
                select: { id: true },
            });
            if (!project) return res.status(404).json({ message: "Project not found" });
            resolvedId = project.id;
        }

        const requirement = await prisma.requirement.findFirst({
            where: { id: requirementId, project_id: resolvedId }
        });

        if (!requirement) {
            return res.status(404).json({ message: "Requirement not found" });
        }

        const promptText = `
Please evaluate this software requirement based on the IEEE standard characteristics of a good requirement.
The characteristics to evaluate are:
1. Unambiguous: The requirement has only one interpretation.
2. Complete: It describes everything required by the user, without missing information.
3. Verifiable: There is a cost-effective way to check that the software meets this requirement.
4. Consistent: It does not conflict with other requirements.
5. Modifiable: Structure and style are such that changes can be made easily.
6. Traceable: Its origin is clear and it can be referenced in development.

Requirement:
[REQ ID:${requirement.id}] Title: ${requirement.title}
Description: ${requirement.description}
        `;

        const instructions = {
            task: "evaluate_requirements",
            expectations: "Evaluate the requirement strictly against IEEE characteristics. provide a structured reasoning string where each point is on a new line (e.g., 'Unambiguous: explanation\\nComplete: explanation...'). If a characteristic is satisfied, keep the explanation brief ('Satisfied').",
            output: "Return valid JSON.",
            jsonMode: true
        };

        const startTime = Date.now();
        const aiResponse = await generateStatelessResponse(promptText, instructions);
        const cycle_time = Date.now() - startTime;
        let parsedResults = [];
        try {
            const cleanedText = extractJson(aiResponse);
            const parsed = JSON.parse(cleanedText);
            parsedResults = Array.isArray(parsed) ? parsed : [parsed];
        } catch (parseError) {
            console.error("LLM JSON Parse Error for single requirement:", parseError, aiResponse);
            return res.status(500).json({ message: "Failed to parse AI response into valid format." });
        }

        const aiAnalysis = parsedResults.find(p => p.requirement_id === requirement.id) || null;

        res.status(200).json({
            message: "AI Verification for requirement completed successfully",
            cycle_time,
            result: {
                requirement_id: requirement.id,
                title: requirement.title,
                description: requirement.description,
                analysis: aiAnalysis
            }
        });

    } catch (error) {
        console.error("Error running single AI verification:", error);
        res.status(502).json({ message: "Unable to complete AI verification right now. Please try again later." });
    }
};

// Simple utility to strip markdown to extract JSON
const extractJson = (text) => {
    if (!text || typeof text !== "string") return text;
    let cleaned = text.trim();
    // Match anything between ```json and ``` or just ``` and ```
    const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
        return jsonBlockMatch[1].trim();
    }
    // Match first [ to last ]
    const jsonArrayMatch = cleaned.match(/(\[[\s\S]*\])/);
    if (jsonArrayMatch && jsonArrayMatch[1]) {
        return jsonArrayMatch[1];
    }
    // Match first { to last }
    const jsonObjectMatch = cleaned.match(/(\{[\s\S]*\})/);
    if (jsonObjectMatch && jsonObjectMatch[1]) {
        return jsonObjectMatch[1];
    }
    return cleaned;
};
