from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import requests
import os
from dotenv import load_dotenv
from compliance_engine import ComplianceAuditor
import json

# Load your Hugging Face token from the .env file in ai-service/
load_dotenv()

app = FastAPI(title="Compliance AI Wrapper")

HF_TOKEN = os.getenv("HF_TOKEN")
HF_API_URL = "https://prashant-mahto-dark-pattern-layoutlm.hf.space/analyze"

@app.post("/audit")
async def run_audit(
    target_url: str = Form(...),
    screenshot: UploadFile = File(...),
    words: str = Form(...),
    boxes: str = Form(...)
):
    try:
        # 1. Package the incoming data to forward to Hugging Face
        headers = {"Authorization": f"Bearer {HF_TOKEN}"}
        image_bytes = await screenshot.read()
        files = {"screenshot": (screenshot.filename, image_bytes, screenshot.content_type)}
        data = {"words": words, "boxes": boxes}

        print(f"[*] Analyzing {target_url} via Hugging Face Cloud...")
        hf_response = requests.post(HF_API_URL, headers=headers, files=files, data=data)

        if hf_response.status_code != 200:
            raise Exception(f"Hugging Face API Error: {hf_response.text}")

        ai_predictions = hf_response.json()


        # 2. Pass the AI predictions into your Compliance Engine
        print("[*] Generating Legal Compliance Report...")
        auditor = ComplianceAuditor(target_url=target_url)
        final_report = auditor.analyze_detections(ai_predictions)

        # 3. Return the formatted JSON to your Node.js backend
        return final_report

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))