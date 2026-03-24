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

    // Note: Duplicate and similarity checks moved to routes to allow for "Resume Registration" flow
    // (where the same creator can retry a failed upload).

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
