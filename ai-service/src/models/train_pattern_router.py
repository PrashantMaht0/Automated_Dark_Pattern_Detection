import re
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib

# Use BOTH processed datasets
DATA_A = Path("data/processed/scraped_pseudolabeled.csv")
DATA_B = Path("data/processed/scraped_pseudolabeled_2.csv")

OUT_MODEL = Path("artifacts/pattern_router.joblib")

MIN_CLASS_COUNT = 5  # remove rare pattern classes

def guess_pattern_name(text: str) -> str:
    t = text.lower()
    if any(x in t for x in ["accept all", "allow all", "agree and continue", "we use cookies", "manage preferences", "privacy settings"]):
        return "Consent Manipulation"
    if any(x in t for x in ["limited time", "ends soon", "hurry", "today only", "act now", "offer ends", "expires"]):
        return "Urgency"
    if any(x in t for x in ["left in stock", "few left", "selling out", "almost gone", "low stock"]):
        return "Scarcity"
    if any(x in t for x in ["free trial", "start trial", "subscribe", "membership", "auto-renew", "recurring", "cancel anytime"]):
        return "Forced Continuity / Subscription"
    if any(x in t for x in ["popular", "recommended", "best value", "most people", "others bought", "people are viewing"]):
        return "Social Proof / Framing"
    if any(x in t for x in ["no thanks", "i do not want", "not now"]) and any(x in t for x in ["save", "discount", "deal", "offer"]):
        return "Misdirection / Confirmshaming"
    return "Other / Unknown"

def clean_text(t: str) -> str:
    t = str(t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

def load_df(path: Path) -> pd.DataFrame:
    if not path.exists():
        print(f"[WARN] Missing: {path}")
        return pd.DataFrame(columns=["text", "label"])
    df = pd.read_csv(path)
    if "text" not in df.columns or "label" not in df.columns:
        raise ValueError(f"{path} must contain columns: text, label")
    df["text"] = df["text"].astype(str).map(clean_text)
    return df

def main():
    df_a = load_df(DATA_A)
    df_b = load_df(DATA_B)

    df = pd.concat([df_a, df_b], ignore_index=True)

    # use only positive examples
    pos = df[df["label"] == 1].copy()

    # weak-label into pattern categories
    pos["pattern"] = pos["text"].apply(guess_pattern_name)

    # remove Other
    pos = pos[pos["pattern"] != "Other / Unknown"]

    print("\nInitial pattern counts:")
    counts = pos["pattern"].value_counts()
    print(counts)

    # remove rare classes
    keep_classes = counts[counts >= MIN_CLASS_COUNT].index
    removed = counts[counts < MIN_CLASS_COUNT]
    if len(removed) > 0:
        print("\n⚠️ Removing rare classes (too few samples):")
        print(removed)

    pos = pos[pos["pattern"].isin(keep_classes)]

    print("\nFinal training pattern counts:")
    print(pos["pattern"].value_counts())
    print("Training samples:", len(pos))

    if len(pos) < 50:
        print("\n[ERROR] Too few samples after filtering. Reduce MIN_CLASS_COUNT.")
        return

    X_train, X_val, y_train, y_val = train_test_split(
        pos["text"], pos["pattern"],
        test_size=0.2, random_state=42,
        stratify=pos["pattern"]
    )

    model = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), min_df=2, max_features=200000)),
        ("clf", LogisticRegression(max_iter=4000, class_weight="balanced", n_jobs=-1))
    ])

    model.fit(X_train, y_train)
    preds = model.predict(X_val)

    print("\nValidation report:")
    print(classification_report(y_val, preds))

    OUT_MODEL.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, OUT_MODEL)
    print("\n✅ Saved pattern router to:", OUT_MODEL)

if __name__ == "__main__":
    main()