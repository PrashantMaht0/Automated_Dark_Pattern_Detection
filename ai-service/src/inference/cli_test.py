import json
import torch
import timm
import numpy as np
from PIL import Image
from torchvision import transforms
from transformers import AutoTokenizer, AutoModel
from torch import nn

from src.config import MODEL_DIR

TEXT_MODEL = "roberta-base"
img_tfm = transforms.Compose([transforms.Resize((224,224)), transforms.ToTensor()])

class FusionModel(nn.Module):
    def __init__(self, num_labels):
        super().__init__()
        self.text_encoder = AutoModel.from_pretrained(TEXT_MODEL)
        self.image_encoder = timm.create_model("vit_base_patch16_224", pretrained=False, num_classes=0)

        text_dim = self.text_encoder.config.hidden_size
        img_dim = self.image_encoder.num_features

        self.classifier = nn.Sequential(
            nn.Linear(text_dim + img_dim + 2, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_labels)
        )

    def forward(self, input_ids, attention_mask, image, has_image, has_text):
        text_out = self.text_encoder(input_ids=input_ids, attention_mask=attention_mask).last_hidden_state[:,0,:]
        img_out = self.image_encoder(image)
        fused = torch.cat([text_out, img_out, has_image.unsqueeze(1), has_text.unsqueeze(1)], dim=1)
        return self.classifier(fused)

def main():
    label2id = json.loads((MODEL_DIR / "label_map.json").read_text(encoding="utf-8"))
    id2label = {v:k for k,v in label2id.items()}

    tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR / "tokenizer"))

    model = FusionModel(num_labels=len(label2id))
    model.load_state_dict(torch.load(MODEL_DIR / "fusion_model.pt", map_location="cpu"))
    model.eval()

    while True:
        text = input("\nText (enter to skip, 'exit' to quit): ").strip()
        if text.lower() == "exit":
            break
        img_path = input("Image path (enter to skip): ").strip()

        enc = tokenizer(text if text else "", return_tensors="pt", truncation=True, padding="max_length", max_length=128)

        if img_path:
            img = Image.open(img_path).convert("RGB")
            img = img_tfm(img).unsqueeze(0)
            has_image = torch.tensor([1.0])
        else:
            img = torch.zeros((1,3,224,224))
            has_image = torch.tensor([0.0])

        has_text = torch.tensor([1.0 if text else 0.0])

        with torch.no_grad():
            logits = model(enc["input_ids"], enc["attention_mask"], img, has_image, has_text)
            probs = torch.softmax(logits, dim=1).numpy()[0]
            idx = int(np.argmax(probs))

        print("Prediction:", id2label[idx], "confidence:", float(probs[idx]))

if __name__ == "__main__":
    main()