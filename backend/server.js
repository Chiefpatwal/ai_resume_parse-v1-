// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables first
dotenv.config();

// Routes
import authRoutes from "./src/routes/auth.js";
import atsRoutes from "./src/routes/ats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup for frontend communication
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware (ORDER MATTERS!)
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes (after middleware setup)
app.use("/api/auth", authRoutes);
app.use("/api/ats", atsRoutes);

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend is running ✅",
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || "development",
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working perfectly!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.message);
  console.error("Stack:", err.stack);
  
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "File too large. Maximum size is 10MB.",
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: ["/api/health", "/api/test", "/api/auth/*", "/api/ats/*"],
  });
});

// Start server
app.listen(PORT, () => {
  
});