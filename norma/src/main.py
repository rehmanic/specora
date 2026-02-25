import json
import os
from pathlib import Path
from typing import List

import faiss
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastembed import TextEmbedding

load_dotenv()

# -----------------------
# Config 
# -----------------------
DATA_DIR = Path(os.getenv("NORMA_DATA_DIR", "data"))
INDEX_PATH = Path(os.getenv("NORMA_INDEX_PATH", "data/index.faiss"))
METADATA_PATH = Path(os.getenv("NORMA_META_PATH", "data/metadata.json"))
CHUNKS_PATH = Path(os.getenv("NORMA_CHUNKS_PATH", "data/chunks.json"))

MODEL_NAME = os.getenv("NORMA_EMBED_MODEL", "BAAI/bge-small-en-v1.5")
TOP_K = int(os.getenv("NORMA_TOP_K", "5"))
SIM_THRESHOLD = float(os.getenv("NORMA_SIM_THRESHOLD", "0.25"))

# -----------------------
# Data Models
# -----------------------
class RequirementRequest(BaseModel):
    id: str
    title: str
    description: str

class BatchRequirementRequest(BaseModel):
    requirements: List[RequirementRequest]

class RetrievedChunk(BaseModel):
    score: float
    page: int | str | None
    section: str | None
    text: str
    chunk_id: int | str

class FeasibilityResult(BaseModel):
    requirement_id: str
    title: str
    is_feasible: bool
    retrieved_context: List[RetrievedChunk]

class BatchFeasibilityResult(BaseModel):
    results: List[FeasibilityResult]

# -----------------------
# Global State 
# -----------------------
model = None
index = None
metadata = None
chunks = None

app = FastAPI(title="Norma API", description="Legal Feasibility Assessment for Specora")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow your frontend origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Helpers
# -----------------------
def load_resources():
    global model, index, metadata, chunks
    if model is None:
        model = TextEmbedding(model_name=MODEL_NAME)
    
    if index is None:
        if not INDEX_PATH.exists():
            raise FileNotFoundError(f"FAISS index not found at: {INDEX_PATH}")
        index = faiss.read_index(str(INDEX_PATH))
    
    if metadata is None:
        if not METADATA_PATH.exists():
            raise FileNotFoundError(f"Metadata JSON not found at: {METADATA_PATH}")
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            metadata = json.load(f)
            
    if chunks is None:
        if not CHUNKS_PATH.exists():
            raise FileNotFoundError(f"Chunks JSON not found at: {CHUNKS_PATH}")
        with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
            chunks = json.load(f)

def embed_query(text: str, model: TextEmbedding) -> np.ndarray:
    embeddings = list(model.embed([text]))
    vec = np.array(embeddings, dtype="float32")
    faiss.normalize_L2(vec)
    return vec

def retrieve(query_vec: np.ndarray, index, metadata: list, chunks: list) -> List[dict]:
    scores, ids = index.search(query_vec, TOP_K)
    scores = scores[0]
    ids = ids[0]

    retrieved = []
    for score, idx in zip(scores, ids):
        if idx == -1:
            continue
            
        meta = metadata[idx] if idx < len(metadata) else {}
        chunk = chunks[idx] if idx < len(chunks) else {}
        page = meta.get("page") or meta.get("start_page") or chunk.get("start_page")
        section = meta.get("section") or chunk.get("section") or meta.get("section_hint", "")
        chunk_id = meta.get("chunk_id", idx)

        retrieved.append({
            "score": float(score),
            "page": page,
            "section": section,
            "text": chunk.get("text", ""),
            "chunk_id": chunk_id
        })
    return retrieved

@app.on_event("startup")
async def startup_event():
    try:
        load_resources()
        print("Resources loaded successfully.")
    except Exception as e:
        print(f"Error loading resources: {e}")
        # Not raising here to allow app to start, but requests will fail. 
        # In prod, you might want to exit.

# -----------------------
# Endpoints
# -----------------------
@app.get("/health")
def health_check():
    return {"status": "ok", "resources_loaded": model is not None}

@app.post("/api/v1/feasibility/legal/single", response_model=FeasibilityResult)
def check_single_feasibility(request: RequirementRequest):
    if not model or not index:
        raise HTTPException(status_code=503, detail="Norma resources not fully loaded.")

    query_text = f"{request.title} {request.description}"
    query_vec = embed_query(query_text, model)
    retrieved = retrieve(query_vec, index, metadata, chunks)

    is_feasible = False
    if len(retrieved) > 0 and retrieved[0]["score"] >= SIM_THRESHOLD:
        is_feasible = True

    return FeasibilityResult(
        requirement_id=request.id,
        title=request.title,
        is_feasible=is_feasible,  # Simple boolean evaluation for now based on context retrieval
        retrieved_context=[RetrievedChunk(**r) for r in retrieved]
    )

@app.post("/api/v1/feasibility/legal/batch", response_model=BatchFeasibilityResult)
def check_batch_feasibility(request: BatchRequirementRequest):
    if not model or not index:
        raise HTTPException(status_code=503, detail="Norma resources not fully loaded.")
    
    if len(request.requirements) > 50:
        raise HTTPException(status_code=400, detail="Batch limit exceeded. Maximum 50 allowed.")

    results = []
    for req in request.requirements:
        query_text = f"{req.title} {req.description}"
        query_vec = embed_query(query_text, model)
        retrieved = retrieve(query_vec, index, metadata, chunks)

        is_feasible = False
        if len(retrieved) > 0 and retrieved[0]["score"] >= SIM_THRESHOLD:
            is_feasible = True

        results.append(FeasibilityResult(
            requirement_id=req.id,
            title=req.title,
            is_feasible=is_feasible,
            retrieved_context=[RetrievedChunk(**r) for r in retrieved]
        ))
        
    return BatchFeasibilityResult(results=results)

