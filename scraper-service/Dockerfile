FROM python:3.10-slim

WORKDIR /app

# Install Chrome for Selenium headless browsing
RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    unzip \
    curl \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY scraper_api.py .

# Create exports directory inside the container
RUN mkdir -p /exports

EXPOSE 8000

CMD ["uvicorn", "scraper_api:app", "--host", "0.0.0.0", "--port", "8000"]
