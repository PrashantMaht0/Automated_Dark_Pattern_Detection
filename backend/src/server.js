// backend-node/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration for your Python Microservices
// In production (Docker), these would be e.g., 'http://scraper-service:8000'
const SCRAPER_API_URL = process.env.SCRAPER_API_URL || 'http://127.0.0.1:8000/api/capture';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:7860/analyze';

// Serve the exports folder statically so React can load the images
// This assumes your exports folder is in the root directory, two levels up from this file
app.use('/exports', express.static(path.join(__dirname, '../../exports')));

// ============================================================================
// 1. TEMPORARY TEST ROUTE (Bypasses AI to test Scraper)
// ============================================================================
app.post('/api/test-scraper', async (req, res) => {
    const { targetUrl } = req.body;

    if (!targetUrl) return res.status(400).json({ error: "URL is required" });

    console.log(`\n[Test] Requesting screenshot for: ${targetUrl}`);

    try {
        // Call the Python Scraper
        const scraperResponse = await axios.post(SCRAPER_API_URL, { target_url: targetUrl });
        const screenshotPath = scraperResponse.data.file_path;
        
        console.log(`[Test] Success! Image saved to: ${screenshotPath}`);

        // Extract just the filename (e.g., "site_audit_123.png")
        const fileName = path.basename(screenshotPath);
        
        // Return the URL so React can display it
        res.json({ 
            success: true, 
            imageUrl: `http://localhost:5000/exports/${fileName}` 
        });

    } catch (error) {
        console.error("Scraper Test Failed:", error.message);
        res.status(500).json({ error: "Scraper service failed." });
    }
});

// ============================================================================
// 2. FULL AUDIT ROUTE (Calls Scraper, then LayoutLM AI)
// ============================================================================
app.post('/api/audit', async (req, res) => {
    const { targetUrl } = req.body;

    if (!targetUrl) {
        return res.status(400).json({ error: "Please provide a targetUrl." });
    }

    console.log(`\n[1] Starting Audit for: ${targetUrl}`);

    try {
        console.log(`[2] Requesting screenshot from Scraper Service...`);
        const scraperResponse = await axios.post(SCRAPER_API_URL, {
            target_url: targetUrl
        });

        const screenshotPath = scraperResponse.data.file_path;
        console.log(`[3] Screenshot captured successfully: ${screenshotPath}`);

        if (!fs.existsSync(screenshotPath)) {
            throw new Error(`Screenshot not found at ${screenshotPath}`);
        }

        console.log(`[4] Forwarding screenshot and URL to AI Inference Engine...`);
        
        const formData = new FormData();
        formData.append('target_url', targetUrl);
        formData.append('screenshot', fs.createReadStream(screenshotPath));

        const aiResponse = await axios.post(AI_SERVICE_URL, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        console.log(`[5] AI Audit Complete. Returning report to Client.`);
        res.json(aiResponse.data);

    } catch (error) {
        console.error("[-] Audit Pipeline Failed:");
        if (error.response) {
            console.error("Service Error:", error.response.data);
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            console.error(error.message);
            res.status(500).json({ error: "Internal Server Error during the audit pipeline." });
        }
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Node.js Orchestrator running on http://localhost:${PORT}`);
});