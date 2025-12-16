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
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || [],
    credentials: true,
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
  max: 5,
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
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
