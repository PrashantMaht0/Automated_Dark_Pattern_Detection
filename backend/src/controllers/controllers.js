const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SCRAPER_API_URL = process.env.SCRAPER_API_URL || 'http://127.0.0.1:8000/api/capture';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8001/audit';

exports.generateAudit = async (req, res) => {
    const { targetUrl } = req.body;

    if (!targetUrl) {
        return res.status(400).json({ error: "Please provide a targetUrl." });
    }

    console.log(`\n[*] Starting Full Pipeline Audit for: ${targetUrl}`);

    try {
        // --- 1. CAPTURE ---
        console.log(`[*] Requesting screenshot from Scraper Service...`);

        try {
            const scraperResponse = await axios.post(SCRAPER_API_URL, { target_url: targetUrl });
            
            // Safety check: Did the scraper actually return a path?
            if (!scraperResponse.data || !scraperResponse.data.file_path) {
                throw new Error("Scraper returned success but no file path was found.");
            }
            
            const screenshotPath = scraperResponse.data.file_path;
            console.log(`[+] Screenshot successfully saved at: ${screenshotPath}`);

        } catch (error) {
            console.error(`[-] Audit Pipeline Failed at Capture stage: ${error.message}`);
            // Respond to the frontend so it can display the error instead of spinning forever
            return res.status(502).json({ error: "Failed to capture website screenshot." });
        }

        // --- 2. GEMINI EXTRACTION ---
        console.log(`[*] Sending image to Gemini 2.5 Flash for OCR...`);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const imageData = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(screenshotPath)).toString("base64"),
                mimeType: "image/png",
            },
        };

        const prompt = `ACT AS: A Professional UI Document Parser for LayoutLM Training.
TASK: Perform OCR and spatial detection on this UI.

LABELS TO IDENTIFY:
- 'text_element': Standard UI text/labels.
- 'action_button': Buttons, links, or clickable UI controls.
- 'overlay_content': Text inside popups or cookie banners.
- 'deceptive_element': Any element that looks intentionally hidden or misleading.

OUTPUT FORMAT:
Return ONLY a raw JSON array of objects.
Each object: {'text': 'string', 'label': 'one_of_the_labels_above', 'box_2d': [ymin, xmin, ymax, xmax]}
Normalize coordinates to 0-1000.
DO NOT include markdown fences.`;

        const result = await model.generateContent([prompt, imageData]);
        let responseText = result.response.text();
        responseText = responseText.replace(/```json|```/gi, '').trim();
        const geminiData = JSON.parse(responseText);

        // --- 3. FORMAT FOR LAYOUTLM ---
        console.log(`[*] Formatting OCR data for LayoutLM API...`);
        const words = [];
        const boxes = [];

        // Helper function to force numbers between 0 and 1000
        const clamp = (val) => Math.min(1000, Math.max(0, Math.round(val)));

        geminiData.forEach(item => {
            words.push(item.text);
            
            // Convert Gemini [ymin, xmin, ymax, xmax] to LayoutLM [xmin, ymin, xmax, ymax]
            // AND mathematically enforce the 0-1000 limit!
            boxes.push([
                clamp(item.box_2d[1]), // xmin
                clamp(item.box_2d[0]), // ymin
                clamp(item.box_2d[3]), // xmax
                clamp(item.box_2d[2])  // ymax
            ]);
        });

        // --- 4. HOST IMAGE FOR REACT ---
        // Save to the exports folder so the React dashboard can display it
        const exportsDir = path.join(__dirname, '../../../exports'); 
        const screenshotFilename = path.basename(screenshotPath);
        const publicImagePath = path.join(exportsDir, screenshotFilename);
        
        if (screenshotPath !== publicImagePath) {
            fs.copyFileSync(screenshotPath, publicImagePath);
        }
        
        const publicScreenshotUrl = `http://localhost:${process.env.PORT || 5000}/exports/${screenshotFilename}`;

        // --- 5. CALL THE PYTHON AI SERVICE ---
        console.log(`[*] Forwarding to Python AI Compliance Service...`);
        const form = new FormData();
        form.append('target_url', targetUrl);
        form.append('screenshot', fs.createReadStream(publicImagePath));
        form.append('words', JSON.stringify(words));
        form.append('boxes', JSON.stringify(boxes));

        const aiResponse = await axios.post(AI_SERVICE_URL, form, {
            headers: { ...form.getHeaders() }
        });

        // --- 6. RETURN FINAL REPORT TO REACT ---
        const finalReport = aiResponse.data;
        
        // Inject the image URL so Report.js can draw the red bounding boxes over it!
        if (!finalReport.raw) finalReport.raw = {};
        finalReport.raw.screenshot_url = publicScreenshotUrl;

        console.log(`[*] Pipeline Complete! Sending compliance report to React.`);
        res.status(200).json(finalReport);

    } catch (error) {
        console.error("[-] Audit Pipeline Failed:", error.message);
        res.status(500).json({ error: error.message || "Failed to generate compliance audit." });
    }
};