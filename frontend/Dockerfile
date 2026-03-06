FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files
COPY public/ ./public/
COPY src/ ./src/

EXPOSE 3000

CMD ["npm", "start"]
