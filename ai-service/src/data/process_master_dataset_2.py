import json
import re
import pandas as pd
from pathlib import Path

from src.config import RAW_DIR, PROCESSED_DIR

TEXT_KEYS = ["text", "content", "sentence", "ui_text", "description", "snippet", "visible_text", "ocr_text"]
PROB_KEYS = ["prob_dark", "probability", "score", "confidence"]
LABEL_KEYS = ["label", "y", "target", "class", "is_dark", "is_darkpattern"]
URL_KEYS = ["url", "page_url", "target_url", "website"]
ID_KEYS = ["site_id", "id", "site", "page_id"]

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text

def get_first(obj, keys):
    for k in keys:
        if isinstance(obj, dict) and k in obj:
            return obj[k]
    return None

def find_nested_key(obj, contains: str):
    """Find first nested value whose key contains `contains`."""
    contains = contains.lower()
    if isinstance(obj, dict):
        for k, v in obj.items():
            if contains in str(k).lower():
                return v
            found = find_nested_key(v, contains)
            if found is not None:
                return found
    elif isinstance(obj, list):
        for v in obj:
            found = find_nested_key(v, contains)
            if found is not None:
                return found
    return None

def ensure_binary_label(val):
    """Convert many label formats to 0/1/None."""
    if val is None:
        return None
    s = str(val).strip().lower()
    if s in ["1", "true", "yes", "dark", "dark_pattern", "dp"]:
        return 1
    if s in ["0", "false", "no", "non_dark", "non_dark_pattern", "benign"]:
        return 0
    # sometimes label is already int
    try:
        iv = int(val)
        if iv in [0, 1]:
            return iv
    except:
        pass
    return None

def ensure_prob(val, fallback=None):
    if val is None:
        return fallback
    try:
        fv = float(val)
        # clamp
        if fv < 0: fv = 0.0
        if fv > 1: fv = 1.0
        return fv
    except:
        return fallback

def main():
    in_path = RAW_DIR / "master_dataset_2.jsonl"
    out_path = PROCESSED_DIR / "scraped_pseudolabeled_2.csv"

    if not in_path.exists():
        raise FileNotFoundError(f"Missing: {in_path}")

    rows = []
    skipped = 0

    with open(in_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except:
                skipped += 1
                continue

            # site_id
            site_id = get_first(obj, ID_KEYS)
            if site_id is None:
                # fallback: use sequential id
                site_id = f"site_{i:05d}"
            site_id = str(site_id)

            # url
            url = get_first(obj, URL_KEYS)
            if url is None:
                url = find_nested_key(obj, "url")
            url = str(url) if url is not None else ""

            # text
            text = get_first(obj, TEXT_KEYS)
            if text is None:
                text = find_nested_key(obj, "text")
            if text is None:
                skipped += 1
                continue
            text = clean_text(str(text))
            if not text:
                skipped += 1
                continue

            # label
            label_raw = get_first(obj, LABEL_KEYS)
            if label_raw is None:
                label_raw = find_nested_key(obj, "label")
            label = ensure_binary_label(label_raw)

            # prob_dark
            prob_raw = get_first(obj, PROB_KEYS)
            if prob_raw is None:
                prob_raw = find_nested_key(obj, "prob")
            prob_dark = ensure_prob(prob_raw, fallback=None)

            # if prob missing, set a sensible fallback
            if prob_dark is None:
                if label == 1:
                    prob_dark = 1.0
                elif label == 0:
                    prob_dark = 0.0
                else:
                    prob_dark = 0.5

            # if label missing, derive from prob (threshold 0.5)
            if label is None:
                label = 1 if prob_dark >= 0.5 else 0

            rows.append({
                "site_id": site_id,
                "url": url,
                "text": text,
                "prob_dark": float(prob_dark),
                "label": int(label),
            })

    df = pd.DataFrame(rows)
    df = df.drop_duplicates(subset=["site_id", "url", "text"])
    df.to_csv(out_path, index=False, encoding="utf-8")

    print("[OK] Wrote:", out_path)
    print("[OK] Rows:", len(df))
    print("[WARN] Skipped lines:", skipped)
    print(df.head(3).to_string(index=False))

if __name__ == "__main__":
    main()