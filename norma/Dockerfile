FROM python:3.11-slim

WORKDIR /app

# Install dependencies (source is bind-mounted at runtime)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Default command — Streamlit with auto-reload on file save
CMD ["streamlit", "run", "src/app.py", \
     "--server.port=8501", \
     "--server.address=0.0.0.0", \
     "--server.runOnSave=true", \
     "--server.headless=true"]
