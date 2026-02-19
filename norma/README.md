# Norma RAG Engine

**Norma** is the Retrieval-Augmented Generation (RAG) engine for Specora. It processes legal documents (like the CCPA), indexes them into a vector database, and provides an intelligent chat interface for querying the information.

## 🚀 Features

- **PDF Preprocessing**: Extracting and cleaning text from legal PDF documents.
- **Smart Chunking**: Segmenting documents into meaningful chunks for better retrieval accuracy.
- **Vector Ingestion**: Generating embeddings (via Google Gemini or Sentence Transformers) and indexing them using FAISS.
- **AI-Powered Chat**: A Streamlit-based interface for interactive querying of indexed documents.
- **CCPA Ready**: Pre-configured structure for the California Consumer Privacy Act (CCPA).

## 🛠️ Tech Stack

- **Language**: Python 3.9+
- **Frontend**: [Streamlit](https://streamlit.io/)
- **Vector Database**: [FAISS](https://github.com/facebookresearch/faiss)
- **Embeddings**: Google Generative AI or Sentence Transformers
- **PDF Extraction**: pdfplumber & PyPDF2

## 📁 Project Structure

```text
norma/
├── src/
│   ├── app.py             # Streamlit chat application
│   ├── ingest.py          # Data ingestion and indexing script
│   └── preprocessor.py    # PDF text extraction and chunking
├── data/
│   ├── raw/               # Original PDF documents
│   └── processed/         # Generated chunks and FAISS index (ignored by Git)
├── tests/                 # Unit and integration tests
├── requirements.txt       # Python dependencies
└── setup.py               # Package configuration
```

## 🚥 Getting Started

### Prerequisites

- [Python 3.9+](https://www.python.org/)
- A Google Gemini API Key (if using Gemini embeddings)

### Installation

1. Navigate to the `norma` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Environment Configuration

Create a `.env` file based on the example:
```bash
cp .env.example .env
```
Ensure you provide the `GEMINI_API_KEY` if you plan to use it for embeddings.

### Usage

1. **Preprocess**: Extract text from PDFs in `data/raw/`.
   ```bash
   python src/preprocessor.py
   ```
2. **Ingest**: Index the processed text into the FAISS vector database.
   ```bash
   python src/ingest.py
   ```
3. **Run Chat**: Start the Streamlit dashboard.
   ```bash
   streamlit run src/app.py
   ```

## 📄 License

MIT