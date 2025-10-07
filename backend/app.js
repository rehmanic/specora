import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

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
  res.json({ message: "API is running..." });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app; 
