import dotenv from "dotenv";

dotenv.config();

const REQUIRED_ENV_VARS = [
  "PORT",
  "NODE_ENV",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CORS_ORIGIN",
  "GEMINI_API_KEY",
  "LIVEKIT_API_URL",
  "LIVEKIT_API_KEY",
  "LIVEKIT_API_SECRET",
  "NORMA_INDEX_PATH",
  "NORMA_META_PATH",
  "NORMA_CHUNKS_PATH",
  "NORMA_EMBED_MODEL",
  "NORMA_TOP_K",
  "NORMA_SIM_THRESHOLD",
];

export function loadEnv() {
  const missing = [];

  // checks if a key is missing
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key] || process.env[key].trim() === "") {
      missing.push(key);
    }
  }

  // exit process on missing key
  if (missing.length > 0) {
    missing.forEach((key) => console.error(` MISSING ENV - ${key}`));
    process.exit(1);
  }

  // 
  return Object.freeze({
    PORT: parseInt(process.env.PORT, 10),
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    LIVEKIT_API_URL: process.env.LIVEKIT_API_URL,
    LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET,
    NORMA_INDEX_PATH: process.env.NORMA_INDEX_PATH,
    NORMA_META_PATH: process.env.NORMA_META_PATH,
    NORMA_CHUNKS_PATH: process.env.NORMA_CHUNKS_PATH,
    NORMA_EMBED_MODEL: process.env.NORMA_EMBED_MODEL,
    NORMA_TOP_K: parseInt(process.env.NORMA_TOP_K, 10),
    NORMA_SIM_THRESHOLD: parseFloat(process.env.NORMA_SIM_THRESHOLD),
  });
}
