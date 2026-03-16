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
        
        # --- THE UPGRADED SLIDING WINDOW CHUNKING LOGIC ---
        CHUNK_SIZE = 400
        OVERLAP = 50  # Give the model a 50-word buffer to prevent cutting sentences in half!
        STEP = CHUNK_SIZE - OVERLAP
        
        all_flagged_predictions = []
        
        total_elements = len(words_list)
        print(f"[*] Starting Sliding Window analysis for {total_elements} elements on {target_url}...")

        # Step forward by 350, grabbing 400 words each time
        for i in range(0, total_elements, STEP):
            chunk_words = words_list[i : i + CHUNK_SIZE]
            chunk_boxes = boxes_list[i : i + CHUNK_SIZE]
            
            if not chunk_words:
                continue
                
            print(f"[*] Sending Chunk to Hugging Face: {i} to {i + len(chunk_words)}...")
            
            files = {"screenshot": (screenshot.filename, image_bytes, screenshot.content_type)}
            data = {
                "words": json.dumps(chunk_words), 
                "boxes": json.dumps(chunk_boxes)
            }

            hf_response = requests.post(HF_API_URL, headers=headers, files=files, data=data)

            if hf_response.status_code != 200:
                print(f"[!] Warning: HF API Error on chunk {i}: {hf_response.text}")
                continue 

            chunk_predictions = hf_response.json()
            
            # --- THE SILENT FAILURE FIX ---
            if isinstance(chunk_predictions, list):
                all_flagged_predictions.extend(chunk_predictions)
            elif isinstance(chunk_predictions, dict) and "detections" in chunk_predictions:
                # If your API actually returns a dictionary with a "detections" key
                all_flagged_predictions.extend(chunk_predictions["detections"])
            else:
                # Force the terminal to tell us if the format is wrong!
                print(f"[?] Unexpected HF Response Format on chunk {i}: {str(chunk_predictions)[:100]}...")

        # Optional: Remove duplicates that might occur in the 50-word overlap zones
        # (Assuming your predictions are dicts that have a 'text' key)
        unique_predictions = []
        seen_texts = set()
        for p in all_flagged_predictions:
            text_val = p.get('text', str(p)) # Fallback if 'text' isn't the exact key
            if text_val not in seen_texts:
                seen_texts.add(text_val)
                unique_predictions.append(p)

        print(f"[+] Chunking complete! Found {len(unique_predictions)} unique suspicious elements to audit.")

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