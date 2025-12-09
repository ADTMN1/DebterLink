import express from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/db.config.js";
import routes from "./src/index.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT ;

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());app.use((req, res, next) => {
  req.url = req.url.trim();
  next();
});


// Parse URL-encoded request bodies (optional)
app.use(express.urlencoded({ extended: true }));


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

// const router = express.Router()
// route.get(
app.listen(PORT, (req,res) => {
  console.log(`Server running on port ${PORT}`);


  
});
