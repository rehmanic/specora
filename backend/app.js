import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import sequelize from "./config/database.js";
import "./database/models/index.js"; // Load model associations
import { isQueueHealthy } from "./core/services/queueService.js";

// Import routes
import meetingsRoutes from "./modules/meetings/routes.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "Specora API is running...",
    version: "1.0.0",
    endpoints: {
      meetings: "/api/meetings"
    }
  });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  const redisHealthy = await isQueueHealthy();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: "connected",
      redis: {
        connected: redisHealthy,
        message: redisHealthy ? "Queue system active" : "Queue features disabled"
      }
    }
  });
});

// API Routes
app.use("/api/meetings", meetingsRoutes);

// Database sync
const syncDatabase = async () => {
  try {
    // alter: true will update existing tables to match models
    // force: true will drop and recreate tables (use with caution!)
    await sequelize.sync({ alter: true });
    console.log("✓ Database synchronized successfully");
  } catch (error) {
    console.error("✗ Database synchronization failed:", error);
  }
};

// Sync database on startup
if (process.env.NODE_ENV === "development") {
  syncDatabase();
}

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

export default app; 
