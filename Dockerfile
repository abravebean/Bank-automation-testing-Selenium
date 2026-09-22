FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV HEADLESS=true
ENV CHROME_BIN=/usr/bin/chromium
EXPOSE 3000
CMD ["node", "server.js"]