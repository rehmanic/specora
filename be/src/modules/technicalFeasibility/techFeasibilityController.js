import { GoogleGenAI } from "@google/genai";
import prisma from "../../../config/db/prismaClient.js";

// ─── Gemini Client (new SDK for grounding) ───────────────

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

/**
 * Parse Gemini grounding metadata into a structured response.
 */
function parseGroundingResponse(response) {
    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "";
    const metadata = candidate?.groundingMetadata;

    // Extract sources from groundingChunks
    const sources = (metadata?.groundingChunks || []).map((chunk, index) => ({
        index,
        title: chunk.web?.title || "Unknown Source",
        uri: chunk.web?.uri || "",
    }));

    // Extract inline citation mappings from groundingSupports
    const groundingSupports = (metadata?.groundingSupports || []).map((support) => ({
        text: support.segment?.text || "",
        startIndex: support.segment?.startIndex || 0,
        endIndex: support.segment?.endIndex || 0,
        sourceIndices: support.groundingChunkIndices || [],
    }));

    // Extract search queries used by Gemini
    const searchQueries = metadata?.webSearchQueries || [];

    // Extract the search entry point (rendered HTML for consulted resources)
    const searchEntryPoint = metadata?.searchEntryPoint?.renderedContent || null;

    return {
        answer: text,
        sources,
        groundingSupports,
        searchQueries,
        searchEntryPoint,
    };
}

// ─── Search Endpoint ──────────────────────────────────────

/**
 * POST /api/tech-feasibility/search/:projectId
 * Run a Gemini-grounded web search for a technical feasibility query.
 *
 * Body: { query: string }
 */
export const search = async (req, res) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { query } = req.body;

        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return res.status(400).json({ message: "query is required and must be a non-empty string" });
        }

        if (query.length > 2000) {
            return res.status(400).json({ message: "query must not exceed 2000 characters" });
        }

        // Optionally load project requirements for context
        let requirementsContext = "";
        try {
            const requirements = await prisma.requirement.findMany({
                where: { project_id: resolvedId },
                select: { title: true, description: true },
                take: 20,
            });

            if (requirements.length > 0) {
                requirementsContext = `\n\nProject Requirements Context (for reference):\n${requirements.map((r, i) => `${i + 1}. ${r.title}: ${r.description || "No description"}`).join("\n")}`;
            }
        } catch {
            // If requirements fetch fails, proceed without context
        }

        const systemPrompt = `You are a senior software engineer conducting a technical feasibility assessment. 
Provide thorough, well-researched answers grounded in current industry practices from Software Engineering (SWE), Software Development Life Cycle (SDLC), and Site Reliability Engineering (SRE).

When answering:
- Cite specific technologies, frameworks, or methodologies
- Mention trade-offs and risks where relevant
- Reference industry standards (e.g., ISO/IEC 25010, SRE practices, TELOS framework) when applicable
- Be specific and actionable, not generic${requirementsContext}`;

        // Call Gemini with Google Search grounding
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${systemPrompt}\n\nUser Query: ${query.trim()}`,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.7,
                maxOutputTokens: 4000,
            },
        });

        const result = parseGroundingResponse(response);

        res.status(200).json({
            message: "Search completed successfully",
            ...result,
        });
    } catch (error) {
        console.error("Tech feasibility search error:", error);

        if (error.message?.includes("API key")) {
            return res.status(500).json({ message: "Gemini API key configuration error" });
        }

        res.status(500).json({ message: "Failed to perform technical feasibility search" });
    }
};
