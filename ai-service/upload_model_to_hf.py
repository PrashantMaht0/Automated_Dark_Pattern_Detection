"""
Upload fusion model to a separate HF Model repo.
HF Model repos have NO size limit (uses Git LFS).
The HF Space app.py will auto-download it at startup.

Usage:
  cd ai-service
  pip install huggingface_hub
  python upload_model_to_hf.py
"""
import os
from huggingface_hub import HfApi, login

HF_USERNAME = "nitishfounded"
MODEL_REPO = f"{HF_USERNAME}/dark-pattern-fusion-model"
LOCAL_MODEL_DIR = "artifacts/multimodal_model"

def main():
    print("=" * 50)
    print("Upload Fusion Model to HF Model Repo")
    print("=" * 50)

    token = os.environ.get("HF_TOKEN")
    if not token:
        token = input("\nEnter your HF token (hf_xxxxx): ").strip()

    login(token=token)
    api = HfApi()

    # Create repo
    print(f"\nCreating model repo: {MODEL_REPO}")
    try:
        api.create_repo(repo_id=MODEL_REPO, repo_type="model", exist_ok=True)
        print(f"  Repo: https://huggingface.co/{MODEL_REPO}")
    except Exception as e:
        print(f"  Warning: {e}")

    # Upload all files
    print(f"\nUploading files from {LOCAL_MODEL_DIR}/...")
    for root, dirs, files in os.walk(LOCAL_MODEL_DIR):
        for f in files:
            local_path = os.path.join(root, f)
            repo_path = os.path.relpath(local_path, LOCAL_MODEL_DIR)
            size_mb = os.path.getsize(local_path) / (1024 * 1024)
            print(f"  Uploading: {repo_path} ({size_mb:.1f} MB)...")
            api.upload_file(
                path_or_fileobj=local_path,
                path_in_repo=repo_path,
                repo_id=MODEL_REPO,
                repo_type="model",
            )
            print(f"  Done: {repo_path}")

    print(f"\n{'=' * 50}")
    print(f"ALL FILES UPLOADED!")
    print(f"Repo: https://huggingface.co/{MODEL_REPO}")
    print(f"{'=' * 50}")
    print(f"\nThe HF Space app.py will auto-download at startup.")

if __name__ == "__main__":
    main()
