import subprocess
import sys

def run(cmd):
    print("\n==>", " ".join(cmd))
    r = subprocess.run(cmd, check=False)
    if r.returncode != 0:
        print("[ERROR] Command failed:", cmd)
        sys.exit(r.returncode)

def main():
    # 1) process master_dataset_2.jsonl to processed CSV
    run([sys.executable, "-m", "src.data.process_master_dataset_2"])

    # 2) generate image labels csv
    run([sys.executable, "-m", "src.data.generate_labels_csv"])

    # 3) train multimodal model
    run([sys.executable, "-m", "src.models.train_multimodal"])

    print("\n[OK] All steps completed. Model saved in artifacts/multimodal_model/")

if __name__ == "__main__":
    main()