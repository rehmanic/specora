import { readFileSync } from "fs";
import { resolve } from "path";
import faiss from "faiss-node";
import { EmbeddingModel } from "fastembed";

const { IndexFlatIP } = faiss;

// -----------------------
// Config
// -----------------------
const INDEX_PATH = resolve(process.env.NORMA_INDEX_PATH || "./data/norma/processed/faiss_index.bin");
const META_PATH = resolve(process.env.NORMA_META_PATH || "./data/norma/processed/chunk_metadata.json");
const CHUNKS_PATH = resolve(process.env.NORMA_CHUNKS_PATH || "./data/norma/processed/chunks.json");
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

/**
 * L2-normalize a Float32Array vector in-place.
 */
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

/**
 * Embed a query string and return an L2-normalized Float32Array.
 */
async function embedQuery(text) {
    const embeddings = model.embed([text]);
    let vec = null;
    for await (const batch of embeddings) {
        vec = batch;
        break;
    }
    if (!vec) throw new Error("Failed to generate embedding");

    // Convert to Float32Array if not already
    const floatVec = vec instanceof Float32Array ? vec : new Float32Array(vec);
    return normalizeL2(floatVec);
}

/**
 * Search the FAISS index and return ranked chunks with scores.
 */
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
// Resource Loading
// -----------------------

/**
 * Load all resources (model, FAISS index, metadata, chunks).
 * Called once at startup from the route module.
 */
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
        // Don't throw — let server start, but requests will return 503
    }
}

// -----------------------
// Endpoints
// -----------------------

/**
 * GET /api/legal-feasibility/health
 */
export const health = (req, res) => {
    res.json({ status: "ok", resources_loaded: resourcesReady });
};

/**
 * POST /api/legal-feasibility/single
 * Body: { id, title, description }
 */
export const checkSingle = async (req, res) => {
    const startTime = Date.now();

    try {
        if (!resourcesReady) {
            return res.status(503).json({ message: "Legal feasibility resources not fully loaded." });
        }

        const { id, title, description } = req.body;

        if (!id || !title) {
            return res.status(400).json({ message: "id and title are required." });
        }

        const queryText = `${title} ${description || ""}`;
        const queryVec = await embedQuery(queryText);
        const retrieved = retrieve(queryVec);

        const isFeasible = retrieved.length > 0 && retrieved[0].score >= SIM_THRESHOLD;

        res.json({
            requirement_id: id,
            title,
            is_feasible: isFeasible,
            retrieved_context: retrieved,
            cycle_time: Date.now() - startTime,
        });
    } catch (error) {
        console.error("[Legal Feasibility] Single check error:", error);
        res.status(500).json({ message: "Failed to perform legal feasibility check." });
    }
};

/**
 * POST /api/legal-feasibility/batch
 * Body: { requirements: [{ id, title, description }] }
 */
export const checkBatch = async (req, res) => {
    try {
        if (!resourcesReady) {
            return res.status(503).json({ message: "Legal feasibility resources not fully loaded." });
        }

        const { requirements } = req.body;

        if (!Array.isArray(requirements) || requirements.length === 0) {
            return res.status(400).json({ message: "requirements must be a non-empty array." });
        }

        if (requirements.length > 50) {
            return res.status(400).json({ message: "Batch limit exceeded. Maximum 50 allowed." });
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

        res.json({ results });
    } catch (error) {
        console.error("[Legal Feasibility] Batch check error:", error);
        res.status(500).json({ message: "Failed to perform batch legal feasibility check." });
    }
};
