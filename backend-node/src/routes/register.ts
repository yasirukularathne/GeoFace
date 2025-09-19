import express, { Request, Response } from "express";
import multer from "multer";

const router = express.Router();
const upload = multer();

// POST /api/register - receive photo upload
router.post("/", upload.single("photo"), (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No photo uploaded" });
  }
  // For now, just confirm receipt and return file info
  res.json({
    message: "Photo received",
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });
});

export default router;
