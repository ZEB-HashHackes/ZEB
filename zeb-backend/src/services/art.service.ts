import fs from "fs";
import path from "path";
import { VerificationService } from "./verification.service.js";
import Art from "../models/art.model.js";


export class ArtService {

  static async storeFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error("No file provided");
    }

    const { fileType, contentHash, similarityHash, similarityMethod } = 
      await VerificationService.verify(file.buffer, file.mimetype);

    // Check for exact duplicates
    const existingExact = await Art.findOne({ contentHash });
    if (existingExact) {
      throw new Error("Duplicate artwork detected (exact match)");
    }

    // Check for near duplicates (Similarity)
    if (similarityHash) {
      const similarArt = await Art.findOne({ similarityHash, similarityMethod });
      if (similarArt) {
         throw new Error("Similar artwork already exists");
      }
    }

    const ext = file.mimetype.split("/")[1] || "png";
    const fileName = `${contentHash}.${ext}`;
    const uploadDir = path.resolve("uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.buffer);
    }

    return {
      contentHash,
      similarityHash,
      similarityMethod,
      fileType,
      mimeType: file.mimetype,
      filePath: `uploads/${fileName}`
    };
  }
}
