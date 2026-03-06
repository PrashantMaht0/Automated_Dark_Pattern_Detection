FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy application source code
COPY src/ ./src/

# Create exports directory for shared volume with scraper
RUN mkdir -p /exports

EXPOSE 5000

CMD ["node", "src/server.js"]
