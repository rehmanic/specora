import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Registers all global middlewares on the Express application.
 * @param {import("express").Application} app Express application instance
 */
export function registerMiddlewares(app) {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(express.json());

  // Static file serving
  app.use("/uploads", express.static(path.join(__dirname, "..", "..", "storage", "uploads")));
  app.use("/recordings", express.static(path.join(__dirname, "..", "..", "storage", "recordings")));

  // Development-only request logging
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
}
