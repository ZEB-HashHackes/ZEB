import { ArtStatus, FileType, SimilarityMethod, default as Art } from "../models/art.model.ts";
import { generateContentHash } from "../utils/verification/hashing.ts";
import { generatePHash, calculateHammingDistance } from "../utils/verification/image.ts";
import { generateVideoSignature } from "../utils/verification/video.ts";
import { generateAudioSignature } from "../utils/verification/audio.ts";
import { normalizeText, calculateTextSimilarity } from "../utils/verification/text.ts";
import mime from "mime-types";
import path from "path";
import fs from "fs";

export interface VerificationResult {
  status: "accepted" | "flagged" | "rejected";
  message: string;
  data?: any;
}

export class VerificationService {
  private static readonly IMAGE_SIMILARITY_THRESHOLD = 5; // Hamming distance
  private static readonly TEXT_SIMILARITY_THRESHOLD = 0.85; // 85% similarity
  private static readonly VIDEO_SIMILARITY_THRESHOLD = 5; // Hamming distance per frame

  /**
   * Main verification flow for uploaded content.
   */
  static async verifyContent(
    file: Express.Multer.File,
    metadata: { title: string; description?: string; creatorBy: string; ownedBy: string; category: string; minPrice: number }
  ): Promise<VerificationResult> {
    const mimeType = file.mimetype || mime.lookup(file.originalname) || "application/octet-stream";
    const fileType = this.getFileType(mimeType);
    const contentHash = generateContentHash(file.buffer);

    // 1. Check for Exact Duplicate
    const exactDuplicate = await Art.findOne({ contentHash });
    if (exactDuplicate) {
      return { status: "rejected", message: "Exact content already exists." };
    }

    // 2. Process Similarity based on File Type
    let similarityHash: string | undefined;
    let similarityMethod: SimilarityMethod = SimilarityMethod.NONE;
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
        } finally {
          if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
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
        // NOTE: For better performance, we'd use a search engine or vector DB, 
        // but for MVP we load and compare with string-similarity.
        for (const t of allTexts) {
          // Since we might not have the original buffer, we might need to store the normalized text or re-read file
          // Improv for MVP: If exact normalized hash matches, it's flagged.
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
    
    // In a real app, we'd save the file to a storage bucket/disk here. 
    // Assuming uploads/ directory as per existing codebase.
    const uploadPath = `uploads/${Date.now()}_${file.originalname}`;
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

  private static getFileType(mimeType: string): FileType {
    if (mimeType.startsWith("image/")) return FileType.IMAGE;
    if (mimeType.startsWith("video/")) return FileType.VIDEO;
    if (mimeType.startsWith("audio/")) return FileType.AUDIO;
    if (mimeType.startsWith("text/") || mimeType === "application/pdf") return FileType.TEXT;
    return FileType.TEXT; // Default
  }
}
