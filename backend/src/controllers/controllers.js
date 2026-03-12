const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const crypto = require('crypto'); 

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Docker Service Names for internal communication
const SCRAPER_API_URL = process.env.SCRAPER_API_URL || 'http://scraper-service:8000/api/capture';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-service:8001/audit';

// This Map will act as our temporary database to hold job statuses
const activeJobs = new Map();

// --- ENDPOINT 1: Start the Audit and Reply Instantly ---
exports.startAudit = async (req, res) => {
    const { targetUrl } = req.body;

    if (!targetUrl) {
        return res.status(400).json({ error: "Please provide a targetUrl." });
    }

    // 1. Generate a unique Ticket Number (Job ID)
    const jobId = crypto.randomUUID();

    // 2. Save the initial job status to our "database"
    activeJobs.set(jobId, { status: 'processing', report: null, error: null });

    // 3. IMMEDIATELY send the 202 Accepted response back to the phone/browser
    res.status(202).json({ jobId, status: 'processing', message: 'Audit started in the background.' });

    // 4. Kick off the heavy AI pipeline (Notice there is NO 'await' here!)
    runBackgroundAudit(jobId, targetUrl, req.hostname, process.env.PORT || 5000);
};


// --- BACKGROUND WORKER: The Heavy Lifting ---
async function runBackgroundAudit(jobId, targetUrl, hostname, port) {
    let screenshotPath = null;
    let screenshotFilename = null;
    let publicImagePath = null;

    console.log(`\n[*] Starting Background Pipeline Audit for Job [${jobId}]: ${targetUrl}`);

    try {
        // --- 1. CAPTURE ---
        console.log(`[*] [Job ${jobId}] Requesting screenshot from Scraper Service...`);
        const scraperResponse = await axios.post(SCRAPER_API_URL, { target_url: targetUrl });
        
        if (!scraperResponse.data || !scraperResponse.data.file_path) {
            throw new Error("Scraper returned success but no file path was found.");
        }
        
        screenshotPath = scraperResponse.data.file_path;
        console.log(`[+] [Job ${jobId}] Screenshot successfully saved at: ${screenshotPath}`);

        // --- 2. GEMINI EXTRACTION ---
        console.log(`[*] [Job ${jobId}] Sending image to Gemini 2.5 Flash for OCR...`);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });
        
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
        const responseText = result.response.text();

        // 1. Strip out the ```json and ``` markdown formatting
        let cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // 2. Look for square brackets [ ] since the prompt asks for an array
        const firstBracket = cleanedText.indexOf('[');
        const lastBracket = cleanedText.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);
        }

        // 3. Strip trailing commas before closing brackets or braces
        cleanedText = cleanedText.replace(/,\s*([}\]])/g, '$1');

        // 4. Safely parse!
        const geminiData = JSON.parse(cleanedText);

        // --- 3. FORMAT FOR LAYOUTLM ---
        console.log(`[*] [Job ${jobId}] Formatting OCR data for LayoutLM API...`);
        const words = [];
        const boxes = [];
        const clamp = (val) => Math.min(1000, Math.max(0, Math.round(val)));

        geminiData.forEach(item => {
            words.push(item.text);
            boxes.push([
                clamp(item.box_2d[1]), 
                clamp(item.box_2d[0]), 
                clamp(item.box_2d[3]), 
                clamp(item.box_2d[2])  
            ]);
        });

        // --- 4. HOST IMAGE FOR REACT ---
        const exportsDir = '/exports'; 
        screenshotFilename = path.basename(screenshotPath);
        publicImagePath = path.join(exportsDir, screenshotFilename);
        
        if (screenshotPath !== publicImagePath && fs.existsSync(screenshotPath)) {
            fs.copyFileSync(screenshotPath, publicImagePath);
        }
        
        const publicScreenshotUrl = `http://${hostname}:${port}/exports/${screenshotFilename}`;

        // --- 5. CALL THE PYTHON AI SERVICE ---
        console.log(`[*] [Job ${jobId}] Forwarding to Python AI Compliance Service...`);
        const form = new FormData();
        form.append('target_url', targetUrl);
        form.append('screenshot', fs.createReadStream(publicImagePath));
        form.append('words', JSON.stringify(words));
        form.append('boxes', JSON.stringify(boxes));

        const aiResponse = await axios.post(AI_SERVICE_URL, form, {
            headers: { ...form.getHeaders() }
        });

        // --- 6. SAVE FINAL REPORT TO MEMORY INSTEAD OF SENDING TO RES ---
        const finalReport = aiResponse.data;
        if (!finalReport.raw) finalReport.raw = {};
        finalReport.raw.screenshot_url = publicScreenshotUrl;

        console.log(`[*] [Job ${jobId}] Pipeline Complete! Report saved to memory.`);
        
        // Update the job status to completed!
        activeJobs.set(jobId, { status: 'completed', report: finalReport, error: null });

    } catch (error) {
        console.error(`[-] [Job ${jobId}] Background Audit Failed:`, error.message);
        // Save the error so the frontend knows to stop polling
        activeJobs.set(jobId, { status: 'failed', report: null, error: error.message || "Internal Server Error" });
    }
}


// --- ENDPOINT 2: The Polling Route for React to check status ---
exports.checkAuditStatus = (req, res) => {
    const { jobId } = req.params;
    const job = activeJobs.get(jobId);

    if (!job) {
        return res.status(404).json({ error: "Job ID not found or expired." });
    }

    // Returns { status: 'processing' | 'completed' | 'failed', report: {...}, error: '...' }
    res.status(200).json(job); 
};