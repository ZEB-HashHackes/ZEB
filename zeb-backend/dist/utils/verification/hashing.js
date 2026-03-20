import crypto from "crypto";
/**
 * Generates a SHA-256 hash from a buffer.
 * @param buffer - The file content buffer.
 */
export function generateContentHash(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}
//# sourceMappingURL=hashing.js.map