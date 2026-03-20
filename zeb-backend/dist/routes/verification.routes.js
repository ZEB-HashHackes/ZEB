import express from "express";
import multer from "multer";
import { VerificationService } from "../services/verification.service.js";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
/**
 * Handle content upload and verification.
 */
router.post("/verify", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: "error", message: "File is required." });
        }
        const title = req.body.title?.replace(/^"(.*)"$/, '$1');
        const description = req.body.description?.replace(/^"(.*)"$/, '$1');
        const creatorBy = req.body.creatorBy?.replace(/^"(.*)"$/, '$1');
        const ownedBy = req.body.ownedBy?.replace(/^"(.*)"$/, '$1');
        const category = req.body.category?.replace(/^"(.*)"$/, '$1');
        const minPrice = req.body.minPrice;
        if (!title || !creatorBy || !ownedBy || !category || minPrice === undefined) {
            return res.status(400).json({ status: "error", message: "Missing required metadata fields." });
        }
        const result = await VerificationService.verifyContent(req.file, {
            title,
            description,
            creatorBy,
            ownedBy,
            category,
            minPrice: Number(minPrice)
        });
        if (result.status === "rejected") {
            return res.status(409).json(result);
        }
        res.status(201).json(result);
    }
    catch (err) {
        console.error("Verification Error:", err);
        res.status(500).json({ status: "error", message: "Internal server error during verification." });
    }
});
export default router;
//# sourceMappingURL=verification.routes.js.map