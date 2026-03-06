import pandas as pd
from pathlib import Path
import json
import re

from src.config import PROCESSED_DIR, RAW_DIR, IMAGES_DIR, SCREENSHOTS_DIR

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"http\\S+", " ", text)
    text = re.sub(r"\\s+", " ", text).strip()
    return text

def load_csv(path: Path):
    df = pd.read_csv(path)

    # If it's your scraped format: site_id,url,text,prob_dark,label
    if "text" in df.columns and "label" in df.columns:
        out = pd.DataFrame()
        out["text"] = df["text"].astype(str).map(clean_text)
        out["label"] = df["label"].astype(str).str.strip().str.lower()
        out["label"] = out["label"].replace({"0": "non_dark_pattern", "1": "dark_pattern"})
        out["image_path"] = None
        out["source"] = path.name
        # keep prob if you want later
        if "prob_dark" in df.columns:
            out["prob_dark"] = df["prob_dark"]
        return out

    # fallback generic (old datasets)
    text_col = None
    for c in ["sentence", "content", "ui_text", "description", "snippet"]:
        if c in df.columns:
            text_col = c
            break

    label_col = None
    for c in ["pattern", "pattern_type", "class", "target", "y"]:
        if c in df.columns:
            label_col = c
            break

    out = pd.DataFrame()
    out["text"] = df[text_col].astype(str).map(clean_text) if text_col else ""
    out["label"] = df[label_col].astype(str).str.lower().str.strip() if label_col else "unknown"
    out["label"] = out["label"].replace({"0": "non_dark_pattern", "1": "dark_pattern"})
    out["image_path"] = None
    out["source"] = path.name
    return out

def load_jsonl(path: Path):
    rows = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                rows.append(json.loads(line))
    df = pd.DataFrame(rows)

    text_col = None
    for c in ["text", "sentence", "content", "ui_text", "description", "snippet"]:
        if c in df.columns:
            text_col = c
            break

    label_col = None
    for c in ["label", "pattern", "pattern_type", "class", "target", "y"]:
        if c in df.columns:
            label_col = c
            break

    out = pd.DataFrame()
    out["text"] = df[text_col].astype(str).map(clean_text) if text_col else ""
    out["label"] = df[label_col].astype(str).str.lower().str.strip() if label_col else "unknown"
    out["image_path"] = None
    out["source"] = path.name
    return out

def load_images():
    labels_csv = IMAGES_DIR / "labels.csv"
    if not labels_csv.exists():
        return pd.DataFrame(columns=["text", "label", "image_path", "source"])

    df = pd.read_csv(labels_csv)
    out = pd.DataFrame()
    out["text"] = df["text"].astype(str).map(clean_text) if "text" in df.columns else ""
    out["label"] = df["label"].astype(str).str.lower().str.strip()
    out["image_path"] = df["image_file"].apply(lambda x: str((SCREENSHOTS_DIR / x).resolve()))
    out["source"] = "images"
    return out

def load_all_sources():
    parts = []

    # processed datasets
    for fname in [
        "train_binary.csv",
        "mathur_positive_only.csv",
        "scraped_pseudolabeled.csv",
        "scraped_pseudolabeled_2.csv",
    ]:
        p = PROCESSED_DIR / fname
        if p.exists():
            parts.append(load_csv(p))

    # raw jsonl (optional)
    for fname in ["master_dataset.jsonl", "master_dataset_2.jsonl"]:
        p = RAW_DIR / fname
        if p.exists():
            parts.append(load_jsonl(p))

    # images
    parts.append(load_images())

    df = pd.concat(parts, ignore_index=True)
    df["text"] = df["text"].fillna("")
    df["label"] = df["label"].fillna("unknown")
    df["image_path"] = df["image_path"].where(df["image_path"].notna(), None)

    df = df[(df["text"].str.len() > 0) | (df["image_path"].notna())]
    df = df.drop_duplicates(subset=["text", "label", "image_path"])

    return df