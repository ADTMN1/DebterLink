import express from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/db.config.js";
import routes from "./src/index.js";
import dotenv from "dotenv";
import http from 'http'
import { initSocket } from "./src/controllers/socket.io/socket.io.js";
import "./events/event.listner.js"; // Import event listeners
dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());app.use((req, res, next) => {
  req.url = req.url.trim();
  next();
});


// Parse URL-encoded request bodies (optional)
app.use(express.urlencoded({ extended: true }));


// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
initSocket(server);

app.use("/api", routes);


const main = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL server time:", result.rows[0]);
  } catch (err) {
    console.error("Error running queries:", err);
  }
};

main();
app.get("/ping", (req, res) => res.send("pong"));
app.get("/", async (req, res) => {
  res.status(200).json({
    status: true,
    msg: "DEBTER LINK IS LIVE NOW."
  });
});

// Listen on the server (not app.listen)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
