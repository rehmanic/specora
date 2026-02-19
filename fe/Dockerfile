FROM node:20-alpine

WORKDIR /app

# Install dependencies (source is bind-mounted at runtime)
COPY package*.json ./
RUN npm install

# Default command — dev mode with hot-reload
CMD ["npm", "run", "dev"]
