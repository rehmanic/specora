FROM python:3.11-slim

WORKDIR /app

# Install dependencies (source is bind-mounted at runtime)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Default command — FastAPI
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
