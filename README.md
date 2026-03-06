# Automated Dark Pattern Detection

A web-based tool that uses AI (RoBERTa + TF-IDF Pattern Router) to identify and categorize dark patterns and non-compliant UI practices on live websites, with automated GDPR compliance reporting.

## Tech Stack
* **Front-end:** React with JavaScript (Compliance Dashboard)
* **Back-end:** Node.js (Express) Orchestrator
* **Web Scraper:** Python (FastAPI & Selenium WebDriver)
* **AI Models:** RoBERTa (Gate Model) + TF-IDF/LogReg (Pattern Router)
* **Compliance Engine:** GDPR Article Mapping
* **AI Model Hosting:** Hugging Face Spaces (optional)
* **Deployment:** Docker & Docker Compose

## Project Structure
```
├── frontend/          → React compliance dashboard (port 3000)
├── backend/           → Node.js API orchestrator (port 5000)
├── scraper-service/   → Selenium headless screenshot capture (port 8000)
├── ai-service/        → AI inference + compliance engine (port 7860)
│   ├── app.py                    → FastAPI server with real inference
│   ├── compliance_engine.py      → GDPR violation mapper
│   ├── run_all.py                → Full training pipeline
│   ├── src/
│   │   ├── config.py             → Path configuration
│   │   ├── data/                 → Data loading & processing
│   │   ├── models/               → Training scripts
│   │   └── inference/            → Inference & URL detection
│   ├── data/                     → Datasets (JSONL, CSV, images)
│   └── artifacts/                → Trained model weights
├── docker-compose.yml → Multi-service orchestration
└── SETUP_GUIDE.md     → Complete setup & Hugging Face guide
```

## Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Chrome (for Selenium)

### 1. Start the Scraper Service
```bash
cd scraper-service
pip install -r requirements.txt
uvicorn scraper_api:app --host 127.0.0.1 --port 8000
```

### 2. Start the AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 7860
```

### 3. Start the Backend Orchestrator
```bash
cd backend
npm install
npx nodemon src/server.js
```

### 4. Start the Frontend Dashboard
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000 in your browser.

## How to Train Models
```bash
cd ai-service
python run_all.py
```
Or step by step:
```bash
python -m src.data.process_master_dataset_2
python -m src.data.generate_labels_csv
python -m src.models.train_multimodal
python -m src.models.train_pattern_router
```

## Docker Deployment
```bash
docker-compose up --build
```

## Hugging Face Deployment
See `SETUP_GUIDE.md` for complete instructions on:
- Getting a Hugging Face API token
- Uploading models to Hugging Face Hub
- Deploying on Hugging Face Spaces
- Using the Inference API

## Pipeline Flow
```
User URL → React Frontend → Node.js Backend → Scraper (screenshot)
                                             → AI Service:
                                                1. OCR text extraction
                                                2. Gate Model (RoBERTa binary filter)
                                                3. Pattern Router (TF-IDF classification)
                                                4. Compliance Engine (GDPR mapping)
                                             → Compliance Report → React Dashboard
```

## Dark Patterns Detected
| Pattern | Category | GDPR Article |
|---------|----------|-------------|
| Deceptive Snugness | Skipping | Art. 25(1), Art. 6/4(11) |
| Look Over There | Skipping | Art. 5(1)(a), Art. 12 |
| Emotional Steering | Stirring | Art. 5(1)(a), Art. 12, Art. 8 |
| Hidden in Plain Sight | Stirring | Art. 5(1)(a), Art. 7, Art. 12 |
| Misleading Information | Hindering | Art. 5(1)(a), Art. 12, Art. 7 |
| Too Many Options | Overloading | Art. 5(1)(a), Art. 12 |
| Ambiguous Wording | Left in the Dark | Art. 5(1)(a), Art. 12, Art. 13 |
