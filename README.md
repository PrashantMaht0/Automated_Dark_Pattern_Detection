# Automated Dark Pattern Detection
A web-based tool that uses a transformer-based Vision Language Model (LayoutLM) to identify and categorize dark patterns and non-compliant UI practices on live websites.

## Tech Stack
* **Front-end:** React with JavaScript and Tailwind CSS
* **Back-end:** Node.js (Express) Orchestrator
* **Web Scraper:** Python (FastAPI & Selenium WebDriver)
* **AI Model Hosting:** Hugging Face Spaces (LayoutLM v3)
* **Deployment:** Docker & Docker Compose

## Project Structure
* `/frontend-react` - The user-facing dashboard for submitting URLs and viewing compliance reports.
* `/backend-node` - The central API gateway that coordinates the scraper and the AI model.
* `/scraper-service` - A microservice using headless Chrome to navigate websites, bypass cookie banners, and capture full-page screenshots.
* `/ai-service` - The inference engine that analyzes the screenshots and maps UI elements to regulatory violations (like GDPR or CPRA).

## How to Run Locally (Development Mode)
To run the project without Docker, you will need to start the three core services in separate terminal windows.

**1. Start the Scraper Service (Python)**
\`\`\`bash
cd scraper-service
pip install -r requirements.txt
uvicorn scraper_api:app --host 127.0.0.1 --port 8000
\`\`\`

**2. Start the Orchestrator (Node.js)**
\`\`\`bash
cd backend-node
npm install
npx nodemon src/server.js
\`\`\`

**3. Start the Frontend (React)**
\`\`\`bash
cd frontend-react
npm install
npm start
\`\`\`
The application will be available at `http://localhost:3000`.

## How to Run with Docker
*(WIP)*
\`\`\`bash
docker-compose up --build
\`\`\`

## temp folders for testing 
for the testing phase or scraper the png files will be stored in the local exports dir of project
