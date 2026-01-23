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



const app = express();

dotenv.config();
app.use(helmet());
app.use(express.json());

// ----- CORS Configuration -----
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from specified origin
    credentials: true,  // cookies/auth headers are allowed for that site
  })
);

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

// ----- 404 Handler -----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
