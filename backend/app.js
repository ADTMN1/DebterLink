import "dotenv/config"; 
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/db.config.js";
import routes from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
