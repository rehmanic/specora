import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./src/modules/auth/authRoutes.js";
import userRoutes from "./src/modules/users/userRoutes.js";
import projectRoutes from "./src/modules/projects/projectsRoutes.js";
import feedbackRoutes from "./src/modules/feedback/routes.js";

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// FIX: Explicitly allow localhost:3000 so the frontend can connect
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Logging (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.get("/", (req, res) => {
  res.json({ message: "root API is running..." });
});

// Health endpoint to quickly verify server + CORS from browser
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || null });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/feedback", feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;