// ----- Core Libraries -----
import express from "express"; // Web framework for building REST APIs
import dotenv from "dotenv";
// ----- Middleware -----
import morgan from "morgan"; // HTTP request logger
import helmet from "helmet"; // Security middleware for setting HTTP headers
import cors from "cors"; // Enables Cross-Origin Resource Sharing

// ----- Route Modules -----
import authRoutes from "./src/modules/auth/authRoutes.js";
import userRoutes from "./src/modules/users/userRoutes.js";
import projectRoutes from "./src/modules/projects/projectsRoutes.js";
import specbotRoutes from "./src/modules/specbot/specbotRoutes.js";
import chatRoutes from "./src/modules/chat/chatRoutes.js";
import uploadRoutes from "./src/modules/upload/uploadRoutes.js";
import feedbacksRoutes from "./src/modules/feedbacks/feedbacksRoutes.js";
import meetingsRoutes from "./src/modules/meetings/meetingsRoutes.js";
import requirementsRoutes from "./src/modules/requirements/requirementsRoutes.js";
import economicFeasibilityRoutes from "./src/modules/economicFeasibility/economicFeasibilityRoutes.js";
import techFeasibilityRoutes from "./src/modules/technicalFeasibility/techFeasibilityRoutes.js";
import prototypingRoutes from "./src/modules/prototyping/prototypingRoutes.js";
import verificationRoutes from "./src/modules/verification/verificationRoutes.js";
import diagramRoutes from "./src/modules/diagrams/diagramRoutes.js";
import docRoutes from "./src/modules/docs/docRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();

// ----- CORS Configuration -----
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from specified origin
    credentials: true,  // cookies/auth headers are allowed for that site
  })
);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// ----- Static Files -----
app.use("/uploads", express.static(path.join(__dirname, "storage", "uploads")));
app.use("/recordings", express.static(path.join(__dirname, "storage", "recordings")));

// ----- Development Logging -----
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ----- Base Route -----
app.get("/", (req, res) => {
  res.json({ message: "root" });
});

// ----- API Routes -----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/specbot", specbotRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/feedbacks", feedbacksRoutes);
app.use("/api/meetings", meetingsRoutes);
app.use("/api/requirements", requirementsRoutes);
app.use("/api/economic-feasibility", economicFeasibilityRoutes);
app.use("/api/tech-feasibility", techFeasibilityRoutes);
app.use("/api/prototyping", prototypingRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/diagrams", diagramRoutes);
app.use("/api/docs/:projectId", docRoutes);

// ----- 404 Handler -----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
