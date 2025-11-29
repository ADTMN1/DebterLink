

import express from "express";
import cors from "cors";
import helmet from "helmet";
import("dotenv/config");
import pool from "./config/db.config.js";

const app = express();
const Port = process.env.PORT || 1212;

app.use(helmet());
app.use(cors({ origin: "*" })); //ACCEPT ALL ORIGIN FOR NOW
app.use(express.json());

// server.js

const main = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL server time:", result.rows[0]);

    // await pool.end();
    // console.log('Database connection closed');
  } catch (err) {
    console.error("Error running queries:", err);
  }
};

main();

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
