import { readFileSync } from "fs";
import { resolve } from "path";
import faiss from "faiss-node";
import { EmbeddingModel } from "fastembed";
import AppError from "../../../utils/AppError.js";

const { IndexFlatIP } = faiss;

// -----------------------
// Config
// -----------------------
const INDEX_PATH = resolve(process.env.NORMA_INDEX_PATH || "./storage/legal/processed/faiss_index.bin");
const META_PATH = resolve(process.env.NORMA_META_PATH || "./storage/legal/processed/chunk_metadata.json");
const CHUNKS_PATH = resolve(process.env.NORMA_CHUNKS_PATH || "./storage/legal/processed/chunks.json");
const MODEL_NAME = process.env.NORMA_EMBED_MODEL || "sentence-transformers/all-MiniLM-L6-v2";
const TOP_K = parseInt(process.env.NORMA_TOP_K || "5", 10);
const SIM_THRESHOLD = parseFloat(process.env.NORMA_SIM_THRESHOLD || "0.25");

// -----------------------
// Global State
// -----------------------
let model = null;
let index = null;
let metadata = null;
let chunks = null;
let resourcesReady = false;

// -----------------------
// Helpers
// -----------------------

function normalizeL2(vec) {
    let norm = 0;
    for (let i = 0; i < vec.length; i++) {
        norm += vec[i] * vec[i];
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
        for (let i = 0; i < vec.length; i++) {
            vec[i] /= norm;
        }
    }
    return vec;
}

async function embedQuery(text) {
    const embeddings = model.embed([text]);
    let vec = null;
    for await (const batch of embeddings) {
        vec = batch;
        break;
    }
    if (!vec) throw new Error("Failed to generate embedding");

    const floatVec = vec instanceof Float32Array ? vec : new Float32Array(vec);
    return normalizeL2(floatVec);
}

function retrieve(queryVec) {
    const result = index.search(queryVec, TOP_K);
    const retrieved = [];

    for (let i = 0; i < result.labels.length; i++) {
        const idx = result.labels[i];
        const score = result.distances[i];

        if (idx === -1) continue;

        const meta = idx < metadata.length ? metadata[idx] : {};
        const chunk = idx < chunks.length ? chunks[idx] : {};
        const page = meta.page || meta.start_page || chunk.start_page || null;
        const section = meta.section || chunk.section || meta.section_hint || "";
        const chunkId = meta.chunk_id ?? idx;

        retrieved.push({
            score,
            page,
            section,
            text: chunk.text || "",
            chunk_id: chunkId,
        });
    }

    return retrieved;
}

// -----------------------
// Service Functions
// -----------------------

export async function loadResources() {
    if (resourcesReady) return;

    try {
        console.log("🔍 [Legal Feasibility] Loading embedding model:", MODEL_NAME);
        model = await EmbeddingModel.from(MODEL_NAME);

        console.log("🔍 [Legal Feasibility] Loading FAISS index:", INDEX_PATH);
        index = IndexFlatIP.read(INDEX_PATH);

        console.log("🔍 [Legal Feasibility] Loading metadata:", META_PATH);
        metadata = JSON.parse(readFileSync(META_PATH, "utf-8"));

        console.log("🔍 [Legal Feasibility] Loading chunks:", CHUNKS_PATH);
        chunks = JSON.parse(readFileSync(CHUNKS_PATH, "utf-8"));

        resourcesReady = true;
        console.log("✅ [Legal Feasibility] All resources loaded successfully.");
    } catch (err) {
        console.error("❌ [Legal Feasibility] Failed to load resources:", err.message);
    }
}

export function getHealthStatus() {
    return { status: "ok", resources_loaded: resourcesReady };
}

export async function checkSingleRequirement(id, title, description) {
    if (!resourcesReady) {
        throw new AppError("Legal feasibility resources not fully loaded.", 503);
    }
    if (!id || !title) {
        throw new AppError("id and title are required.", 400);
    }

    const startTime = Date.now();
    const queryText = `${title} ${description || ""}`;
    const queryVec = await embedQuery(queryText);
    const retrieved = retrieve(queryVec);
    const isFeasible = retrieved.length > 0 && retrieved[0].score >= SIM_THRESHOLD;

    return {
        requirement_id: id,
        title,
        is_feasible: isFeasible,
        retrieved_context: retrieved,
        cycle_time: Date.now() - startTime,
    };
}

export async function checkBatchRequirements(requirements) {
    if (!resourcesReady) {
        throw new AppError("Legal feasibility resources not fully loaded.", 503);
    }
    if (!Array.isArray(requirements) || requirements.length === 0) {
        throw new AppError("requirements must be a non-empty array.", 400);
    }
    if (requirements.length > 50) {
        throw new AppError("Batch limit exceeded. Maximum 50 allowed.", 400);
    }

    const results = [];
    for (const req of requirements) {
        const startTime = Date.now();
        const queryText = `${req.title} ${req.description || ""}`;
        const queryVec = await embedQuery(queryText);
        const retrieved = retrieve(queryVec);

        const isFeasible = retrieved.length > 0 && retrieved[0].score >= SIM_THRESHOLD;

        results.push({
            requirement_id: req.id,
            title: req.title,
            is_feasible: isFeasible,
            retrieved_context: retrieved,
            cycle_time: Date.now() - startTime,
        });
    }

    return results;
}
