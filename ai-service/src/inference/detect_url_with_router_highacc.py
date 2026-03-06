import sys, re, json, time
from datetime import datetime
import joblib
from pathlib import Path
import numpy as np
import tensorflow as tf
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
from playwright.sync_api import sync_playwright

# -------------------------
# Paths (UPDATED ✅)
# -------------------------
ROUTER_PATH = Path("artifacts/pattern_router.joblib")

# ✅ Use the scraped model as the binary gate model
BINARY_MODEL_DIR = Path("artifacts/roberta_scraped_model")

# -------------------------
# Thresholds (tune these)
# -------------------------
GATE_THRESHOLD = 0.60        # keep only chunks >= this DP probability
ROUTER_MIN_CONF = 0.35       # ignore router predictions below this (if proba available)

# -------------------------
# Extraction settings
# -------------------------
WAIT_AFTER_LOAD_MS = 6500
MIN_TEXT_LEN = 15
CHUNK_WORDS = 55

MAX_BUTTONS = 250
MAX_LINKS = 250
MAX_MODAL_ELEMENTS = 120
MAX_INPUTS = 150

MAX_LEN = 256
BATCH_SIZE = 16

def now():
    return datetime.now().strftime("%H:%M:%S")

def log(msg):
    print(f"[{now()}] {msg}")

def clean_text(t: str) -> str:
    return re.sub(r"\s+", " ", str(t)).strip()

def is_good_text(t: str) -> bool:
    t = clean_text(t)
    if len(t) < MIN_TEXT_LEN:
        return False
    if len(set(t)) < 6:
        return False
    return True

def split_ui_text(text: str):
    text = re.sub(r"\s+", " ", str(text)).strip()
    text = re.sub(r"(Skip to navigation|Skip to content|Search for)", r"\n\1", text)
    text = re.sub(r"\s*(\||•|/|>|:)\s*", "\n", text)

    tokens = text.split()
    lines, cur = [], []

    def flush():
        nonlocal cur
        if cur:
            s = " ".join(cur).strip()
            if s:
                lines.append(s)
            cur = []

    for tok in tokens:
        if tok.isupper() or re.fullmatch(r"[A-Z0-9]+", tok):
            flush()
            lines.append(tok)
        else:
            cur.append(tok)
    flush()

    fixed = [re.sub(r"\s+", " ", x).strip() for x in lines if x and len(x.strip()) >= 2]
    return fixed

def split_into_chunks(text: str, chunk_words: int = CHUNK_WORDS):
    words = clean_text(text).split()
    chunks = []
    for i in range(0, len(words), chunk_words):
        chunk = " ".join(words[i:i + chunk_words]).strip()
        if is_good_text(chunk):
            chunks.append(chunk)
    return chunks

def safe_inner_text(el):
    try:
        return el.inner_text()
    except:
        return ""

def extract_text_from_url(url: str):
    blocks = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        log(f"Opening URL: {url}")
        page.goto(url, wait_until="domcontentloaded", timeout=90000)
        log("Waiting for banners/popups...")
        page.wait_for_timeout(WAIT_AFTER_LOAD_MS)

        try:
            blocks.append(clean_text(page.inner_text("body")))
        except:
            pass

        selectors = [
            "[role='dialog']", "[aria-modal='true']",
            "div[class*='modal']", "div[id*='modal']",
            "div[class*='popup']", "div[id*='popup']",
            "div[class*='banner']", "div[id*='banner']",
            "div[class*='consent']", "div[id*='consent']",
            "div[class*='cookie']", "div[id*='cookie']",
            "section[class*='cookie']", "aside[class*='cookie']",
        ]

        for sel in selectors:
            try:
                els = page.query_selector_all(sel)
                for el in els[:MAX_MODAL_ELEMENTS]:
                    blocks.append(clean_text(safe_inner_text(el)))
            except:
                continue

        try:
            btns = page.query_selector_all("button")
            for b in btns[:MAX_BUTTONS]:
                blocks.append(clean_text(safe_inner_text(b)))
        except:
            pass

        try:
            links = page.query_selector_all("a")
            for a in links[:MAX_LINKS]:
                blocks.append(clean_text(safe_inner_text(a)))
        except:
            pass

        try:
            inputs = page.query_selector_all("input, textarea, select")
            for inp in inputs[:MAX_INPUTS]:
                ph = clean_text(inp.get_attribute("placeholder") or "")
                al = clean_text(inp.get_attribute("aria-label") or "")
                nm = clean_text(inp.get_attribute("name") or "")
                combined = " ".join([ph, al, nm]).strip()
                if combined:
                    blocks.append(combined)
        except:
            pass

        browser.close()

    # split into UI lines
    lines = []
    for b in blocks:
        for line in split_ui_text(b):
            if is_good_text(line):
                lines.append(line)

    # extra noise filter
    filtered = []
    for t in lines:
        tl = t.lower()
        if len(t) > 500 and ("privacy policy" in tl or "cookie policy" in tl) and ("accept" not in tl and "reject" not in tl):
            continue
        filtered.append(t)

    # dedupe
    seen, uniq = set(), []
    for t in filtered:
        k = t.lower()
        if k not in seen:
            seen.add(k)
            uniq.append(t)
    return uniq

# -------------------------
# Gate model (binary)
# -------------------------
def load_gate_model(model_dir: Path):
    tok = AutoTokenizer.from_pretrained(str(model_dir))
    mdl = TFAutoModelForSequenceClassification.from_pretrained(str(model_dir))
    return tok, mdl

def gate_probs(tok, mdl, texts):
    probs = []
    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i:i+BATCH_SIZE]
        enc = tok(batch, truncation=True, padding=True, max_length=MAX_LEN, return_tensors="tf")
        logits = mdl(enc).logits
        p = tf.nn.softmax(logits, axis=-1).numpy()[:, 1]  # DP prob
        probs.extend(p.tolist())
    return probs

def main(url: str):
    if not ROUTER_PATH.exists():
        raise FileNotFoundError(f"pattern_router.joblib not found at: {ROUTER_PATH}")

    if not BINARY_MODEL_DIR.exists():
        raise FileNotFoundError(f"Binary gate model folder not found: {BINARY_MODEL_DIR}")

    router = joblib.load(ROUTER_PATH)
    gate_tok, gate_mdl = load_gate_model(BINARY_MODEL_DIR)

    log("Extracting website text...")
    lines = extract_text_from_url(url)

    log("Chunking...")
    chunks = []
    for ln in lines:
        chunks.extend(split_into_chunks(ln))

    # dedupe chunks
    seen, uniq = set(), []
    for c in chunks:
        k = c.lower()
        if k not in seen:
            seen.add(k)
            uniq.append(c)

    log(f"Total chunks: {len(uniq)}")
    if not uniq:
        return [], {"chunks_total": 0, "gated_kept": 0, "kept": 0}

    # Gate filter
    log(f"Running gate model: {BINARY_MODEL_DIR}")
    dp_probs = gate_probs(gate_tok, gate_mdl, uniq)

    gated_texts = []
    gated_probs = []
    for t, p in zip(uniq, dp_probs):
        if p >= GATE_THRESHOLD:
            gated_texts.append(t)
            gated_probs.append(float(p))

    log(f"Gated kept: {len(gated_texts)} / {len(uniq)}")
    if not gated_texts:
        return [], {"chunks_total": len(uniq), "gated_kept": 0, "kept": 0}

    # Router prediction
    patterns = router.predict(gated_texts)

    proba = None
    if hasattr(router, "predict_proba"):
        proba = router.predict_proba(gated_texts)

    results = []
    for i, (txt, pat, gate_p) in enumerate(zip(gated_texts, patterns, gated_probs)):
        item = {"pattern": str(pat), "text": txt, "gate_dp_prob": gate_p}

        if proba is not None:
            router_conf = float(max(proba[i]))
            if router_conf < ROUTER_MIN_CONF:
                continue
            item["router_confidence"] = router_conf
            item["final_score"] = gate_p * router_conf
        else:
            item["final_score"] = gate_p

        results.append(item)

    results.sort(key=lambda x: x["final_score"], reverse=True)

    debug = {
        "chunks_total": len(uniq),
        "gated_kept": len(gated_texts),
        "kept": len(results),
        "gate_threshold": GATE_THRESHOLD,
        "router_min_conf": ROUTER_MIN_CONF,
        "binary_model_dir": str(BINARY_MODEL_DIR),
        "router_path": str(ROUTER_PATH),
    }
    return results, debug

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('Usage: python -m src.inference.detect_url_with_router_highacc "https://example.com"')
        sys.exit(1)

    url = sys.argv[1].strip()

    log("=======================================")
    log("HIGH-ACCURACY URL detection (roberta_scraped_model gate + router)")
    log(f"URL: {url}")
    log("=======================================")

    t0 = time.time()
    results, debug = main(url)
    elapsed = time.time() - t0

    print("\n=======================================")
    print(f"✅ FOUND: {len(results)} snippets")
    print(f"⏱  Time: {elapsed:.1f} seconds")
    print("=======================================\n")

    for i, r in enumerate(results[:50], 1):
        print(f"{i}. {r['pattern']}")
        print(r["text"])
        extra = f"GateDP={r['gate_dp_prob']:.2f}  Score={r['final_score']:.2f}"
        if "router_confidence" in r:
            extra += f"  RouterConf={r['router_confidence']:.2f}"
        print(extra)
        print()

    out_json = {
        "url": url,
        "time_seconds": elapsed,
        "debug": debug,
        "results": results
    }

    out_file = "latest_detection_results_router_highacc.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(out_json, f, indent=2, ensure_ascii=False)

    log(f"Saved JSON: {out_file}")