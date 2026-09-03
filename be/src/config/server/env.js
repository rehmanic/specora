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

/**
 * Loads and strictly validates all environment variables.
 * Exits process with code 1 if any required variables are missing.
 * @returns {Readonly<Record<string, any>>} Validated environment configuration object
 */
export function loadEnv() {
  const missing = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key] || process.env[key].trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error("❌ Fatal Environment Error: Missing required environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error("Please check your .env file and ensure all required keys are defined.");
    process.exit(1);
  }

  return Object.freeze({
    PORT: parseInt(process.env.PORT || "5000", 10),
    NODE_ENV: process.env.NODE_ENV || "development",
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
    NORMA_TOP_K: parseInt(process.env.NORMA_TOP_K || "5", 10),
    NORMA_SIM_THRESHOLD: parseFloat(process.env.NORMA_SIM_THRESHOLD || "0.25"),
  });
}
