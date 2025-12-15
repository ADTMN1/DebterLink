import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.random().toString(36).slice(2) + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

// Upload endpoint
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ status: true, url: fileUrl });
});

export default router;
