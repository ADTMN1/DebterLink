import express from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/db.config.js";
import routes from "./src/index.js";
import dotenv from "dotenv";
import http from 'http'
import { initSocket } from "./src/controllers/socket.controller/socketIo.js";
import "./events/event.listner.js"; // Import event listeners
import { sanitizeInput } from "./src/middleware/sanitize.js";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ["https://yourfrontend.com"], 
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);

// Rate limiter for auth
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many requests, try again later.",
});
app.use("/api/auth/login", authLimiter);

// Static files
app.use("/uploads", express.static("uploads"));

// Trim URLs
app.use((req, res, next) => {
  req.url = req.url.trim();
  next();
});

// Socket.io
const server = http.createServer(app);
initSocket(server)

// API routes
app.use("/api", routes);

// DB check
const main = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL server time:", result.rows[0]);
  } catch (err) {
    console.error("Error running queries:", err.message);
  }
};
main();

// Root endpoint
app.get("/", async (req, res) => {
  res.status(200).json({
    status: true,
    msg: "DEBTER LINK IS LIVE NOW."
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
