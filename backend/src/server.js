// backend-node/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const SCRAPER_API_URL = process.env.SCRAPER_API_URL || 'http://127.0.0.1:8000/api/capture';
// AI_SERVICE_URL removed temporarily for local testing

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ensure exports directory exists
const exportsDir = path.join(__dirname, '../../exports');
if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
}

app.use('/exports', express.static(exportsDir));

app.post('/api/audit', async (req, res) => {
    const { targetUrl } = req.body;

    if (!targetUrl) {
        return res.status(400).json({ error: "Please provide a targetUrl." });
    }

    console.log(`\n[1] Starting Local Audit Test for: ${targetUrl}`);

    try {
        // --- 1. CAPTURE ---
        console.log(`[2] Requesting screenshot from Scraper Service...`);
        const scraperResponse = await axios.post(SCRAPER_API_URL, { target_url: targetUrl });
        const screenshotPath = scraperResponse.data.file_path;
        const dimensions = scraperResponse.data.dimensions;
        console.log(`[3] Screenshot captured successfully: ${screenshotPath}`);

        if (!fs.existsSync(screenshotPath)) {
            throw new Error(`Screenshot not found at ${screenshotPath}`);
        }

        // --- 2. GEMINI EXTRACTION ---
        console.log(`[4] Sending image to Gemini 2.5 Flash for OCR and spatial detection...`);
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
        
        // Safety net: Strip markdown fences if the model ignores the prompt instruction
        responseText = responseText.replace(/```json|```/gi, '').trim();
        
        const geminiData = JSON.parse(responseText);

        // --- 3. FORMAT FOR LAYOUTLM & SAVE LOCALLY ---
        console.log(`[5] Processing coordinates and saving locally...`);
        
        // Transform the data to swap [ymin, xmin, ymax, xmax] to [xmin, ymin, xmax, ymax]
        const processedData = geminiData.map(item => ({
            text: item.text,
            label: item.label,
            // LayoutLMv3 expects [x1, y1, x2, y2]
            layout_box: [
                item.box_2d[1], // xmin
                item.box_2d[0], // ymin
                item.box_2d[3], // xmax
                item.box_2d[2]  // ymax
            ]
        }));

        // Generate a unique filename and save to the exports folder
        const timestamp = Date.now();
        const jsonFileName = `audit_data_${timestamp}.json`;
        const jsonFilePath = path.join(exportsDir, jsonFileName);
        
        fs.writeFileSync(jsonFilePath, JSON.stringify(processedData, null, 2));
        console.log(`[6] Local Test Complete. Data saved to: ${jsonFilePath}`);
        
        // Return the extracted data to the React frontend
        res.json({
            success: true,
            message: "Local extraction successful",
            screenshot_used: screenshotPath,
            dimensions: dimensions, // Send to React
            saved_json_path: jsonFilePath,
            extracted_elements_count: processedData.length,
            data: processedData
        });

    } catch (error) {
        console.error("[-] Audit Pipeline Failed:");
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error during the local audit pipeline." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Node.js Orchestrator running on http://localhost:${PORT}`);
});