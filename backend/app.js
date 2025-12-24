import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import http from "http";
import rateLimit from "express-rate-limit";

import pool from "./config/db.config.js";
import routes from "./src/index.js";
import { initSocket } from "./src/controllers/socket.controller/socketIo.js";
import { sanitizeInput } from "./src/middleware/sanitize.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 2000;

/* ======================
   Security Middleware
====================== */

// HTTP headers
app.use(helmet());

// CORS
// Explicitly allow frontend origin and development origins
const corsOrigin = process.env.CLIENT_ORIGIN ? 
  process.env.CLIENT_ORIGIN.split(",") : 
  ["http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:5001", "http://127.0.0.1:5001", "http://localhost:3000"];
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Body limits (PREVENT DoS)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/* ======================
   Rate Limiters
====================== */

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20, // Increased from 5 to 20
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api/auth", authLimiter);
app.use("/api", generalLimiter);

/* ======================
   Static Files
====================== */
app.use("/uploads", express.static("uploads"));

/* ======================
   Routes
====================== */

// Sanitize ONLY request input routes
app.use("/api", sanitizeInput, routes);

/* ======================
   Health Check
====================== */
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "db down" });
  }
});

/* ======================
   Root
====================== */
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "DEBTER LINK IS LIVE",
  });
});

/* ======================
   Global Error Handler
====================== */
app.use(errorHandler);

/* ======================
   Socket.IO
====================== */
initSocket(server);

/* ======================
   Server Start
====================== */
function tryListen(port, attempts = 0, maxAttempts = 10) {
  server.removeAllListeners("error");

  server.once("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      if (attempts < maxAttempts) {
        const nextPort = port + 1;
        console.warn(
          `Port ${port} is in use, attempting to listen on port ${nextPort} (attempt ${attempts + 1}/${maxAttempts})`
        );
        // try next port
        tryListen(nextPort, attempts + 1, maxAttempts);
      } else {
        console.error(
          `Failed to bind to a port after ${maxAttempts} attempts. Please free a port or set a different PORT in your environment.`
        );
        process.exit(1);
      }
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

tryListen(Number(PORT));
