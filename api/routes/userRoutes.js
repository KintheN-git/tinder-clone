import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.js";
import { updateProfile } from "../controllers/userController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
router.put("/update", protectRoute, upload.single("image"), updateProfile);

export default router;
