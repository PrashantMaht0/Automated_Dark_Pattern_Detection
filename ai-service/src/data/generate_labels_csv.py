import csv
from src.config import SCREENSHOTS_DIR, IMAGES_DIR

OUT_PATH = IMAGES_DIR / "labels.csv"
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

def main():
    rows = []
    for p in SCREENSHOTS_DIR.rglob("*"):
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS:
            rel = p.relative_to(SCREENSHOTS_DIR)

            # If screenshots/<label>/<file>, use folder as label
            if len(rel.parts) >= 2:
                label = rel.parts[0].lower().strip()
            else:
                label = "unknown"

            rows.append({
                "image_file": str(rel).replace("\\", "/"),
                "label": label,
                "text": ""
            })

    if not rows:
        print("[WARN] No images found in:", SCREENSHOTS_DIR)
        print("Put your images into ai-service/data/images/screenshots/")
        return

    with open(OUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["image_file", "label", "text"])
        writer.writeheader()
        writer.writerows(rows)

    print("[OK] Generated:", OUT_PATH, "rows:", len(rows))

if __name__ == "__main__":
    main()