"""
Re-save fusion_model.pt as a proper state_dict.

The current fusion_model.pt was saved with torch.save(full_model, path)
which pickles the entire model class — this breaks across transformers versions.

This script loads it and re-saves as just the state_dict (weights only).

Usage:
  cd ai-service
  python resave_fusion_model.py

If the current fusion_model.pt can't be loaded due to version mismatch,
you'll need to re-run this with the ORIGINAL fusion_model.pt (before quantization)
or retrain the model.
"""
import torch
import os
import sys

INPUT_PATH = "artifacts/multimodal_model/fusion_model.pt"
OUTPUT_PATH = "artifacts/multimodal_model/fusion_model_fixed.pt"

if not os.path.exists(INPUT_PATH):
    print(f"[!] File not found: {INPUT_PATH}")
    sys.exit(1)

print(f"Loading {INPUT_PATH}...")
print(f"File size: {os.path.getsize(INPUT_PATH) / (1024*1024):.1f} MB")

# Try loading as state_dict first (weights_only=True)
try:
    state_dict = torch.load(INPUT_PATH, map_location="cpu", weights_only=True)
    print("[+] Loaded with weights_only=True (already a state_dict)")
except Exception as e:
    print(f"[!] weights_only=True failed: {e}")
    print("[*] Trying weights_only=False...")
    try:
        loaded = torch.load(INPUT_PATH, map_location="cpu", weights_only=False)
        if isinstance(loaded, dict):
            state_dict = loaded
            print("[+] Loaded as dict")
        elif hasattr(loaded, 'state_dict'):
            state_dict = loaded.state_dict()
            print("[+] Extracted state_dict from model object")
        else:
            print(f"[!] Unknown type: {type(loaded)}")
            sys.exit(1)
    except Exception as e2:
        print(f"[!] weights_only=False also failed: {e2}")
        print("\nThe .pt file is incompatible with your current transformers version.")
        print("You need the ORIGINAL fusion_model.pt (before quantization).")
        print("Check if it still exists in:")
        print("  - dark-pattern-nlp-detection/")
        print("  - Any backup or training output directory")
        sys.exit(1)

print(f"\nState dict has {len(state_dict)} keys")
print("Sample keys:", list(state_dict.keys())[:5])

# Save as state_dict
print(f"\nSaving state_dict to {OUTPUT_PATH}...")
torch.save(state_dict, OUTPUT_PATH)

new_size = os.path.getsize(OUTPUT_PATH) / (1024 * 1024)
print(f"[+] Saved! Size: {new_size:.1f} MB")
print(f"\nNow rename:")
print(f"  1. Delete old: del {INPUT_PATH}")
print(f"  2. Rename: ren {OUTPUT_PATH} fusion_model.pt")
