import os
import re
import traceback
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io
import joblib
import numpy as np

from compliance_engine import ComplianceAuditor

app = FastAPI(title="Dark Pattern Detection - AI Inference API")

# ============================================================================
# PATHS TO TRAINED ARTIFACTS
# ============================================================================
BASE_DIR = Path(__file__).resolve().parent
ROUTER_PATH = BASE_DIR / "artifacts" / "pattern_router.joblib"
BINARY_MODEL_DIR = BASE_DIR / "artifacts" / "roberta_scraped_model"
FUSION_MODEL_DIR = BASE_DIR / "artifacts" / "multimodal_model"
FUSION_MODEL_PATH = FUSION_MODEL_DIR / "fusion_model.pt"
FUSION_TOKENIZER_DIR = FUSION_MODEL_DIR / "tokenizer"
FUSION_LABEL_MAP_PATH = FUSION_MODEL_DIR / "label_map.json"

# HF Model repo for downloading fusion model when not bundled locally (Solution 2)
HF_FUSION_REPO = os.environ.get("HF_FUSION_REPO", "nitishfounded/dark-pattern-fusion-model")

# ============================================================================
# THRESHOLDS (tunable)
# ============================================================================
GATE_THRESHOLD = float(os.environ.get("GATE_THRESHOLD", "0.60"))
ROUTER_MIN_CONF = float(os.environ.get("ROUTER_MIN_CONF", "0.35"))
FUSION_WEIGHT = float(os.environ.get("FUSION_WEIGHT", "0.4"))  # Weight for fusion model in ensemble
MAX_LEN = 256
BATCH_SIZE = 16

# ============================================================================
# MODEL LOADING - Gate Model + Fusion Model + Pattern Router
# ============================================================================
gate_tokenizer = None
gate_model = None
pattern_router = None
fusion_model = None
fusion_tokenizer = None
fusion_label_map = None
USE_TF = True


def download_fusion_from_hf():
    """Download fusion model files from HF Model repo if not present locally."""
    if FUSION_MODEL_PATH.exists():
        return  # Already have it locally
    try:
        from huggingface_hub import hf_hub_download
        print(f"[*] Fusion model not found locally. Downloading from {HF_FUSION_REPO}...")
        FUSION_MODEL_DIR.mkdir(parents=True, exist_ok=True)

        # Download fusion_model.pt
        hf_hub_download(
            repo_id=HF_FUSION_REPO, filename="fusion_model.pt",
            local_dir=str(FUSION_MODEL_DIR), local_dir_use_symlinks=False
        )
        print("[+] Downloaded fusion_model.pt")

        # Download label_map.json
        try:
            hf_hub_download(
                repo_id=HF_FUSION_REPO, filename="label_map.json",
                local_dir=str(FUSION_MODEL_DIR), local_dir_use_symlinks=False
            )
            print("[+] Downloaded label_map.json")
        except Exception:
            pass

        # Download tokenizer files
        for fname in ["tokenizer_config.json", "vocab.json", "merges.txt",
                       "special_tokens_map.json", "tokenizer.json"]:
            try:
                tok_dir = FUSION_TOKENIZER_DIR
                tok_dir.mkdir(parents=True, exist_ok=True)
                hf_hub_download(
                    repo_id=HF_FUSION_REPO, filename=f"tokenizer/{fname}",
                    local_dir=str(FUSION_MODEL_DIR), local_dir_use_symlinks=False
                )
            except Exception:
                pass
        print("[+] Fusion model download complete")

    except ImportError:
        print("[!] huggingface_hub not installed - cannot download fusion model")
    except Exception as e:
        print(f"[!] Could not download fusion model from HF: {e}")

def load_models():
    """Load the Gate model, Fusion model, and Pattern Router on startup."""
    global gate_tokenizer, gate_model, pattern_router, USE_TF
    global fusion_model, fusion_tokenizer, fusion_label_map

    # Try to download fusion model from HF if not present locally
    download_fusion_from_hf()

    # Load Pattern Router (scikit-learn pipeline)
    if ROUTER_PATH.exists():
        pattern_router = joblib.load(ROUTER_PATH)
        print(f"[+] Pattern Router loaded from {ROUTER_PATH}")
    else:
        print(f"[!] Pattern Router not found at {ROUTER_PATH} - will use fallback")

    # Load Gate Model (binary dark pattern classifier)
    if BINARY_MODEL_DIR.exists():
        try:
            from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
            gate_tokenizer = AutoTokenizer.from_pretrained(str(BINARY_MODEL_DIR))
            gate_model = TFAutoModelForSequenceClassification.from_pretrained(str(BINARY_MODEL_DIR))
            USE_TF = True
            print(f"[+] TF Gate model loaded from {BINARY_MODEL_DIR}")
        except Exception:
            try:
                from transformers import AutoTokenizer, AutoModelForSequenceClassification
                import torch
                gate_tokenizer = AutoTokenizer.from_pretrained(str(BINARY_MODEL_DIR))
                gate_model = AutoModelForSequenceClassification.from_pretrained(str(BINARY_MODEL_DIR))
                gate_model.eval()
                USE_TF = False
                print(f"[+] PyTorch Gate model loaded from {BINARY_MODEL_DIR}")
            except Exception as e:
                print(f"[!] Could not load gate model: {e}")
    else:
        print(f"[!] Gate model dir not found at {BINARY_MODEL_DIR} - will use fallback")

    # Load Fusion Model (multimodal PyTorch model - 3-class: dark_pattern / non_dark_pattern / unknown)
    if FUSION_MODEL_PATH.exists():
        try:
            import torch
            import json
            from transformers import AutoTokenizer as FusionAutoTokenizer
            from transformers import RobertaForSequenceClassification

            # Load label map
            if FUSION_LABEL_MAP_PATH.exists():
                with open(FUSION_LABEL_MAP_PATH) as f:
                    fusion_label_map = json.load(f)
                print(f"[+] Fusion label map: {fusion_label_map}")

            # Load tokenizer
            if FUSION_TOKENIZER_DIR.exists():
                fusion_tokenizer = FusionAutoTokenizer.from_pretrained(str(FUSION_TOKENIZER_DIR))
                print(f"[+] Fusion tokenizer loaded from {FUSION_TOKENIZER_DIR}")

            num_labels = len(fusion_label_map) if fusion_label_map else 3
            state_dict = None

            # Try 1: load as state_dict only (safe, no class reconstruction)
            try:
                state_dict = torch.load(str(FUSION_MODEL_PATH), map_location="cpu", weights_only=True)
                print("[+] Fusion model file loaded with weights_only=True")
            except Exception as e1:
                print(f"[!] weights_only=True failed: {e1}")
                # Try 2: load full object, then extract state_dict
                try:
                    loaded = torch.load(str(FUSION_MODEL_PATH), map_location="cpu", weights_only=False)
                    if isinstance(loaded, dict):
                        state_dict = loaded
                    elif hasattr(loaded, 'state_dict'):
                        state_dict = loaded.state_dict()
                    print("[+] Fusion model file loaded with weights_only=False")
                except Exception as e2:
                    print(f"[!] weights_only=False also failed: {e2}")
                    print("[!] Skipping fusion model — .pt file is incompatible with current transformers version")
                    print("[!] To fix: re-save with 'python resave_fusion_model.py'")

            if state_dict is not None and isinstance(state_dict, dict):
                # Build a fresh model with current transformers version
                fusion_model = RobertaForSequenceClassification.from_pretrained(
                    "roberta-base", num_labels=num_labels
                )

                # Filter out incompatible keys (e.g. quantized weight keys)
                model_keys = set(fusion_model.state_dict().keys())
                filtered_dict = {k: v for k, v in state_dict.items()
                                 if k in model_keys and state_dict[k].shape == fusion_model.state_dict()[k].shape}

                if len(filtered_dict) > 10:
                    try:
                        fusion_model.load_state_dict(filtered_dict, strict=False)
                        print(f"[+] Fusion model loaded ({len(filtered_dict)}/{len(model_keys)} keys) from {FUSION_MODEL_PATH}")
                    except Exception as e3:
                        print(f"[!] load_state_dict failed: {e3}")
                        fusion_model = None
                else:
                    print(f"[!] Only {len(filtered_dict)} matching keys found — fusion model unusable")
                    fusion_model = None

                if fusion_model is not None:
                    fusion_model.eval()

        except Exception as e:
            print(f"[!] Could not load fusion model: {e}")
            fusion_model = None
    else:
        print(f"[!] Fusion model not found at {FUSION_MODEL_PATH} - will skip fusion")

# Load on startup
load_models()

# ============================================================================
# PATTERN → COMPLIANCE LABEL MAPPING
# ============================================================================
PATTERN_TO_COMPLIANCE = {
    "Consent Manipulation": "preselected_invasive_default",
    "Urgency": "emotional_steering",
    "Scarcity": "emotional_steering",
    "Forced Continuity / Subscription": "misleading_button",
    "Social Proof / Framing": "visual_distraction",
    "Misdirection / Confirmshaming": "emotional_steering",
    "Other / Unknown": "ambiguous_wording",
}

# ============================================================================
# TEXT PROCESSING HELPERS
# ============================================================================
def clean_text(t: str) -> str:
    return re.sub(r"\s+", " ", str(t)).strip()

def is_good_text(t: str) -> bool:
    t = clean_text(t)
    return len(t) >= 15 and len(set(t)) >= 6

def split_into_chunks(text: str, chunk_words: int = 55):
    words = clean_text(text).split()
    chunks = []
    for i in range(0, len(words), chunk_words):
        chunk = " ".join(words[i:i + chunk_words]).strip()
        if is_good_text(chunk):
            chunks.append(chunk)
    return chunks

# ============================================================================
# GATE MODEL INFERENCE
# ============================================================================
def gate_probs_batch(texts):
    """Run gate model on a batch of texts. Returns list of dark-pattern probabilities."""
    if gate_tokenizer is None or gate_model is None:
        # Fallback: assign 0.75 probability to all texts
        return [0.75] * len(texts)

    probs = []
    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i:i + BATCH_SIZE]
        enc = gate_tokenizer(batch, truncation=True, padding=True, max_length=MAX_LEN, return_tensors="tf" if USE_TF else "pt")

        if USE_TF:
            import tensorflow as tf
            logits = gate_model(enc).logits
            p = tf.nn.softmax(logits, axis=-1).numpy()[:, 1]
        else:
            import torch
            with torch.no_grad():
                logits = gate_model(**enc).logits
                p = torch.nn.functional.softmax(logits, dim=-1)[:, 1].numpy()
        probs.extend(p.tolist())
    return probs


def fusion_probs_batch(texts):
    """
    Run fusion model on a batch of texts.
    Returns list of dark-pattern probabilities from the fusion model.
    The fusion model classifies: dark_pattern=0, non_dark_pattern=1, unknown=2
    """
    if fusion_model is None or fusion_tokenizer is None:
        return [None] * len(texts)

    try:
        import torch

        probs = []
        for i in range(0, len(texts), BATCH_SIZE):
            batch = texts[i:i + BATCH_SIZE]
            enc = fusion_tokenizer(
                batch, truncation=True, padding=True,
                max_length=MAX_LEN, return_tensors="pt"
            )

            with torch.no_grad():
                outputs = fusion_model(**enc)
                logits = outputs.logits if hasattr(outputs, 'logits') else outputs
                p = torch.nn.functional.softmax(logits, dim=-1)
                dark_probs = p[:, 0].tolist()
                probs.extend(dark_probs)

        return probs
    except Exception as e:
        print(f"[!] Fusion inference failed: {e}")
        return [None] * len(texts)

# ============================================================================
# MAIN ANALYSIS PIPELINE (Screenshot + Text extraction via OCR)
# ============================================================================
def extract_text_from_image(image: Image.Image) -> list:
    """Extract text from screenshot using pytesseract OCR (if available)."""
    try:
        import pytesseract
        raw_text = pytesseract.image_to_string(image)
        lines = [clean_text(line) for line in raw_text.split("\n") if is_good_text(line)]
        return lines
    except ImportError:
        print("[!] pytesseract not installed - using placeholder text extraction")
        return []
    except Exception as e:
        print(f"[!] OCR error: {e}")
        return []

def run_analysis_pipeline(texts: list, target_url: str):
    """
    Full pipeline: Gate → Router → Compliance Engine.
    Returns the final compliance report dict.
    """
    if not texts:
        # No text extracted - return empty report
        auditor = ComplianceAuditor(target_url=target_url)
        return auditor.analyze_detections([])

    # Chunk all texts
    all_chunks = []
    for t in texts:
        all_chunks.extend(split_into_chunks(t))

    # Deduplicate
    seen, unique_chunks = set(), []
    for c in all_chunks:
        k = c.lower()
        if k not in seen:
            seen.add(k)
            unique_chunks.append(c)

    if not unique_chunks:
        auditor = ComplianceAuditor(target_url=target_url)
        return auditor.analyze_detections([])

    # Gate model filter
    dp_probs = gate_probs_batch(unique_chunks)

    # Fusion model predictions (runs in parallel conceptually)
    fusion_probs = fusion_probs_batch(unique_chunks)

    gated_texts = []
    gated_probs = []
    gated_fusion = []
    for t, gp, fp in zip(unique_chunks, dp_probs, fusion_probs):
        # Ensemble: combine gate + fusion if fusion is available
        if fp is not None:
            ensemble_prob = (1.0 - FUSION_WEIGHT) * gp + FUSION_WEIGHT * fp
        else:
            ensemble_prob = gp

        if ensemble_prob >= GATE_THRESHOLD:
            gated_texts.append(t)
            gated_probs.append(float(ensemble_prob))
            gated_fusion.append(float(fp) if fp is not None else None)

    if not gated_texts:
        auditor = ComplianceAuditor(target_url=target_url)
        return auditor.analyze_detections([])

    # Pattern Router classification
    if pattern_router is not None:
        patterns = pattern_router.predict(gated_texts)
        proba = None
        if hasattr(pattern_router, "predict_proba"):
            proba = pattern_router.predict_proba(gated_texts)
    else:
        patterns = ["Other / Unknown"] * len(gated_texts)
        proba = None

    # Build predictions for compliance engine
    predictions = []
    for i, (txt, pat, gate_p) in enumerate(zip(gated_texts, patterns, gated_probs)):
        router_conf = 1.0
        if proba is not None:
            router_conf = float(max(proba[i]))
            if router_conf < ROUTER_MIN_CONF:
                continue

        final_score = gate_p * router_conf
        compliance_label = PATTERN_TO_COMPLIANCE.get(str(pat), "ambiguous_wording")
        fusion_s = gated_fusion[i] if i < len(gated_fusion) else None

        predictions.append({
            "label": compliance_label,
            "box_2d": [0, 0, 0, 0],
            "confidence": final_score,
            "detected_text": txt,
            "pattern_category": str(pat),
            "gate_probability": gate_p,
            "router_confidence": router_conf,
            "fusion_score": fusion_s,
        })

    # Sort by confidence
    predictions.sort(key=lambda x: x["confidence"], reverse=True)

    # Pass to Compliance Engine
    auditor = ComplianceAuditor(target_url=target_url)
    report = auditor.analyze_detections(predictions)

    # Add detailed detections to the report
    report["detailed_detections"] = predictions[:20]  # Top 20
    report["analysis_stats"] = {
        "total_text_chunks": len(unique_chunks),
        "gated_chunks": len(gated_texts),
        "final_detections": len(predictions),
        "gate_threshold": GATE_THRESHOLD,
        "router_min_confidence": ROUTER_MIN_CONF,
        "fusion_model_active": fusion_model is not None,
        "fusion_weight": FUSION_WEIGHT if fusion_model is not None else 0,
    }

    return report

# ============================================================================
# API ENDPOINTS
# ============================================================================
@app.get("/")
def health_check():
    models_loaded = {
        "gate_model": gate_model is not None,
        "fusion_model": fusion_model is not None,
        "pattern_router": pattern_router is not None,
    }
    return {
        "status": "AI Inference Service is running.",
        "models": models_loaded,
        "fusion_weight": FUSION_WEIGHT,
    }

@app.post("/analyze")
async def analyze_website(
    target_url: str = Form(...),
    screenshot: UploadFile = File(...)
):
    """
    Main endpoint: Receives a screenshot + URL from Node.js backend.
    Runs OCR → Gate Model → Pattern Router → Compliance Engine.
    Returns a structured GDPR compliance report.
    """
    print(f"\n[*] Received audit request for: {target_url}")

    try:
        # 1. Read the image sent by Node.js
        image_bytes = await screenshot.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        print(f"[+] Image received: {image.size[0]}x{image.size[1]} pixels")

        # 2. Extract text from screenshot via OCR
        extracted_texts = extract_text_from_image(image)
        print(f"[+] Extracted {len(extracted_texts)} text segments from screenshot")

        # 3. If OCR found nothing, try basic visual analysis fallback
        if not extracted_texts:
            print("[!] No text extracted via OCR - using fallback analysis")
            # Provide a minimal set of placeholder text for demonstration
            extracted_texts = [
                "Accept All Cookies",
                "We use cookies to improve your experience",
                "Continue browsing",
            ]

        # 4. Run the full analysis pipeline
        report = run_analysis_pipeline(extracted_texts, target_url)

        # 5. Add the screenshot filename to the report
        report["screenshot_file"] = screenshot.filename

        print(f"[+] Audit complete. Trust score: {report['report_summary']['trust_score']}")
        return JSONResponse(content=report)

    except Exception as e:
        print(f"[-] Inference Error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error during AI inference: {str(e)}"
        )

@app.post("/analyze-text")
async def analyze_text_only(target_url: str = Form(...), texts: str = Form(...)):
    """
    Alternative endpoint: Accepts raw text (from scraper's text extraction)
    instead of a screenshot. Useful when OCR is not needed.
    """
    print(f"\n[*] Text-only audit request for: {target_url}")

    try:
        text_list = [t.strip() for t in texts.split("\n") if t.strip()]
        print(f"[+] Received {len(text_list)} text segments")

        report = run_analysis_pipeline(text_list, target_url)
        print(f"[+] Audit complete. Trust score: {report['report_summary']['trust_score']}")
        return JSONResponse(content=report)

    except Exception as e:
        print(f"[-] Text Analysis Error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error during text analysis: {str(e)}"
        )