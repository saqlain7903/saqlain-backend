/*
import express from "express";
import multer from "multer";
import cors from "cors";
import QRCode from "qrcode";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NGROK_URL = process.env.NGROK_URL;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post("/api/files/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `${NGROK_URL}/uploads/${req.file.filename}`;
    const qrCodeBase64 = await QRCode.toDataURL(imageUrl);

    res.json({
      success: true,
      imageUrl,
      qrCode: qrCodeBase64,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
*/

import express from "express";
import multer from "multer";
import cors from "cors";
import QRCode from "qrcode";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL; // Render URL

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post("/api/files/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileUrl = `${SERVER_URL}/uploads/${req.file.filename}`;
    const qrBase64 = await QRCode.toDataURL(fileUrl);

    res.json({
      success: true,
      fileUrl,
      qrCode: qrBase64,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
