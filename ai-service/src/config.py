from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
IMAGES_DIR = DATA_DIR / "images"
SCREENSHOTS_DIR = IMAGES_DIR / "screenshots"

ARTIFACTS_DIR = BASE_DIR / "artifacts"
MODEL_DIR = ARTIFACTS_DIR / "multimodal_model"

for p in [RAW_DIR, PROCESSED_DIR, IMAGES_DIR, SCREENSHOTS_DIR, ARTIFACTS_DIR, MODEL_DIR]:
    p.mkdir(parents=True, exist_ok=True)