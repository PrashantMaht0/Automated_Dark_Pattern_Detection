import json
import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
from PIL import Image
from torchvision import transforms
import timm
from transformers import AutoTokenizer, AutoModel
from sklearn.model_selection import train_test_split
from tqdm import tqdm

from src.config import MODEL_DIR
from src.data.loaders import load_all_sources

TEXT_MODEL = "roberta-base"
MAX_LEN = 128
BATCH = 8
EPOCHS = 3
LR = 2e-5

img_tfm = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

class MultiDataset(Dataset):
    def __init__(self, df, tokenizer, label2id):
        self.df = df.reset_index(drop=True)
        self.tokenizer = tokenizer
        self.label2id = label2id

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        text = row["text"]
        label = self.label2id[row["label"]]

        enc = self.tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=MAX_LEN,
            return_tensors="pt"
        )

        image_path = row["image_path"]
        if isinstance(image_path, str) and len(image_path) > 0:
            try:
                img = Image.open(image_path).convert("RGB")
                img = img_tfm(img)
                has_image = 1.0
            except Exception:
                img = torch.zeros((3, 224, 224))
                has_image = 0.0
        else:
            img = torch.zeros((3, 224, 224))
            has_image = 0.0

        has_text = 1.0 if isinstance(text, str) and len(text.strip()) > 0 else 0.0

        return {
            "input_ids": enc["input_ids"].squeeze(0),
            "attention_mask": enc["attention_mask"].squeeze(0),
            "image": img,
            "has_image": torch.tensor(has_image, dtype=torch.float32),
            "has_text": torch.tensor(has_text, dtype=torch.float32),
            "label": torch.tensor(label, dtype=torch.long),
        }

class FusionModel(nn.Module):
    def __init__(self, num_labels):
        super().__init__()
        self.text_encoder = AutoModel.from_pretrained(TEXT_MODEL)
        self.image_encoder = timm.create_model("vit_base_patch16_224", pretrained=True, num_classes=0)

        text_dim = self.text_encoder.config.hidden_size
        img_dim = self.image_encoder.num_features

        self.classifier = nn.Sequential(
            nn.Linear(text_dim + img_dim + 2, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_labels)
        )

    def forward(self, input_ids, attention_mask, image, has_image, has_text):
        text_out = self.text_encoder(input_ids=input_ids, attention_mask=attention_mask).last_hidden_state[:, 0, :]
        img_out = self.image_encoder(image)
        fused = torch.cat([text_out, img_out, has_image.unsqueeze(1), has_text.unsqueeze(1)], dim=1)
        return self.classifier(fused)

def main():
    df = load_all_sources()
    labels = sorted(df["label"].unique().tolist())
    label2id = {l: i for i, l in enumerate(labels)}

    train_df, val_df = train_test_split(df, test_size=0.15, random_state=42, stratify=df["label"])

    tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL)
    train_ds = MultiDataset(train_df, tokenizer, label2id)
    val_ds = MultiDataset(val_df, tokenizer, label2id)

    train_loader = DataLoader(train_ds, batch_size=BATCH, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH, shuffle=False)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = FusionModel(num_labels=len(labels)).to(device)

    opt = torch.optim.AdamW(model.parameters(), lr=LR)
    loss_fn = nn.CrossEntropyLoss()

    best_acc = 0.0
    for epoch in range(EPOCHS):
        model.train()
        pbar = tqdm(train_loader, desc=f"Train {epoch+1}/{EPOCHS}")
        for batch in pbar:
            opt.zero_grad()
            logits = model(
                batch["input_ids"].to(device),
                batch["attention_mask"].to(device),
                batch["image"].to(device),
                batch["has_image"].to(device),
                batch["has_text"].to(device),
            )
            loss = loss_fn(logits, batch["label"].to(device))
            loss.backward()
            opt.step()
            pbar.set_postfix(loss=float(loss.item()))

        model.eval()
        correct, total = 0, 0
        with torch.no_grad():
            for batch in val_loader:
                logits = model(
                    batch["input_ids"].to(device),
                    batch["attention_mask"].to(device),
                    batch["image"].to(device),
                    batch["has_image"].to(device),
                    batch["has_text"].to(device),
                )
                preds = logits.argmax(dim=1)
                correct += (preds.cpu() == batch["label"]).sum().item()
                total += batch["label"].size(0)

        acc = correct / max(total, 1)
        print(f"[VAL] epoch={epoch+1} acc={acc:.4f}")

        if acc > best_acc:
            best_acc = acc
            MODEL_DIR.mkdir(parents=True, exist_ok=True)
            torch.save(model.state_dict(), MODEL_DIR / "fusion_model.pt")
            (MODEL_DIR / "label_map.json").write_text(json.dumps(label2id, indent=2), encoding="utf-8")
            tokenizer.save_pretrained(MODEL_DIR / "tokenizer")
            print("[OK] Saved best model")

    print("[DONE] best_acc:", best_acc)
    print("[INFO] Labels:", label2id)

if __name__ == "__main__":
    main()