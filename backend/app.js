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
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/feedback", feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
