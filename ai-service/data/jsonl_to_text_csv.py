import json, re
import pandas as pd

JSONL_PATH = "data/raw/master_dataset.jsonl"
OUT_PATH = "data/processed/scraped_texts.csv"

def clean_text(t):
    t = str(t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

rows = []
with open(JSONL_PATH, "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        site_id = obj.get("site_id")
        url = obj.get("url")

        # Prefer selenium extracted content (more complete)
        for item in obj.get("selenium_css_data", []):
            text = clean_text(item.get("text", ""))
            if len(text) < 20:
                continue
            rows.append({
                "site_id": site_id,
                "url": url,
                "text": text
            })

df = pd.DataFrame(rows)

# Dedupe by normalized text
df["text_norm"] = df["text"].str.lower()
df = df.drop_duplicates(subset=["text_norm"]).drop(columns=["text_norm"])

df.to_csv(OUT_PATH, index=False)
print("✅ Saved:", OUT_PATH, "rows:", len(df))