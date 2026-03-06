# ============================================================
# AUTOMATED DARK PATTERN DETECTION - COMPLETE SETUP GUIDE
# ============================================================
# Step-by-step: Installation, Hugging Face API, Full Code Setup
# ============================================================


# ╔══════════════════════════════════════════════════════════════╗
# ║  TABLE OF CONTENTS                                         ║
# ║                                                            ║
# ║  PART 1: PREREQUISITES & INSTALLATION                      ║
# ║  PART 2: HUGGING FACE - COMPLETE GUIDE                     ║
# ║  PART 3: PROJECT ARCHITECTURE                              ║
# ║  PART 4: SCRAPER SERVICE SETUP                             ║
# ║  PART 5: AI SERVICE SETUP                                  ║
# ║  PART 6: BACKEND (NODE.JS) SETUP                           ║
# ║  PART 7: FRONTEND (REACT) SETUP                            ║
# ║  PART 8: RUNNING THE FULL PIPELINE                         ║
# ║  PART 9: DOCKER DEPLOYMENT                                 ║
# ║  PART 10: TROUBLESHOOTING                                  ║
# ║  PART 11: FREE ONLINE DEPLOYMENT (STEP-BY-STEP)            ║
# ╚══════════════════════════════════════════════════════════════╝


# ================================================================
# PART 1: PREREQUISITES & INSTALLATION
# ================================================================

# ---- 1.1 Install Python (3.10+) ----
# Download from: https://www.python.org/downloads/
# ✅ CHECK "Add Python to PATH" during installation
# Verify:
#   python --version
#   pip --version

# ---- 1.2 Install Node.js (18+) ----
# Download from: https://nodejs.org/en/download
# Choose LTS version
# Verify:
#   node --version
#   npm --version

# ---- 1.3 Install Git ----
# Download from: https://git-scm.com/downloads
# Verify:
#   git --version

# ---- 1.4 Install Google Chrome ----
# Required for Selenium web scraping
# Download from: https://www.google.com/chrome/

# ---- 1.5 Install ChromeDriver ----
# Option A (Recommended): selenium-manager handles it automatically (Selenium 4.6+)
# Option B (Manual):
#   1. Check Chrome version: chrome://settings/help
#   2. Download matching driver from: https://googlechromelabs.github.io/chrome-for-testing/
#   3. Add to system PATH

# ---- 1.6 Install Docker (Optional - for containerized deployment) ----
# Download Docker Desktop from: https://www.docker.com/products/docker-desktop
# Verify:
#   docker --version
#   docker-compose --version


# ================================================================
# PART 2: HUGGING FACE - COMPLETE GUIDE
# ================================================================

# ╔══════════════════════════════════════════════════════════════╗
# ║  2.1  WHAT IS HUGGING FACE?                                ║
# ║                                                            ║
# ║  Hugging Face is a platform for hosting and using           ║
# ║  ML models. For this project, we use it to:                ║
# ║  - Download pre-trained models (RoBERTa, LayoutLMv3)       ║
# ║  - Host our fine-tuned model via Hugging Face Spaces        ║
# ║  - Use the Inference API for production deployment          ║
# ╚══════════════════════════════════════════════════════════════╝

# ---- 2.2 CREATE A HUGGING FACE ACCOUNT ----
# Step 1: Go to https://huggingface.co/join
# Step 2: Sign up with email/Google/GitHub
# Step 3: Verify your email

# ---- 2.3 GET YOUR HUGGING FACE API TOKEN ----
# 
# METHOD 1: Access Tokens (Recommended)
#   Step 1: Go to https://huggingface.co/settings/tokens
#   Step 2: Click "New token"
#   Step 3: Name it (e.g., "dark-pattern-detection")
#   Step 4: Select "Write" permission (for pushing models)
#   Step 5: Click "Generate"
#   Step 6: Copy the token (starts with "hf_...")
#   Step 7: Save it securely - you won't see it again!
#   Example: hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
#
# METHOD 2: CLI Login
#   pip install huggingface_hub
#   huggingface-cli login
#   # Paste your token when prompted
#
# METHOD 3: Environment Variable
#   # Windows PowerShell:
#   $env:HUGGINGFACE_TOKEN = "hf_your_token_here"
#   # Or add to .env file:
#   HUGGINGFACE_TOKEN=hf_your_token_here
#
# METHOD 4: In Python Code
#   from huggingface_hub import login
#   login(token="hf_your_token_here")

# ---- 2.4 METHODS TO USE HUGGING FACE MODELS ----
#
# ┌─────────────────────────────────────────────────────────────┐
# │ METHOD A: Inference API (Serverless - Easiest)              │
# │ - No GPU needed on your machine                            │
# │ - Send HTTP requests to Hugging Face servers                │
# │ - Free tier: Rate limited                                  │
# │ - Pro tier ($9/mo): Higher limits                          │
# │                                                            │
# │ Usage:                                                     │
# │   import requests                                          │
# │   API_URL = "https://api-inference.huggingface.co/models/" │
# │   headers = {"Authorization": "Bearer hf_your_token"}      │
# │   response = requests.post(API_URL + "model_name",         │
# │              headers=headers, json={"inputs": "text"})      │
# └─────────────────────────────────────────────────────────────┘
#
# ┌─────────────────────────────────────────────────────────────┐
# │ METHOD B: Hugging Face Spaces (Recommended for this project)│
# │ - Host your model as a web app on HF servers                │
# │ - Free CPU tier or paid GPU tier                            │
# │ - Uses Gradio or FastAPI                                    │
# │ - Gets a public URL automatically                          │
# │                                                            │
# │ Steps:                                                     │
# │   1. Go to https://huggingface.co/spaces                   │
# │   2. Click "Create new Space"                              │
# │   3. Choose "Gradio" or "Docker" SDK                        │
# │   4. Upload your model files                                │
# │   5. Get URL: https://YOUR_USERNAME-SPACE_NAME.hf.space     │
# └─────────────────────────────────────────────────────────────┘
#
# ┌─────────────────────────────────────────────────────────────┐
# │ METHOD C: Local Transformers (What we use for training)     │
# │ - Run models directly on your machine                       │
# │ - Needs GPU for large models (or CPU with patience)         │
# │ - Full control over inference                               │
# │                                                            │
# │ Usage:                                                     │
# │   from transformers import AutoModelForSequenceClassification│
# │   model = AutoModelForSequenceClassification.from_pretrained│
# │           ("your-model-name")                               │
# └─────────────────────────────────────────────────────────────┘
#
# ┌─────────────────────────────────────────────────────────────┐
# │ METHOD D: Inference Endpoints (Dedicated GPU - Production)  │
# │ - Dedicated GPU server on Hugging Face                     │
# │ - Starts at ~$0.06/hr for small GPU                        │
# │ - Best for production with high traffic                     │
# │                                                            │
# │ Steps:                                                     │
# │   1. Go to https://huggingface.co/inference-endpoints       │
# │   2. Select your model                                      │
# │   3. Choose GPU type and region                             │
# │   4. Deploy → Get dedicated API URL                         │
# └─────────────────────────────────────────────────────────────┘

# ---- 2.5 UPLOAD YOUR MODEL TO HUGGING FACE HUB ----
#
# Step 1: Install the hub library
#   pip install huggingface_hub
#
# Step 2: Login
#   huggingface-cli login
#
# Step 3: Create a model repository
#   huggingface-cli repo create dark-pattern-detector --type model
#
# Step 4: Upload model files via Python
#   from huggingface_hub import HfApi
#   api = HfApi()
#   api.upload_folder(
#       folder_path="artifacts/roberta_scraped_model",
#       repo_id="YOUR_USERNAME/dark-pattern-detector",
#       repo_type="model"
#   )
#
# Step 5: Your model is now at:
#   https://huggingface.co/YOUR_USERNAME/dark-pattern-detector

# ---- 2.6 CREATE & DEPLOY A HUGGING FACE SPACE (step-by-step) ----
#
# ╔══════════════════════════════════════════════════════════════════╗
# ║  WHAT HAPPENS: You create an empty Space on HF, clone it to    ║
# ║  your PC, copy your AI files into it, then push. HF builds     ║
# ║  and hosts it automatically. You get a public URL for your AI.  ║
# ╚══════════════════════════════════════════════════════════════════╝
#
# ── Step 1: Create the Space on Hugging Face website ──
#   1. Go to https://huggingface.co/new-space
#   2. Fill in:
#       - Owner: Your HF username
#       - Space name: dark-pattern-detection
#       - License: MIT (or your choice)
#       - SDK: Docker   ← IMPORTANT: select "Docker" not "Gradio"
#       - Hardware: CPU Basic (free) or T4 GPU if needed
#   3. Click "Create Space"
#   4. You now have an EMPTY space at:
#       https://huggingface.co/spaces/YOUR_USERNAME/dark-pattern-detection
#
#
# ── Step 2: Clone the empty Space to your PC ──
#   Open a terminal and run:
#
#   cd C:\Users\nitis\Downloads\ETP
#   git clone https://huggingface.co/spaces/YOUR_USERNAME/dark-pattern-detection hf-space
#
#   This creates a new folder called "hf-space" on your PC.
#
#
# ── Step 3: Copy your AI service files INTO the cloned folder ──
#   You need to copy these files FROM your project INTO hf-space/:
#
#   FROM (your project)                          →  TO (hf-space/)
#   ─────────────────────────────────────────────────────────────
#   ai-service\app.py                            →  hf-space\app.py
#   ai-service\compliance_engine.py              →  hf-space\compliance_engine.py
#   ai-service\requirements.txt                  →  hf-space\requirements.txt
#   ai-service\artifacts\pattern_router.joblib   →  hf-space\artifacts\pattern_router.joblib
#   ai-service\artifacts\roberta_scraped_model\  →  hf-space\artifacts\roberta_scraped_model\  (entire folder)
#
#   PowerShell commands to do this:
#
#   $src = "C:\Users\nitis\Downloads\ETP\VS Code Project\Automated_Dark_Pattern_Detection\ai-service"
#   $dst = "C:\Users\nitis\Downloads\ETP\hf-space"
#
#   Copy-Item "$src\app.py" "$dst\app.py"
#   Copy-Item "$src\compliance_engine.py" "$dst\compliance_engine.py"
#   Copy-Item "$src\requirements.txt" "$dst\requirements.txt"
#   New-Item -ItemType Directory -Path "$dst\artifacts" -Force
#   Copy-Item "$src\artifacts\pattern_router.joblib" "$dst\artifacts\pattern_router.joblib"
#   Copy-Item "$src\artifacts\roberta_scraped_model" "$dst\artifacts\roberta_scraped_model" -Recurse
#
#
# ── Step 4: Create the Dockerfile inside hf-space/ ──
#   Create a new file called "Dockerfile" (no extension) at hf-space\Dockerfile
#   with this EXACT content:
#
#   ──── START: Dockerfile content ────
#   FROM python:3.10-slim
#
#   WORKDIR /app
#
#   # Install system dependencies for pytesseract OCR
#   RUN apt-get update && apt-get install -y \
#       tesseract-ocr \
#       libtesseract-dev \
#       && rm -rf /var/lib/apt/lists/*
#
#   # Copy and install Python dependencies
#   COPY requirements.txt .
#   RUN pip install --no-cache-dir -r requirements.txt
#
#   # Copy application code and model artifacts
#   COPY app.py .
#   COPY compliance_engine.py .
#   COPY artifacts/ ./artifacts/
#
#   # Hugging Face Spaces expects port 7860
#   EXPOSE 7860
#
#   CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
#   ──── END: Dockerfile content ────
#
#
# ── Step 5: Your hf-space/ folder should now look like this ──
#
#   hf-space/
#   ├── Dockerfile              ← you just created this
#   ├── app.py                  ← copied from ai-service
#   ├── compliance_engine.py    ← copied from ai-service
#   ├── requirements.txt        ← copied from ai-service
#   └── artifacts/
#       ├── pattern_router.joblib           ← copied from ai-service
#       └── roberta_scraped_model/          ← copied from ai-service
#           ├── config.json
#           ├── merges.txt
#           ├── special_tokens_map.json
#           ├── tokenizer.json
#           ├── tokenizer_config.json
#           └── vocab.json
#
#
# ── Step 6: Push everything to Hugging Face ──
#   cd hf-space
#   git add .
#   git commit -m "Deploy dark pattern detection AI service"
#   git push
#
#   ⚠️  If model files are large (>10MB), you need Git LFS:
#       git lfs install
#       git lfs track "*.joblib"
#       git lfs track "*.bin"
#       git lfs track "*.h5"
#       git add .gitattributes
#       git add .
#       git commit -m "Deploy dark pattern detection AI service"
#       git push
#
#
# ── Step 7: Wait for Hugging Face to build ──
#   Go to https://huggingface.co/spaces/YOUR_USERNAME/dark-pattern-detection
#   You'll see a "Building" status. Wait 2-5 minutes.
#   Once it says "Running", your AI is live!
#
#
# ── Step 8: Your public AI URL is now ──
#   https://YOUR_USERNAME-dark-pattern-detection.hf.space
#
#   Test it in browser — you should see:
#   {"status": "AI Inference Service is running.", "models": {...}}
#
#
# ── Step 9: Connect it to your Node.js backend ──
#   Edit backend\.env and change AI_SERVICE_URL:
#
#   AI_SERVICE_URL=https://YOUR_USERNAME-dark-pattern-detection.hf.space/analyze
#
#   Now your backend will call the HF-hosted AI instead of localhost!


# ================================================================
# PART 3: PROJECT ARCHITECTURE
# ================================================================

# ┌─────────────────────────────────────────────────────────────────┐
# │                     SYSTEM ARCHITECTURE                         │
# │                                                                 │
# │  ┌──────────┐    ┌──────────────┐    ┌────────────────────┐    │
# │  │ REACT    │───▶│ NODE.JS      │───▶│ PYTHON SCRAPER     │    │
# │  │ Frontend │    │ Orchestrator │    │ (Selenium/FastAPI)  │    │
# │  │ :3000    │    │ :5000        │    │ :8000              │    │
# │  └──────────┘    └──────┬───────┘    └────────────────────┘    │
# │                         │                                       │
# │                         ▼                                       │
# │                  ┌──────────────────┐                           │
# │                  │ AI SERVICE       │                           │
# │                  │ (FastAPI/HF)     │                           │
# │                  │ :7860            │                           │
# │                  │                  │                           │
# │                  │ Gate Model       │                           │
# │                  │ (RoBERTa binary) │                           │
# │                  │       ↓          │                           │
# │                  │ Pattern Router   │                           │
# │                  │ (TF-IDF+LogReg)  │                           │
# │                  │       ↓          │                           │
# │                  │ Compliance Engine│                           │
# │                  │ (GDPR Mapping)   │                           │
# │                  └──────────────────┘                           │
# │                                                                 │
# │  FLOW:                                                          │
# │  1. User enters URL in React → sends to Node.js                │
# │  2. Node.js calls Scraper → gets screenshot                    │
# │  3. Node.js sends screenshot + URL to AI Service               │
# │  4. AI analyzes → Gate model filters → Router classifies       │
# │  5. Compliance Engine maps to GDPR violations                  │
# │  6. Report returned to React dashboard                         │
# └─────────────────────────────────────────────────────────────────┘


# ================================================================
# PART 4: SCRAPER SERVICE SETUP (Python + Selenium)
# ================================================================

# Step 1: Navigate to scraper directory
#   cd scraper-service

# Step 2: Create a virtual environment (recommended)
#   python -m venv venv
#   .\venv\Scripts\activate   # Windows
#   # source venv/bin/activate  # Mac/Linux

# Step 3: Install dependencies
#   pip install -r requirements.txt
#
# requirements.txt contains:
#   fastapi==0.104.1
#   uvicorn==0.24.0
#   selenium==4.15.2
#   pydantic==2.5.2

# Step 4: Run the scraper service
#   uvicorn scraper_api:app --host 127.0.0.1 --port 8000 --reload
#
# Expected output:
#   INFO:     Uvicorn running on http://127.0.0.1:8000

# Step 5: Test it
#   # In a new terminal:
#   curl -X POST http://127.0.0.1:8000/api/capture \
#     -H "Content-Type: application/json" \
#     -d '{"target_url": "https://example.com"}'
#
#   # Or in PowerShell:
#   Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8000/api/capture" `
#     -ContentType "application/json" `
#     -Body '{"target_url": "https://example.com"}'


# ================================================================
# PART 5: AI SERVICE SETUP (Python + FastAPI + Hugging Face)
# ================================================================

# Step 1: Navigate to ai-service directory
#   cd ai-service

# Step 2: Create a virtual environment
#   python -m venv venv
#   .\venv\Scripts\activate

# Step 3: Install dependencies
#   pip install -r requirements.txt
#
# Additional packages needed for real inference:
#   pip install huggingface_hub
#   pip install playwright
#   playwright install chromium
#   pip install joblib
#   pip install tensorflow   # For the gate model (TFAutoModelForSequenceClassification)
#
# Note: If you only have CPU, use:
#   pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
#
# For GPU (CUDA 11.8):
#   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
#
# For GPU (CUDA 12.1):
#   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# Step 4: Train models (if not already trained)
#
#   # Option A: Run the full training pipeline
#   python run_all.py
#
#   # Option B: Train step by step
#   python -m src.data.process_master_dataset_2      # Process JSONL → CSV
#   python -m src.data.generate_labels_csv            # Generate image labels
#   python -m src.models.train_multimodal             # Train fusion model
#   python -m src.models.train_pattern_router         # Train pattern router
#
# After training, you should have these artifacts:
#   artifacts/
#   ├── multimodal_model/
#   │   ├── fusion_model.pt
#   │   ├── label_map.json
#   │   └── tokenizer/
#   ├── pattern_router.joblib
#   └── roberta_scraped_model/
#       ├── config.json
#       ├── tf_model.h5
#       ├── tokenizer.json
#       └── tokenizer_config.json

# Step 5: Create .env file in ai-service/
#   HUGGINGFACE_TOKEN=hf_your_token_here
#   MODEL_TYPE=local  
#   # Options: "local" (use local artifacts) or "huggingface" (use HF API)

# Step 6: Run the AI service
#   uvicorn app:app --host 127.0.0.1 --port 7860 --reload

# Step 7: Test the inference
#   python -m src.inference.detect_url_with_router_highacc "https://example.com"


# ================================================================
# PART 6: BACKEND (NODE.JS) SETUP
# ================================================================

# Step 1: Navigate to backend directory
#   cd backend

# Step 2: Install dependencies
#   npm install

# Step 3: Create .env file in backend/
#   PORT=5000
#   SCRAPER_API_URL=http://127.0.0.1:8000/api/capture
#   AI_SERVICE_URL=http://127.0.0.1:7860/analyze
#   
#   # If using Hugging Face Spaces for AI:
#   # AI_SERVICE_URL=https://YOUR_USERNAME-dark-pattern-detection.hf.space/analyze

# Step 4: Run the backend
#   npx nodemon src/server.js
#
# Expected output:
#   🚀 Node.js Orchestrator running on http://localhost:5000


# ================================================================
# PART 7: FRONTEND (REACT) SETUP
# ================================================================

# Step 1: Navigate to frontend directory
#   cd frontend

# Step 2: Install dependencies
#   npm install
#
# Additional packages for the full dashboard:
#   npm install tailwindcss @tailwindcss/forms lucide-react

# Step 3: Initialize Tailwind CSS
#   npx tailwindcss init

# Step 4: Run the frontend
#   npm start
#
# Expected output:
#   Compiled successfully!
#   You can now view frontend in the browser.
#   Local: http://localhost:3000


# ================================================================
# PART 8: RUNNING THE FULL PIPELINE
# ================================================================

# ---- Open 3 separate terminal windows ----

# Terminal 1 - Scraper Service:
#   cd scraper-service
#   .\venv\Scripts\activate
#   uvicorn scraper_api:app --host 127.0.0.1 --port 8000

# Terminal 2 - AI Service:
#   cd ai-service
#   .\venv\Scripts\activate
#   uvicorn app:app --host 127.0.0.1 --port 7860

# Terminal 3 - Backend:
#   cd backend
#   npx nodemon src/server.js

# Terminal 4 - Frontend:
#   cd frontend
#   npm start

# Then open http://localhost:3000 in your browser
# Enter a URL and click "Run Full Audit"


# ================================================================
# PART 9: DOCKER DEPLOYMENT (All-in-one)
# ================================================================

# Step 1: Make sure Docker Desktop is running

# Step 2: From the project root directory:
#   docker-compose up --build

# This will:
#   - Build and start all 4 services
#   - Scraper on port 8000
#   - AI Service on port 7860
#   - Backend on port 5000
#   - Frontend on port 3000

# To stop:
#   docker-compose down

# To rebuild after changes:
#   docker-compose up --build --force-recreate


# ================================================================
# PART 10: TROUBLESHOOTING
# ================================================================

# Issue: "ChromeDriver not found"
#   → Install Chrome and let Selenium auto-download the driver
#   → Or: pip install webdriver-manager
#     Then in scraper_api.py: 
#       from webdriver_manager.chrome import ChromeDriverManager
#       driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)

# Issue: "CUDA out of memory"
#   → Use CPU: Set device = "cpu" in training scripts
#   → Or reduce batch size in train_multimodal.py (BATCH = 4)

# Issue: "Module not found" errors
#   → Make sure you're in the right directory
#   → Make sure virtual environment is activated
#   → Run: pip install -r requirements.txt

# Issue: "CORS error" in browser
#   → The backend already has cors() middleware
#   → Make sure backend is running on port 5000

# Issue: "Connection refused" from Node.js
#   → Make sure scraper (8000) and AI service (7860) are running
#   → Check the URLs in backend .env file

# Issue: "Rate limited" on Hugging Face API
#   → Use a paid plan or host locally
#   → Or use Hugging Face Spaces instead of Inference API

# Issue: "react-scripts not found" or ajv errors
#   → Delete node_modules and package-lock.json
#   → Run: npm install --legacy-peer-deps
#   → If ajv error persists: npm install ajv@8.12.0

# Issue: HF Space "1GB storage limit"
#   → Don't push fusion_model.pt to HF Spaces
#   → Use Git LFS for large files: git lfs track "*.pt"
#   → Or host AI service on Render instead (see Part 11)

# Issue: "react-router-dom not found"
#   → Run: npm install react-router-dom --legacy-peer-deps

# Issue: "html2canvas not found"
#   → Run: npm install html2canvas --legacy-peer-deps


# ================================================================
# PART 11: FREE ONLINE DEPLOYMENT (STEP-BY-STEP)
# ================================================================
# Deploy ALL services online for FREE — no credit card needed!
#
# Architecture when deployed:
#   React Frontend (Vercel/Netlify) 
#     → Node.js Backend (Render)
#       → AI Service (Hugging Face Spaces or Render)
#       → Scraper Service (Render)
#
# ================================================================

# ────────────────────────────────────────────────────────────────
# 11.1 DEPLOY FRONTEND ON VERCEL (FREE)
# ────────────────────────────────────────────────────────────────
#
# Vercel is the easiest way to deploy a React app. 100% free.
#
# STEP 1: Push your code to GitHub
#   a. Create a GitHub repository at https://github.com/new
#   b. Name it: dark-pattern-detection
#   c. Run in your project root:
#
#      git init
#      git add .
#      git commit -m "Initial commit"
#      git branch -M main
#      git remote add origin https://github.com/YOUR_USERNAME/dark-pattern-detection.git
#      git push -u origin main
#
# STEP 2: Sign up at https://vercel.com (use your GitHub account)
#
# STEP 3: Click "Add New Project" → Import your GitHub repo
#
# STEP 4: Configure build settings:
#   - Framework Preset: Create React App
#   - Root Directory: frontend
#   - Build Command: npm run build
#   - Output Directory: build
#
# STEP 5: Add Environment Variable:
#   - Name:  REACT_APP_API_URL
#   - Value: https://YOUR-BACKEND.onrender.com/api
#   (You'll get this URL after deploying the backend in step 11.2)
#
# STEP 6: Click "Deploy" → Wait 1-2 minutes
#
# RESULT: Your frontend is live at https://your-project.vercel.app
#
# ✅ ALTERNATIVE: Deploy on Netlify (also free)
#   - Sign up at https://netlify.com
#   - Drag & drop your frontend/build folder
#   - Or connect to GitHub for auto-deploy

# ────────────────────────────────────────────────────────────────
# 11.2 DEPLOY NODE.JS BACKEND ON RENDER (FREE)
# ────────────────────────────────────────────────────────────────
#
# Render gives you free web services with 750 hours/month.
#
# STEP 1: Sign up at https://render.com (use GitHub)
#
# STEP 2: Click "New" → "Web Service"
#
# STEP 3: Connect your GitHub repo
#
# STEP 4: Configure:
#   - Name: dark-pattern-backend
#   - Root Directory: backend
#   - Runtime: Node
#   - Build Command: npm install
#   - Start Command: node src/server.js
#   - Instance Type: Free
#
# STEP 5: Add Environment Variables:
#   - PORT = 5000
#   - SCRAPER_API_URL = https://YOUR-SCRAPER.onrender.com/api/capture
#   - AI_SERVICE_URL = https://YOUR-AI-SERVICE.onrender.com/analyze
#   (Update these after deploying scraper and AI service below)
#
# STEP 6: Click "Create Web Service" → Wait 3-5 minutes
#
# RESULT: Your backend is live at https://dark-pattern-backend.onrender.com
#
# ⚠️ NOTE: Free Render services sleep after 15 min of inactivity.
#          First request after sleep takes ~30 seconds to wake up.

# ────────────────────────────────────────────────────────────────
# 11.3 DEPLOY AI SERVICE ON HUGGING FACE SPACES (FREE)
# ────────────────────────────────────────────────────────────────
#
# HF Spaces gives you free Docker containers for ML models.
# ⚠️ IMPORTANT: fusion_model.pt is ~988MB which exceeds the 1GB limit.
#    SOLUTION: Upload fusion model to a SEPARATE HF Model repo,
#    then app.py auto-downloads it at runtime.
#
# ── STEP A: Upload Fusion Model to HF Model Repo ──
#
# 1. Install huggingface_hub:
#      pip install huggingface_hub
#
# 2. Run the upload script:
#      cd ai-service
#      python upload_model_to_hf.py
#    (Enter your HF token when prompted — get one at https://huggingface.co/settings/tokens)
#
# 3. Verify at: https://huggingface.co/nitishfounded/dark-pattern-fusion-model
#    You should see fusion_model.pt, label_map.json, and tokenizer/ files
#
# ── STEP B: Create HF Space (WITHOUT the large model file) ──
#
# STEP 1: Go to https://huggingface.co/spaces → "Create new Space"
#   - Name: dark-pattern-ai
#   - SDK: Docker
#   - Visibility: Public
#
# STEP 2: Clone the Space:
#   git clone https://huggingface.co/spaces/YOUR_USERNAME/dark-pattern-ai
#   cd dark-pattern-ai
#
# STEP 3: Copy these files (WITHOUT fusion_model.pt):
#   - app.py
#   - compliance_engine.py
#   - requirements.txt
#   - artifacts/pattern_router.joblib
#   - artifacts/roberta_scraped_model/ (entire directory)
#   - artifacts/multimodal_model/label_map.json
#   - artifacts/multimodal_model/tokenizer/ (entire directory)
#   ⚠️ Do NOT copy artifacts/multimodal_model/fusion_model.pt!
#      app.py will auto-download it from the HF Model repo at startup.
#
# STEP 4: Create a Dockerfile in the Space root:
#
#   FROM python:3.10-slim
#   RUN apt-get update && apt-get install -y tesseract-ocr && rm -rf /var/lib/apt/lists/*
#   WORKDIR /app
#   COPY requirements.txt .
#   RUN pip install --no-cache-dir -r requirements.txt
#   COPY . .
#   EXPOSE 7860
#   CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
#
# STEP 5: Set up Git LFS for remaining large files:
#   git lfs install
#   git lfs track "*.h5"
#   git lfs track "*.joblib"
#   git add .gitattributes
#
# STEP 6: Add environment variable in HF Space Settings:
#   HF_FUSION_REPO = nitishfounded/dark-pattern-fusion-model
#
# STEP 7: Push to Hugging Face:
#   git add .
#   git commit -m "Deploy AI service"
#   git push
#
# ⚠️ If you get auth errors:
#   a. Create a token at https://huggingface.co/settings/tokens
#      → Permissions: "Write" → Copy the token (hf_xxxxx)
#   b. git remote set-url origin https://YOUR_USERNAME:hf_YOUR_TOKEN@huggingface.co/spaces/YOUR_USERNAME/dark-pattern-ai
#   c. git push
#
# HOW IT WORKS:
#   1. HF Space starts → app.py runs load_models()
#   2. load_models() calls download_fusion_from_hf()
#   3. Fusion model is downloaded from HF Model repo to local cache
#   4. Both models (gate + fusion) are loaded and used for ensemble inference
#
# ALTERNATIVE: Quantize the model first (optional, for faster startup):
#   cd ai-service
#   python quantize_model.py
#   → This shrinks fusion_model.pt from ~988MB to ~250MB
#   → Then re-upload the quantized version
#
# RESULT: AI service is live at https://YOUR_USERNAME-dark-pattern-ai.hf.space
#
# ─── 11.3b ALTERNATIVE: Deploy AI Service on Render ───
#
# If HF Spaces has size limits, deploy on Render instead:
#
# STEP 1: New → Web Service → Connect GitHub repo
# STEP 2: Configure:
#   - Name: dark-pattern-ai
#   - Root Directory: ai-service
#   - Runtime: Docker (or Python)
#   - Instance Type: Free
#   - If Docker: Create the same Dockerfile above in ai-service/
#   - If Python:
#     - Build Command: pip install -r requirements.txt
#     - Start Command: uvicorn app:app --host 0.0.0.0 --port 7860
# STEP 3: Add env var: PORT = 7860
# STEP 4: Deploy

# ────────────────────────────────────────────────────────────────
# 11.4 DEPLOY SCRAPER SERVICE ON RENDER (FREE)
# ────────────────────────────────────────────────────────────────
#
# The scraper needs Chrome/Selenium, so we use Docker on Render.
#
# STEP 1: Make sure scraper-service/Dockerfile exists (already created)
#
# STEP 2: On Render → New → Web Service → Connect GitHub
#
# STEP 3: Configure:
#   - Name: dark-pattern-scraper
#   - Root Directory: scraper-service
#   - Runtime: Docker
#   - Instance Type: Free
#
# STEP 4: Add Environment Variables:
#   - EXPORT_DIR = /app/exports
#
# STEP 5: Deploy → Wait 5 minutes
#
# RESULT: Scraper is live at https://dark-pattern-scraper.onrender.com
#
# ⚠️ NOTE: Selenium on free tier can be slow. Consider using
#          Playwright instead (lighter weight) or a headless browser API.

# ────────────────────────────────────────────────────────────────
# 11.5 CONNECT ALL SERVICES TOGETHER
# ────────────────────────────────────────────────────────────────
#
# After all 4 services are deployed, update the environment variables:
#
# ON VERCEL (Frontend):
#   REACT_APP_API_URL = https://dark-pattern-backend.onrender.com/api
#
# ON RENDER (Backend):
#   SCRAPER_API_URL = https://dark-pattern-scraper.onrender.com/api/capture
#   AI_SERVICE_URL = https://dark-pattern-ai.onrender.com/analyze
#   (or if using HF Spaces: https://YOUR_USERNAME-dark-pattern-ai.hf.space/analyze)
#
# ON RENDER (Backend) - also add CORS for your frontend domain:
#   FRONTEND_URL = https://your-project.vercel.app
#
# DONE! Your full stack is now live and free:
#   Frontend: https://your-project.vercel.app
#   Backend:  https://dark-pattern-backend.onrender.com
#   AI:       https://YOUR_USERNAME-dark-pattern-ai.hf.space (or Render)
#   Scraper:  https://dark-pattern-scraper.onrender.com

# ────────────────────────────────────────────────────────────────
# 11.6 COMPLETE FREE HOSTING COMPARISON
# ────────────────────────────────────────────────────────────────
#
# ┌──────────────────┬────────────────────┬──────────────┬───────────────┐
# │ Service          │ Host               │ Free Tier    │ Limits        │
# ├──────────────────┼────────────────────┼──────────────┼───────────────┤
# │ React Frontend   │ Vercel             │ Unlimited    │ 100GB BW/mo   │
# │ React Frontend   │ Netlify            │ Unlimited    │ 100GB BW/mo   │
# │ React Frontend   │ GitHub Pages       │ Unlimited    │ Static only   │
# │ Node.js Backend  │ Render             │ 750 hrs/mo   │ Sleeps 15min  │
# │ Node.js Backend  │ Railway            │ 500 hrs/mo   │ $5 credit/mo  │
# │ Python AI        │ HF Spaces          │ Unlimited    │ 1GB storage   │
# │ Python AI        │ Render             │ 750 hrs/mo   │ Sleeps 15min  │
# │ Python Scraper   │ Render             │ 750 hrs/mo   │ Needs Docker  │
# │ All-in-one       │ Railway            │ 500 hrs/mo   │ Docker ok     │
# └──────────────────┴────────────────────┴──────────────┴───────────────┘
#
# RECOMMENDED COMBO (100% free):
#   Frontend → Vercel  (fastest, auto-deploy from GitHub)
#   Backend  → Render  (easy Node.js hosting)
#   AI       → HF Spaces (purpose-built for ML models)
#   Scraper  → Render  (Docker support for Chrome)

# ────────────────────────────────────────────────────────────────
# 11.7 TROUBLESHOOTING ONLINE DEPLOYMENT
# ────────────────────────────────────────────────────────────────
#
# Issue: "Service unavailable" on first visit
#   → Free Render services sleep after 15 min. Wait 30 seconds.
#   → Add a cron job to ping your service every 14 min:
#     Use https://cron-job.org (free) to ping your backend URL
#
# Issue: "CORS error" after deploying
#   → Update backend server.js to allow your Vercel domain:
#     app.use(cors({ origin: ['https://your-project.vercel.app', 'http://localhost:3000'] }));
#
# Issue: "Build failed" on Vercel
#   → Set Root Directory to "frontend" in Vercel settings
#   → Add "CI=false" as environment variable to ignore warnings
#
# Issue: "Docker build failed" on Render
#   → Check Dockerfile COPY paths match your file structure
#   → View build logs in Render dashboard
#
# Issue: HF Space build errors
#   → Don't include src/ or data/ in COPY commands
#   → Only copy: app.py, compliance_engine.py, requirements.txt, artifacts/
#
# Issue: "Timeout" when analyzing websites
#   → Free tier services are slow. Increase timeout in backend:
#     const aiResponse = await axios.post(AI_SERVICE_URL, formData, {
#       timeout: 120000,  // 2 minutes
#     });
#
# Issue: Screenshots not working online
#   → Scraper needs Chrome installed (Docker handles this)
#   → Some hosting providers block headless browsers
#   → Alternative: Use a screenshot API like https://screenshotapi.net (free tier)
#
# ════════════════════════════════════════════════════════════════
# END OF SETUP GUIDE
# ════════════════════════════════════════════════════════════════
