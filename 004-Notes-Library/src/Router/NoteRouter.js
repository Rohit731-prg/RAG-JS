import express from "express";
import { upload } from "../Middleware/Multer.js";
import { note_quary, uploadPDF } from "../Controller/NoteController.js";

const router = express.Router();

router.post("/add", upload.single("pdf"), uploadPDF);
router.post("/query", note_quary);

export default router;