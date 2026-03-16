from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import requests
import os
import json
from dotenv import load_dotenv
from compliance_engine import ComplianceAuditor

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
        headers = {"Authorization": f"Bearer {HF_TOKEN}"}
        
        # Read the image into memory ONCE so we can reuse it for multiple chunks
        image_bytes = await screenshot.read()
        
        # Parse the incoming JSON strings into Python lists
        words_list = json.loads(words)
        boxes_list = json.loads(boxes)
        
        # --- THE SLIDING WINDOW CHUNKING LOGIC ---
        CHUNK_SIZE = 400
        all_flagged_predictions = []
        
        total_elements = len(words_list)
        print(f"[*] Starting Sliding Window analysis for {total_elements} elements on {target_url}...")

        # Loop through the page in batches of 400 to prevent HF from hitting the 512 token limit
        for i in range(0, total_elements, CHUNK_SIZE):
            chunk_words = words_list[i : i + CHUNK_SIZE]
            chunk_boxes = boxes_list[i : i + CHUNK_SIZE]
            
            if not chunk_words:
                continue
                
            print(f"[*] Sending Chunk to Hugging Face: {i} to {i + len(chunk_words)}...")
            
            # Package this specific chunk to send to Hugging Face
            files = {"screenshot": (screenshot.filename, image_bytes, screenshot.content_type)}
            data = {
                "words": json.dumps(chunk_words), 
                "boxes": json.dumps(chunk_boxes)
            }

            hf_response = requests.post(HF_API_URL, headers=headers, files=files, data=data)

            if hf_response.status_code != 200:
                print(f"[!] Warning: HF API Error on chunk {i}: {hf_response.text}")
                continue # Skip this chunk if HF throws a timeout or error, but keep processing the rest of the page!

            chunk_predictions = hf_response.json()
            
            # Combine the flagged items from this chunk into our master list
            if isinstance(chunk_predictions, list):
                all_flagged_predictions.extend(chunk_predictions)

        print(f"[+] Chunking complete! Found {len(all_flagged_predictions)} total suspicious elements to audit.")

        # --- STAGE 2: THE GEMINI LOGICAL AUDIT ---
        print("[*] Generating Legal Compliance Report via Gemini...")
        auditor = ComplianceAuditor(target_url=target_url)
        
        # We pass the MASSIVE stitched list of all found patterns to your Gemini engine
        final_report = auditor.analyze_detections(all_flagged_predictions)

        # 3. Return the formatted JSON to your Node.js backend
        return final_report

    except Exception as e:
        print(f"[!] Fatal Audit Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))