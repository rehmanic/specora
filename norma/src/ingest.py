# ingest.py — builds FAISS index + metadata from preprocessor chunks.json
import argparse
import json
import os
from pathlib import Path

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


DEFAULT_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


def load_chunks(path: Path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("chunks.json must be a list of chunk objects.")
    return data


def build_embeddings(chunks, model, batch_size=32):
    texts = [c.get("text", "") for c in chunks]
    embeddings = model.encode(texts, batch_size=batch_size, show_progress_bar=True, convert_to_numpy=True)
    embeddings = embeddings.astype("float32")
    return embeddings


def build_faiss_index(embeddings):
    dim = embeddings.shape[1]
    faiss.normalize_L2(embeddings)
    index = faiss.IndexFlatIP(dim)  # cosine via normalized vectors + inner product
    index.add(embeddings)
    return index


def create_metadata(chunks):
    metadata = []
    for i, c in enumerate(chunks):
        meta = {
            "chunk_id": i,
            # unify name as "page" for app.py
            "page": c.get("start_page") or c.get("page"),
            "section": c.get("section") or c.get("section_hint", "")
        }
        metadata.append(meta)
    return metadata


def save_all(index, embeddings, metadata, out_index: Path, out_emb: Path, out_meta: Path):
    out_index.parent.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(out_index))
    np.save(str(out_emb), embeddings)
    with open(out_meta, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    print(f"Saved index -> {out_index}")
    print(f"Saved embeddings -> {out_emb}")
    print(f"Saved metadata -> {out_meta}")


def parse_args():
    p = argparse.ArgumentParser(description="Build FAISS index from chunks.json")
    p.add_argument("--chunks", type=Path, required=False,
                   default=Path(os.getenv("NORMA_CHUNKS_PATH", "D:/Projects/Specora/Norma/data/processed/chunks.json")))
    p.add_argument("--index", type=Path, required=False,
                   default=Path(os.getenv("NORMA_INDEX_PATH", "D:/Projects/Specora/Norma/data/processed/faiss_index.bin")))
    p.add_argument("--meta", type=Path, required=False,
                   default=Path(os.getenv("NORMA_META_PATH", "D:/Projects/Specora/Norma/data/processed/chunk_metadata.json")))
    p.add_argument("--emb", type=Path, required=False,
                   default=Path(os.getenv("NORMA_EMB_PATH", "D:/Projects/Specora/Norma/data/processed/embeddings.npy")))
    p.add_argument("--model", type=str, default=os.getenv("NORMA_EMBED_MODEL", DEFAULT_MODEL))
    return p.parse_args()


def main():
    args = parse_args()

    print("Loading chunks from:", args.chunks)
    chunks = load_chunks(args.chunks)

    print("Loading embedding model:", args.model)
    model = SentenceTransformer(args.model)

    print("Building embeddings...")
    embeddings = build_embeddings(chunks, model)

    print("Building FAISS index...")
    index = build_faiss_index(embeddings)

    print("Creating metadata...")
    metadata = create_metadata(chunks)

    print("Saving artifacts...")
    save_all(index, embeddings, metadata, args.index, args.emb, args.meta)

    print("Ingestion complete.")


if __name__ == "__main__":
    main()
