FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for Selenium + Chrome + OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model artifacts
COPY app.py .
COPY compliance_engine.py .
COPY src/ ./src/
COPY artifacts/ ./artifacts/
COPY data/ ./data/

# Hugging Face Spaces expects port 7860
EXPOSE 7860

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
