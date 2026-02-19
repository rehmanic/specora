# app.py — Streamlit front-end (updated)
import json
import os
from pathlib import Path

import faiss
import numpy as np
import streamlit as st
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# GEMINI DISABLED - Uncomment to re-enable LLM integration
# import google.generativeai as genai

load_dotenv()

# -----------------------
# Config (override via env or edit here)
# -----------------------
DATA_DIR = Path(os.getenv("NORMA_DATA_DIR"))
INDEX_PATH = Path(os.getenv("NORMA_INDEX_PATH"))
METADATA_PATH = Path(os.getenv("NORMA_META_PATH"))
CHUNKS_PATH = Path(os.getenv("NORMA_CHUNKS_PATH"))

MODEL_NAME = os.getenv("NORMA_EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
TOP_K = int(os.getenv("NORMA_TOP_K", "5"))
SIM_THRESHOLD = float(os.getenv("NORMA_SIM_THRESHOLD", "0.25"))

# -----------------------
# Helpers
# -----------------------
@st.cache_resource
def load_model():
    return SentenceTransformer(MODEL_NAME)

@st.cache_resource
def load_faiss_index():
    if not INDEX_PATH.exists():
        raise FileNotFoundError(f"FAISS index not found at: {INDEX_PATH}")
    return faiss.read_index(str(INDEX_PATH))

@st.cache_resource
def load_metadata():
    if not METADATA_PATH.exists():
        raise FileNotFoundError(f"Metadata JSON not found at: {METADATA_PATH}")
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@st.cache_resource
def load_chunks():
    if not CHUNKS_PATH.exists():
        raise FileNotFoundError(f"Chunks JSON not found at: {CHUNKS_PATH}")
    with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def embed_query(text: str, model: SentenceTransformer):
    vec = model.encode([text], convert_to_numpy=True)
    vec = vec.astype("float32")
    faiss.normalize_L2(vec)
    return vec

def retrieve(query_vec: np.ndarray, index, metadata: list, chunks: list):
    scores, ids = index.search(query_vec, TOP_K)
    scores = scores[0]
    ids = ids[0]

    retrieved = []
    for score, idx in zip(scores, ids):
        if idx == -1:
            continue
        # metadata aligns with chunk order => index = chunk_id
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

def format_prompt(question: str, top_chunks: list):
    context_text = "\n\n---\n\n".join(
        [f"(p. {c['page']}) {c['text']}" for c in top_chunks]
    )

    prompt = f"""You are a legal advisor to a software agency. Answer ONLY from the provided context.
Cite sections and page numbers. If unsure, say you don't know.

Question:
{question}

Context:
{context_text}
"""
    return prompt

# GEMINI DISABLED - Uncomment to re-enable LLM integration
# def ask_gemini(prompt: str):
#     api_key = os.getenv("GEMINI_API_KEY")
#     if not api_key:
#         raise ValueError("GEMINI_API_KEY missing in environment (.env).")
#
#     genai.configure(api_key=api_key)
#     model = genai.GenerativeModel("gemini-2.5-flash")
#
#     try:
#         response = model.generate_content(prompt)
#         # response.text is the main generated text
#         return response.text
#     except Exception as e:
#         msg = str(e)
#         # Show the actual error for debugging
#         raise ValueError(f"Gemini API error: {msg}")

# ============================================
# Streamlit UI
# ============================================
st.set_page_config(page_title="Norma", layout="wide")
st.title("Norma (Legal Advisor)")
st.write("Provide a software requirement to check its compliance.")
st.info("🔧 Running in **Retrieval-Only Mode**")

# GEMINI DISABLED - Uncomment to re-enable API key check
# if not os.getenv("GEMINI_API_KEY"):
#     st.error("GEMINI_API_KEY is missing in your environment (.env). Add GEMINI_API_KEY and reload.")
#     st.stop()

# Try loading resources with friendly errors
try:
    model = load_model()
    index = load_faiss_index()
    metadata = load_metadata()
    chunks = load_chunks()
except Exception as e:
    st.error(f"Error loading resources: {e}")
    st.stop()

user_query = st.text_input("Enter your question:")

if st.button("Ask"):
    if not user_query or not user_query.strip():
        st.warning("Please enter a question.")
        st.stop()

    query_vec = embed_query(user_query, model)
    retrieved = retrieve(query_vec, index, metadata, chunks)

    if len(retrieved) == 0 or retrieved[0]["score"] < SIM_THRESHOLD:
        st.error("I don't have that in the Legal DB.")
        st.stop()

    # GEMINI DISABLED - Show retrieved chunks directly instead of LLM answer
    # final_prompt = format_prompt(user_query, retrieved)
    # with st.spinner("Thinking with Gemini..."):
    #     try:
    #         answer = ask_gemini(final_prompt)
    #     except ValueError as e:
    #         st.error(str(e))
    #         st.stop()
    #     except Exception as e:
    #         st.error(f"Unexpected error from Gemini: {e}")
    #         st.stop()
    # st.subheader("Answer")
    # st.write(answer)

    st.subheader("Retrieved Legal Context")
    st.success(f"Found {len(retrieved)} relevant chunks for your query.")

    for r in retrieved:
        st.markdown(f"### Chunk {r['chunk_id']} — Page {r['page']} — {r['section']}")
        st.write(r["text"])
        st.write(f"**Similarity:** {r['score']:.3f}")
        st.markdown("---")
