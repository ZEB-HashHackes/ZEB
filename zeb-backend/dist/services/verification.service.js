import { ArtStatus, FileType, SimilarityMethod, default as Art } from "../models/art.model.js";
import { generateContentHash } from "../utils/verification/hashing.js";
import { generatePHash, calculateHammingDistance } from "../utils/verification/image.js";
import { generateVideoSignature } from "../utils/verification/video.js";
import { generateAudioSignature } from "../utils/verification/audio.js";
import { normalizeText, calculateTextSimilarity } from "../utils/verification/text.js";
import mime from "mime-types";
import path from "path";
import fs from "fs";
export class VerificationService {
    static IMAGE_SIMILARITY_THRESHOLD = 5; // Hamming distance
    static TEXT_SIMILARITY_THRESHOLD = 0.85; // 85% similarity
    static VIDEO_SIMILARITY_THRESHOLD = 5; // Hamming distance per frame
    /**
     * Main verification flow for uploaded content.
     */
    static async verifyContent(file, metadata) {
        const mimeType = file.mimetype || mime.lookup(file.originalname) || "application/octet-stream";
        const fileType = this.getFileType(mimeType);
        const contentHash = generateContentHash(file.buffer);
        // 1. Check for Exact Duplicate
        const exactDuplicate = await Art.findOne({ contentHash });
        if (exactDuplicate) {
            return { status: "rejected", message: "Exact content already exists." };
        }
        // 2. Process Similarity based on File Type
        let similarityHash;
        let similarityMethod = SimilarityMethod.NONE;
        let isFlagged = false;
        let flagMessage = "";
        switch (fileType) {
            case FileType.IMAGE:
                similarityHash = await generatePHash(file.buffer);
                similarityMethod = SimilarityMethod.PHASH;
                const similarImages = await Art.find({ fileType: FileType.IMAGE, similarityHash: { $exists: true } });
                for (const img of similarImages) {
                    if (img.similarityHash && calculateHammingDistance(similarityHash, img.similarityHash) <= this.IMAGE_SIMILARITY_THRESHOLD) {
                        isFlagged = true;
                        flagMessage = "Similar image detected.";
                        break;
                    }
                }
                break;
            case FileType.VIDEO:
                // For video, we need a temporary file on disk for fluent-ffmpeg
                const tempVideoPath = path.resolve(`temp_video_${Date.now()}_${file.originalname}`);
                fs.writeFileSync(tempVideoPath, file.buffer);
                try {
                    const frameHashes = await generateVideoSignature(tempVideoPath);
                    similarityHash = frameHashes.join(","); // Concatenated hashes for simple DB storage
                    similarityMethod = SimilarityMethod.FRAME_PHASH;
                    const existingVideos = await Art.find({ fileType: FileType.VIDEO, similarityMethod: SimilarityMethod.FRAME_PHASH });
                    for (const vid of existingVideos) {
                        if (vid.similarityHash) {
                            const existingHashes = vid.similarityHash.split(",");
                            // Compare first frame for now (MVP simplification)
                            if (existingHashes[0] && frameHashes[0] && calculateHammingDistance(frameHashes[0], existingHashes[0]) <= this.VIDEO_SIMILARITY_THRESHOLD) {
                                isFlagged = true;
                                flagMessage = "Similar video frames detected.";
                                break;
                            }
                        }
                    }
                }
                finally {
                    if (fs.existsSync(tempVideoPath))
                        fs.unlinkSync(tempVideoPath);
                }
                break;
            case FileType.AUDIO:
                similarityHash = generateAudioSignature(file.buffer);
                similarityMethod = SimilarityMethod.AUDIO_SIGNATURE;
                // Exact match of signature (which is a hash of a slice)
                const similarAudio = await Art.findOne({ fileType: FileType.AUDIO, similarityHash });
                if (similarAudio) {
                    isFlagged = true;
                    flagMessage = "Similar audio signature detected.";
                }
                break;
            case FileType.TEXT:
                const normalized = normalizeText(file.buffer.toString());
                similarityHash = generateContentHash(Buffer.from(normalized));
                similarityMethod = SimilarityMethod.TEXT_NORMALIZED_HASH;
                const allTexts = await Art.find({ fileType: FileType.TEXT });
                for (const t of allTexts) {
                    if (t.similarityHash === similarityHash) {
                        isFlagged = true;
                        flagMessage = "Duplicate normalized text content detected.";
                        break;
                    }
                }
                break;
        }
        // 3. Save Artwork Metadata
        const status = isFlagged ? ArtStatus.FLAGGED : ArtStatus.ACTIVE;
        const uploadPath = `uploads/${Date.now()}_${file.originalname}`;
        if (!fs.existsSync(path.resolve("uploads"))) {
            fs.mkdirSync(path.resolve("uploads"), { recursive: true });
        }
        fs.writeFileSync(path.resolve(uploadPath), file.buffer);
        const art = await Art.create({
            ...metadata,
            filePath: uploadPath,
            fileType,
            mimeType,
            contentHash,
            similarityHash,
            similarityMethod,
            status
        });
        return {
            status: isFlagged ? "flagged" : "accepted",
            message: isFlagged ? flagMessage : "Upload successful.",
            data: art
        };
    }
    static getFileType(mimeType) {
        if (mimeType.startsWith("image/"))
            return FileType.IMAGE;
        if (mimeType.startsWith("video/"))
            return FileType.VIDEO;
        if (mimeType.startsWith("audio/"))
            return FileType.AUDIO;
        if (mimeType.startsWith("text/") || mimeType === "application/pdf")
            return FileType.TEXT;
        return FileType.TEXT; // Default
    }
}
//# sourceMappingURL=verification.service.js.map