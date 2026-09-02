import { GoogleGenAI } from "@google/genai";
import * as techFeasibilityRepo from "../repositories/techFeasibilityRepository.js";
import AppError from "../../../utils/AppError.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";
import { techFeasibilitySystemPrompt } from "../../../utils/prompts/techFeasibilityPrompts.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function parseGroundingResponse(response) {
    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "";
    const metadata = candidate?.groundingMetadata;

    const sources = (metadata?.groundingChunks || []).map((chunk, index) => ({
        index,
        title: chunk.web?.title || "Unknown Source",
        uri: chunk.web?.uri || "",
    }));

    const groundingSupports = (metadata?.groundingSupports || []).map((support) => ({
        text: support.segment?.text || "",
        startIndex: support.segment?.startIndex || 0,
        endIndex: support.segment?.endIndex || 0,
        sourceIndices: support.groundingChunkIndices || [],
    }));

    const searchQueries = metadata?.webSearchQueries || [];
    const searchEntryPoint = metadata?.searchEntryPoint?.renderedContent || null;

    return {
        answer: text,
        sources,
        groundingSupports,
        searchQueries,
        searchEntryPoint,
    };
}

export async function searchTechFeasibility(projectId, query) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    if (!query || typeof query !== "string" || query.trim().length === 0) {
        throw new AppError("query is required and must be a non-empty string", 400);
    }
    if (query.length > 2000) {
        throw new AppError("query must not exceed 2000 characters", 400);
    }

    let requirementsContext = "";
    try {
        const requirements = await techFeasibilityRepo.findRequirementsByProject(resolvedId, {
            select: { title: true, description: true },
            take: 20,
        });

        if (requirements.length > 0) {
            requirementsContext = `\n\nProject Requirements Context (for reference):\n${requirements.map((r, i) => `${i + 1}. ${r.title}: ${r.description || "No description"}`).join("\n")}`;
        }
    } catch {
        // Proceed without context if fetch fails
    }

    const systemPrompt = techFeasibilitySystemPrompt(requirementsContext);
    const startTime = Date.now();

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${systemPrompt}\n\nUser Query: ${query.trim()}`,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.7,
                maxOutputTokens: 4000,
            },
        });

        const cycle_time = Date.now() - startTime;
        const result = parseGroundingResponse(response);

        return { cycle_time, ...result };
    } catch (error) {
        if (error.message?.includes("API key")) {
            throw new AppError("Gemini API key configuration error", 500);
        }
        if (error.status === 503 || error.message?.includes("503") || error.message?.includes("UNAVAILABLE")) {
            throw new AppError("The AI model is currently experiencing high demand. Please try again in a moment.", 503);
        }
        if (error.status === 429 || error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
            throw new AppError("AI rate limit reached. Please wait a moment before trying again.", 429);
        }
        throw new AppError("Failed to perform technical feasibility search", 500);
    }
}
