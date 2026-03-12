# Real-Time Automated Detection and Regulatory Mapping of Dark Patterns Using Transformer-Based NLP

This repository contains the source code for a final-year engineering team project developed for the **MSc in Software Design with Artificial Intelligence** at the **Technological University of Shannon (TUS) - Athlone**. 

The primary objective of this project is to provide a highly accessible, automated web tool that utilizes advanced Vision Language Models (VLMs) and Natural Language Processing (NLP) to scan live websites. The system identifies deceptive user interface designs (Dark Patterns) and maps these manipulative practices directly to specific legal and regulatory violations.

## Collaborators
* **Prashant Mahto** - A00336051
* **Nitish Mudaliar** - A00336067
* **Gunatheeth Reddy Jampala** - A00335996

## Live Application
*(Click the image below to access the live Dark Pattern Detector)*

[![Dark Pattern Detector Dashboard]./frontend/res/image.png](https://www.darkpatterndetector.dev) 

## Tech Stack
* **Frontend:** React.js, Tailwind CSS
* **Backend Orchestrator:** Node.js, Express.js
* **Web Scraper:** Python, FastAPI, Selenium WebDriver (Headless Chrome)
* **AI & NLP Engine:** LayoutLM v3 (Hugging Face), Gemini 2.5 Flash (OCR / Spatial Parsing)
* **Infrastructure & DevOps:** Docker, Docker Compose, GitHub Actions (CI/CD)

## Project Directory
Our microservices architecture is divided into the following core directories:

* `/frontend` - The user-facing React dashboard for submitting URLs, polling for updates, and viewing the generated interactive compliance reports.
* `/backend` - The central Node.js API gateway that manages the polling architecture and coordinates data flow between the scraper and AI models.
* `/scraper-service` - A Python microservice dedicated to bypassing banners, rendering dynamic content, and capturing high-fidelity UI screenshots.
* `/ai-service` - The inference engine responsible for running Stage 1 OCR/Spatial detection and Stage 2 LLM classification on flagged visual elements.
* `/.github/workflows` - Contains our CI/CD pipeline configurations for automated testing and deployment.

## AI Model Performance & Capabilities

**Current Model Test Score:** `
- Accuracy:  0.9280
- Precision: 0.8952
- Recall:    0.9066
- F1 Score:  0.9009
`

The current iteration of our system is capable of accurately identifying seven distinct categories of dark patterns and mapping them to specific GDPR articles:

| Dark Pattern | Category | Violated Regulation (GDPR) | Detection Mechanism |
| :--- | :--- | :--- | :--- |
| **Deceptive Snugness** | Skipping | Art. 25(1), Art. 6, Art. 4(11) | OCR + Vision detects pre-checked boxes next to invasive terms. |
| **Look Over There** | Skipping | Art. 5(1)(a), Art. 12(1), Art. 12(2) | Vision detects high-contrast 'Accept' buttons dwarfing low-contrast 'Settings' links. |
| **Hidden in Plain Sight** | Stirring | Art. 5(1)(a), Art. 7, Art. 12(1) | Vision identifies crucial opt-out text with mathematically low CSS contrast ratios or tiny fonts. |
| **Emotional Steering** | Stirring | Art. 5(1)(a), Art. 12(1), Art. 8 | NLP/OCR isolates manipulative vocabulary inside button coordinates. |
| **Misleading Information** | Hindering | Art. 5(1)(a), Art. 12(1), Art. 7(2) | NLP detects semantic mismatch between a button's label and its standard expected action. |
| **Too Many Options** | Overloading | Art. 5(1)(a), Art. 12(1) | Vision detects an excessive density of toggle switches within a single bounding box area. |
| **Ambiguous Wording** | Left in the Dark | Art. 5(1)(a), Art. 12(1), Art. 13 | NLP/OCR detects double negatives or vague terminology in consent paragraphs. |