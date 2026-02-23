from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import base64
import time
import uuid
import os

app = FastAPI(title="Web Scraper Service")

EXPORT_DIR = os.path.abspath(os.path.join(os.getcwd(), "..", "exports"))
os.makedirs(EXPORT_DIR, exist_ok=True)

class ScrapeRequest(BaseModel):
    target_url: str

def get_chrome_options():
    options = Options()
    options.add_argument("--headless=new") 
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage") 
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    return options

@app.post("/api/capture")
async def capture_screenshot(request: ScrapeRequest):
    driver = None
    try:
        print(f"[*] Starting capture for: {request.target_url}")
        
        # Initialize Headless WebDriver
        options = get_chrome_options()
        driver = webdriver.Chrome(options=options)
        driver.get(request.target_url)
        # We enforce a 4-second wait to ensure dynamic cookie banners and popups load 
        # as these often contain critical GDPR consent mechanisms.
        time.sleep(4) 
        
        # Use Chrome DevTools Protocol (CDP) for a perfect full-page screenshot
        metrics = driver.execute_cdp_cmd("Page.getLayoutMetrics", {})
        width = int(metrics["contentSize"]["width"])
        height = int(metrics["contentSize"]["height"])
        
        driver.execute_cdp_cmd("Emulation.setDeviceMetricsOverride", {
            "mobile": False,
            "width": width,
            "height": height,
            "deviceScaleFactor": 1,
        })
        
        # Capture the raw image data
        res = driver.execute_cdp_cmd("Page.captureScreenshot", {"fromSurface": True})
        image_data = base64.b64decode(res["data"])
        
        file_name = f"site_audit_{uuid.uuid4().hex[:8]}.png"
        file_path = os.path.join(EXPORT_DIR, file_name)
        
        with open(file_path, "wb") as f:
            f.write(image_data)
            
        print(f"[+] Successfully captured and saved to {file_path}")
        
        # Return the path so Node.js knows where to find the image
        return {
            "status": "success", 
            "file_path": file_path, 
            "url": request.target_url
        }

    except Exception as e:
        print(f"[-] Error capturing {request.target_url}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to capture website.")
    finally:
        if driver:
            driver.quit() 