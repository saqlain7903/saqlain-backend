
import express from "express";
import multer from "multer";
import cors from "cors";
import QRCode from "qrcode";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const NGROK_URL = " https://nonascetical-subdermic-edris.ngrok-free.dev";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
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

app.listen(5000, () => console.log("Backend running on port 5000"));
