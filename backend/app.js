import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./modules/auth/routes.js";
import specbotRoutes from "./modules/specbot/routes.js";
import meetingsRoutes from "./modules/meetings/routes.js";
import videoRoutes from "./modules/video/routes.js";

// Import database connection
import { sequelize, testConnection } from "./config/database.js";

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Specora API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
const API_PREFIX = process.env.API_PREFIX || "/api";
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/specbot`, specbotRoutes);
app.use(`${API_PREFIX}/meetings`, meetingsRoutes);
app.use(`${API_PREFIX}/video`, videoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  res.status(err.status || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Initialize database connection
testConnection();

export default app;
