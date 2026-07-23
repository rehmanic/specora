#!/usr/bin/env node

/**
 * ingest.js — Builds FAISS index + metadata from chunks.json.
 * Node.js port of norma/src/ingest.py
 * 
 * Usage:
 *   node scripts/ingest.js
 *   node scripts/ingest.js --chunks ./data/norma/processed/chunks.json --index ./data/norma/processed/faiss_index.bin --meta ./data/norma/processed/chunk_metadata.json
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import faiss from "faiss-node";
import { EmbeddingModel } from "fastembed";
import dotenv from "dotenv";

const { IndexFlatIP } = faiss;

dotenv.config();

// -----------------------
// Config
// -----------------------
const args = process.argv.slice(2);
function getArg(name, fallback) {
    const idx = args.indexOf(name);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const CHUNKS_PATH = resolve(getArg("--chunks", process.env.NORMA_CHUNKS_PATH || "./data/norma/processed/chunks.json"));
const INDEX_PATH = resolve(getArg("--index", process.env.NORMA_INDEX_PATH || "./data/norma/processed/faiss_index.bin"));
const META_PATH = resolve(getArg("--meta", process.env.NORMA_META_PATH || "./data/norma/processed/chunk_metadata.json"));
const MODEL_NAME = getArg("--model", process.env.NORMA_EMBED_MODEL || "sentence-transformers/all-MiniLM-L6-v2");

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

// -----------------------
// Main
// -----------------------
async function main() {
    // Load chunks
    console.log("Loading chunks from:", CHUNKS_PATH);
    const chunks = JSON.parse(readFileSync(CHUNKS_PATH, "utf-8"));
    if (!Array.isArray(chunks)) {
        throw new Error("chunks.json must be a list of chunk objects.");
    }
    console.log(`Loaded ${chunks.length} chunks.`);

    // Load embedding model
    console.log("Loading embedding model:", MODEL_NAME);
    const model = await EmbeddingModel.from(MODEL_NAME);

    // Build embeddings
    console.log("Building embeddings...");
    const texts = chunks.map((c) => c.text || "");
    const allEmbeddings = [];

    for await (const batch of model.embed(texts)) {
        allEmbeddings.push(batch);
    }

    // Flatten all batches into a single array of Float32Arrays
    // fastembed returns batches — each batch is a Float32Array for one text
    const embeddings = allEmbeddings;

    if (embeddings.length === 0) {
        throw new Error("No embeddings were generated.");
    }

    const dim = embeddings[0].length;
    console.log(`Generated ${embeddings.length} embeddings of dimension ${dim}.`);

    // Normalize all embeddings
    console.log("Normalizing embeddings...");
    for (const emb of embeddings) {
        normalizeL2(emb);
    }

    // Build FAISS index (IndexFlatIP for cosine via normalized vectors + inner product)
    console.log("Building FAISS index...");
    const index = new IndexFlatIP(dim);

    for (const emb of embeddings) {
        index.add(emb);
    }

    console.log(`FAISS index built with ${index.ntotal()} vectors.`);

    // Create metadata
    console.log("Creating metadata...");
    const metadata = chunks.map((c, i) => ({
        chunk_id: i,
        page: c.start_page || c.page || null,
        section: c.section || c.section_hint || "",
    }));

    // Save artifacts
    mkdirSync(dirname(INDEX_PATH), { recursive: true });

    index.write(INDEX_PATH);
    console.log(`Saved index -> ${INDEX_PATH}`);

    writeFileSync(META_PATH, JSON.stringify(metadata, null, 2), "utf-8");
    console.log(`Saved metadata -> ${META_PATH}`);

    console.log("Ingestion complete.");
}

main().catch((err) => {
    console.error("Ingestion failed:", err);
    process.exit(1);
});
