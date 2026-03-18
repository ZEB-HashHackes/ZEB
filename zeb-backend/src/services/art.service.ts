import crypto from "crypto";
import fs from "fs";
import path from "path";


export class ArtService {

  static async storeFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error("No file provided");
    }

    const hash = crypto.createHash("sha256")
                       .update(file.buffer)
                       .digest(); 
    if (hash.length !== 32) {
      throw new Error("Hash is not 32 bytes");
    }

    const hashHex = hash.toString("hex");

    const uploadDir = path.resolve("uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, hashHex);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.buffer);
    }

    return {
      hashHex,      // store in DB
      hashBuffer: hash // send to Stellar
    };
  }
}
