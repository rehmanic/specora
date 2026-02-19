FROM ghcr.io/ggml-org/whisper.cpp:main AS whisper

FROM node:20-slim

WORKDIR /app

# Install system dependencies
# ffmpeg: required for audio processing
# curl: for downloading models
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Whisper CLI binary and shared libraries
COPY --from=whisper /app/build/bin/whisper-cli /usr/local/bin/whisper-cli
COPY --from=whisper /app/build/src/libwhisper.so.1 /usr/local/lib/
COPY --from=whisper /app/build/ggml/src/libggml*.so.* /usr/local/lib/
RUN ldconfig

# Download Whisper model during build
RUN mkdir -p /usr/local/share/whisper/models && \
    curl -L https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin -o /usr/local/share/whisper/models/ggml-small.bin

# Install dependencies (source is bind-mounted at runtime)
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY config/db/schema.prisma ./config/db/schema.prisma
RUN npx prisma generate --schema=config/db/schema.prisma

# Default command — dev mode with nodemon hot-reload
CMD ["npm", "run", "dev"]
